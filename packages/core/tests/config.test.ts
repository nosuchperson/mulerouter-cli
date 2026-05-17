import { unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getConfigHelp,
  getSiteFromEnv,
  loadConfig,
  loadEnvFile,
  resetEnvFileCache,
} from "../src/config.js";

describe("config", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    resetEnvFileCache();
    for (const key of Object.keys(process.env)) {
      if (key.startsWith("MULEROUTER_")) {
        delete process.env[key];
      }
    }
  });

  afterEach(() => {
    // Restore original env
    for (const key of Object.keys(process.env)) {
      if (key.startsWith("MULEROUTER_")) {
        delete process.env[key];
      }
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      if (key.startsWith("MULEROUTER_") && value !== undefined) {
        process.env[key] = value;
      }
    }
  });

  describe("loadConfig", () => {
    it("should load config from explicit parameters", () => {
      const config = loadConfig({
        apiKey: "test-key",
        site: "mulerouter",
      });
      expect(config.apiKey).toBe("test-key");
      expect(config.site).toBe("mulerouter");
      expect(config.baseUrl).toBe("https://api.mulerouter.ai");
      expect(config.timeout).toBe(120_000);
      expect(config.maxRetries).toBe(3);
    });

    it("should load config with mulerun site", () => {
      const config = loadConfig({
        apiKey: "test-key",
        site: "mulerun",
      });
      expect(config.site).toBe("mulerun");
      expect(config.baseUrl).toBe("https://api.mulerun.com");
    });

    it("should prioritize baseUrl over site", () => {
      const config = loadConfig({
        apiKey: "test-key",
        baseUrl: "https://custom.api.com",
        site: "mulerouter",
      });
      expect(config.baseUrl).toBe("https://custom.api.com");
      expect(config.site).toBeUndefined();
    });

    it("should load config from environment variables", () => {
      process.env.MULEROUTER_API_KEY = "env-key";
      process.env.MULEROUTER_SITE = "mulerun";

      const config = loadConfig();
      expect(config.apiKey).toBe("env-key");
      expect(config.site).toBe("mulerun");
      expect(config.baseUrl).toBe("https://api.mulerun.com");
    });

    it("should prioritize MULEROUTER_BASE_URL over MULEROUTER_SITE", () => {
      process.env.MULEROUTER_API_KEY = "env-key";
      process.env.MULEROUTER_BASE_URL = "https://custom.example.com";
      process.env.MULEROUTER_SITE = "mulerun";

      const config = loadConfig();
      expect(config.baseUrl).toBe("https://custom.example.com");
    });

    it("should prioritize explicit params over env vars", () => {
      process.env.MULEROUTER_API_KEY = "env-key";
      process.env.MULEROUTER_SITE = "mulerun";

      const config = loadConfig({ apiKey: "explicit-key", site: "mulerouter" });
      expect(config.apiKey).toBe("explicit-key");
      expect(config.site).toBe("mulerouter");
    });

    it("should throw when API key is missing", () => {
      process.env.MULEROUTER_SITE = "mulerouter";
      expect(() => loadConfig()).toThrow("API key not found");
    });

    it("should throw when neither baseUrl nor site is provided", () => {
      process.env.MULEROUTER_API_KEY = "key";
      expect(() => loadConfig()).toThrow("Configuration not specified");
    });

    it("should throw for invalid site", () => {
      process.env.MULEROUTER_API_KEY = "key";
      expect(() => loadConfig({ site: "invalid" })).toThrow("Invalid site");
    });
  });

  describe("loadEnvFile", () => {
    const tmpFile = join(tmpdir(), `.env.test.${Date.now()}`);

    afterEach(() => {
      try {
        unlinkSync(tmpFile);
      } catch {}
    });

    it("should load MULEROUTER_ variables from .env file", () => {
      writeFileSync(
        tmpFile,
        "MULEROUTER_API_KEY=file-key\nMULEROUTER_SITE=mulerouter\nOTHER_VAR=ignored\n",
      );
      loadEnvFile(tmpFile);
      expect(process.env.MULEROUTER_API_KEY).toBe("file-key");
      expect(process.env.MULEROUTER_SITE).toBe("mulerouter");
      expect(process.env.OTHER_VAR).toBeUndefined();
    });

    it("should strip surrounding quotes from values", () => {
      writeFileSync(tmpFile, 'MULEROUTER_API_KEY="quoted-key"\n');
      loadEnvFile(tmpFile);
      expect(process.env.MULEROUTER_API_KEY).toBe("quoted-key");
    });

    it("should not overwrite existing env vars", () => {
      process.env.MULEROUTER_API_KEY = "existing-key";
      writeFileSync(tmpFile, "MULEROUTER_API_KEY=new-key\n");
      loadEnvFile(tmpFile);
      expect(process.env.MULEROUTER_API_KEY).toBe("existing-key");
    });

    it("should skip non-existent files silently", () => {
      loadEnvFile("/tmp/nonexistent-env-file-123456");
      // No error thrown
    });

    it("should handle empty lines and comments", () => {
      writeFileSync(tmpFile, "# comment\n\nMULEROUTER_API_KEY=key\n# another\n");
      loadEnvFile(tmpFile);
      expect(process.env.MULEROUTER_API_KEY).toBe("key");
    });
  });

  describe("getSiteFromEnv", () => {
    it("should return undefined when MULEROUTER_SITE is not set", () => {
      expect(getSiteFromEnv()).toBeUndefined();
    });

    it("should return site for valid value", () => {
      process.env.MULEROUTER_SITE = "mulerouter";
      expect(getSiteFromEnv()).toBe("mulerouter");
    });

    it("should be case-insensitive", () => {
      process.env.MULEROUTER_SITE = "MuleRouter";
      expect(getSiteFromEnv()).toBe("mulerouter");
    });

    it("should return undefined for invalid value", () => {
      process.env.MULEROUTER_SITE = "invalid";
      expect(getSiteFromEnv()).toBeUndefined();
    });
  });

  describe("getConfigHelp", () => {
    it("should return non-empty help text", () => {
      const help = getConfigHelp();
      expect(help).toContain("MULEROUTER_API_KEY");
      expect(help).toContain("MULEROUTER_BASE_URL");
      expect(help).toContain("MULEROUTER_SITE");
    });
  });
});
