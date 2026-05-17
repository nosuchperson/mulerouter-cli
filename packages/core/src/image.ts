import { readFileSync, statSync } from "node:fs";
import { basename, resolve, sep } from "node:path";
import { lookup } from "./mime.js";

/** Parameter names that accept image input. */
export const IMAGE_PARAM_NAMES = new Set([
  "image",
  "images",
  "first_frame",
  "last_frame",
  "first_frame_url",
  "last_frame_url",
  "ref_images_url",
  "reference_images",
  "mask_image_url",
  "mask",
]);

/** Allowed image file extensions. */
const ALLOWED_IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".webp",
  ".tiff",
  ".tif",
  ".svg",
  ".ico",
  ".heic",
  ".heif",
  ".avif",
]);

/** Sensitive home directories that should never be read from. */
const SENSITIVE_HOME_DIRS = new Set([
  ".ssh",
  ".gnupg",
  ".gpg",
  ".aws",
  ".azure",
  ".gcloud",
  ".config",
  ".kube",
  ".docker",
  ".npm",
  ".pypirc",
]);

/** Sensitive system directory prefixes. */
const SENSITIVE_SYSTEM_PREFIXES = ["/etc", "/proc", "/sys", "/dev"];

/** Check if a parameter name is an image parameter. */
export function isImageParam(name: string): boolean {
  return IMAGE_PARAM_NAMES.has(name);
}

/** Get the file extension in lowercase. */
function getExtension(filePath: string): string {
  const name = basename(filePath);
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex === -1) return "";
  return name.slice(dotIndex).toLowerCase();
}

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20 MB

/** Validate that a file path points to a safe, allowed image file.
 * Throws on invalid paths. */
export function validateImagePath(filePath: string): string {
  const resolved = resolve(filePath);

  const ext = getExtension(resolved);
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    const allowed = [...ALLOWED_IMAGE_EXTENSIONS].sort().join(", ");
    throw new Error(
      `File '${filePath}' has extension '${ext}' which is not an allowed image format. Allowed extensions: ${allowed}`,
    );
  }

  // Block sensitive system directories
  for (const prefix of SENSITIVE_SYSTEM_PREFIXES) {
    if (resolved === prefix || resolved.startsWith(`${prefix}/`)) {
      throw new Error(`Access denied: '${filePath}' is in a sensitive system directory`);
    }
  }

  // Block sensitive home directory dotfiles/dotdirs
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  if (home && (resolved === home || resolved.startsWith(home + sep))) {
    const relative = resolved.slice(home.length + 1);
    const firstComponent = relative.split(sep)[0];
    if (firstComponent?.startsWith(".") && SENSITIVE_HOME_DIRS.has(firstComponent)) {
      throw new Error(`Access denied: '${filePath}' is in a sensitive home directory`);
    }
  }

  // Check file size
  const stat = statSync(resolved, { throwIfNoEntry: false });
  if (stat && stat.size > MAX_IMAGE_SIZE) {
    throw new Error(
      `File '${filePath}' is ${(stat.size / 1024 / 1024).toFixed(1)}MB, exceeding the ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit`,
    );
  }

  return resolved;
}

/** Check if a string value looks like a local image file path. */
export function isLocalImageFile(value: string): boolean {
  if (typeof value !== "string") return false;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return false;
  }
  try {
    const resolved = validateImagePath(value);
    const stat = statSync(resolved, { throwIfNoEntry: false });
    return stat?.isFile() ?? false;
  } catch {
    return false;
  }
}

/** Convert a local image file to base64 data URI. */
export function fileToBase64(filePath: string): string {
  const resolved = validateImagePath(filePath);
  const mimeType = lookup(resolved) ?? "image/png";
  const data = readFileSync(resolved);
  const base64 = data.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

/** Convert image parameter value, handling local file paths. */
export function convertImageValue(value: unknown): unknown {
  if (typeof value === "string") {
    return isLocalImageFile(value) ? fileToBase64(value) : value;
  }
  if (Array.isArray(value)) {
    return value.map(convertImageValue);
  }
  return value;
}

/** Image field names inside element objects. */
const ELEMENT_IMAGE_FIELDS = new Set(["frontal_image", "reference_images"]);

/** Process request body, converting local file paths to base64. */
export function processImageParams(body: Record<string, unknown>): Record<string, unknown> {
  const result = { ...body };

  for (const key of IMAGE_PARAM_NAMES) {
    if (key in result) {
      result[key] = convertImageValue(result[key]);
    }
  }

  if (Array.isArray(result.elements)) {
    result.elements = result.elements.map((element: unknown) => {
      if (typeof element === "object" && element !== null) {
        const elem = { ...(element as Record<string, unknown>) };
        for (const field of ELEMENT_IMAGE_FIELDS) {
          if (field in elem) {
            elem[field] = convertImageValue(elem[field]);
          }
        }
        return elem;
      }
      return element;
    });
  }

  return result;
}
