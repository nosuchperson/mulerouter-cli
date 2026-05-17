import "@mulerouter/core";
import { describe, expect, it } from "vitest";
import { resolveEndpoint } from "../src/commands/params.js";

describe("commands/params", () => {
  describe("resolveEndpoint", () => {
    it("should resolve exact 3-part identifier", () => {
      const endpoint = resolveEndpoint("alibaba/wan2.6-t2v/generation");
      expect(endpoint.modelId).toBe("alibaba/wan2.6-t2v");
      expect(endpoint.action).toBe("generation");
    });

    it("should resolve 2-part identifier when action is unambiguous", () => {
      const endpoint = resolveEndpoint("midjourney/diffusion");
      expect(endpoint.modelId).toBe("midjourney/diffusion");
      expect(endpoint.action).toBe("generation");
    });

    it("should throw for ambiguous 2-part identifier", () => {
      expect(() => resolveEndpoint("google/nano-banana-2")).toThrow("Multiple actions");
    });

    it("should throw for unknown model", () => {
      expect(() => resolveEndpoint("unknown/model")).toThrow("not found");
    });

    it("should throw for unknown 3-part identifier", () => {
      expect(() => resolveEndpoint("alibaba/wan2.6-t2v/nonexistent")).toThrow("not found");
    });
  });
});

describe("commands/list", () => {
  it("should import executeList without errors", async () => {
    const { executeList } = await import("../src/commands/list.js");
    expect(typeof executeList).toBe("function");
  });
});

describe("commands/config", () => {
  it("should import executeConfig without errors", async () => {
    const { executeConfig } = await import("../src/commands/config.js");
    expect(typeof executeConfig).toBe("function");
  });
});
