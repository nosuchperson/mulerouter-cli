import { describe, expect, it } from "vitest";
import { lookup } from "../src/mime.js";

describe("mime", () => {
  it("should return correct MIME type for common image extensions", () => {
    expect(lookup("photo.png")).toBe("image/png");
    expect(lookup("photo.jpg")).toBe("image/jpeg");
    expect(lookup("photo.jpeg")).toBe("image/jpeg");
    expect(lookup("photo.gif")).toBe("image/gif");
    expect(lookup("photo.bmp")).toBe("image/bmp");
    expect(lookup("photo.webp")).toBe("image/webp");
    expect(lookup("photo.tiff")).toBe("image/tiff");
    expect(lookup("photo.tif")).toBe("image/tiff");
    expect(lookup("photo.svg")).toBe("image/svg+xml");
    expect(lookup("photo.ico")).toBe("image/x-icon");
    expect(lookup("photo.heic")).toBe("image/heic");
    expect(lookup("photo.heif")).toBe("image/heif");
    expect(lookup("photo.avif")).toBe("image/avif");
  });

  it("should be case-insensitive for extensions", () => {
    expect(lookup("photo.PNG")).toBe("image/png");
    expect(lookup("photo.JPG")).toBe("image/jpeg");
    expect(lookup("photo.WebP")).toBe("image/webp");
  });

  it("should return undefined for unknown extensions", () => {
    expect(lookup("file.txt")).toBeUndefined();
    expect(lookup("file.mp4")).toBeUndefined();
    expect(lookup("file.pdf")).toBeUndefined();
  });

  it("should return undefined for files without extension", () => {
    expect(lookup("noext")).toBeUndefined();
  });

  it("should handle paths with directories", () => {
    expect(lookup("/tmp/images/photo.png")).toBe("image/png");
    expect(lookup("./relative/path/photo.jpg")).toBe("image/jpeg");
  });
});
