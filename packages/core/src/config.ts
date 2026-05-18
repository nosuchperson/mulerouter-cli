import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Config, Site } from "./types.js";
import { VERSION } from "./version.js";

const ENV_PREFIX = "MULEROUTER_";
const loadedEnvFiles = new Set<string>();

/** Reset loaded env files tracking (for testing). */
export function resetEnvFileCache(): void {
  loadedEnvFiles.clear();
}

const SITE_URLS: Record<Site, string> = {
  mulerouter: "https://api.mulerouter.ai",
  mulerun: "https://api.mulerun.com",
};

const VALID_SITES: Site[] = ["mulerouter", "mulerun"];

/**
 * Load MULEROUTER_* variables from a .env file into process.env.
 * Only variables prefixed with MULEROUTER_ are loaded.
 * Existing environment variables are not overwritten.
 */
export function loadEnvFile(envFile?: string): void {
  const filePath = envFile ?? resolve(process.cwd(), ".env");
  if (loadedEnvFiles.has(filePath)) return;
  loadedEnvFiles.add(filePath);
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    if (!key.startsWith(ENV_PREFIX)) continue;

    let value = trimmed.slice(eqIndex + 1).trim();
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Don't overwrite existing env vars
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

/** Get site from environment variable. */
export function getSiteFromEnv(): Site | undefined {
  const siteStr = process.env.MULEROUTER_SITE?.toLowerCase();
  if (!siteStr) return undefined;
  return VALID_SITES.includes(siteStr as Site) ? (siteStr as Site) : undefined;
}

/** Validate a site string. */
function parseSite(site: string): Site {
  const lower = site.toLowerCase() as Site;
  if (!VALID_SITES.includes(lower)) {
    throw new Error(`Invalid site: ${site}. Must be 'mulerouter' or 'mulerun'.`);
  }
  return lower;
}

/**
 * Load configuration from environment or explicit parameters.
 *
 * Priority: explicit parameters > environment variables > .env file
 * For base_url vs site: MULEROUTER_BASE_URL > MULEROUTER_SITE
 */
export function loadConfig(options?: {
  apiKey?: string;
  site?: string;
  baseUrl?: string;
  envFile?: string;
}): Config {
  loadEnvFile(options?.envFile);

  // Resolve base URL (highest priority)
  const resolvedBaseUrl = options?.baseUrl || process.env.MULEROUTER_BASE_URL;

  // Resolve site (only used if base URL is not set)
  let resolvedSite: Site | undefined;
  let baseUrl: string;

  if (resolvedBaseUrl) {
    baseUrl = resolvedBaseUrl;
  } else {
    const siteStr = options?.site || process.env.MULEROUTER_SITE;
    resolvedSite = siteStr ? parseSite(siteStr) : "mulerouter";
    baseUrl = SITE_URLS[resolvedSite];
  }

  // Resolve API key
  const apiKey = options?.apiKey || process.env.MULEROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "API key not found. Please set MULEROUTER_API_KEY environment variable, " +
        "or provide it via --api-key argument.",
    );
  }

  return {
    apiKey,
    site: resolvedSite,
    baseUrl,
    timeout: 120_000,
    maxRetries: 3,
    version: VERSION,
  };
}

/** Get formatted configuration help text. */
export function getConfigHelp(): string {
  return `Configuration Options:
---------------------
Environment Variables:
  MULEROUTER_API_KEY    API key for authentication (required)

  Optional (MULEROUTER_BASE_URL takes priority over MULEROUTER_SITE):
  MULEROUTER_BASE_URL   Custom API base URL (e.g., https://api.mulerouter.ai)
  MULEROUTER_SITE       API site: 'mulerouter' or 'mulerun' (default: mulerouter)

.env File:
  Create a .env file in the current directory with the above variables.

  Example .env (using site):
    MULEROUTER_SITE=mulerun
    MULEROUTER_API_KEY=your-api-key-here

  Example .env (using custom base URL):
    MULEROUTER_BASE_URL=https://api.custom.example.com
    MULEROUTER_API_KEY=your-api-key-here

Command Line:
  --api-key KEY         Override API key
  --base-url URL        Override base URL (takes priority over --site)
  --site SITE           Override site (mulerouter/mulerun)`;
}
