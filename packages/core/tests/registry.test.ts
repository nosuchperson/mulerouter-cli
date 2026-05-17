import { beforeEach, describe, expect, it } from "vitest";
import { ModelRegistry, registerEndpoint, registry } from "../src/registry.js";
import type { ModelEndpoint } from "../src/types.js";

function createEndpoint(overrides?: Partial<ModelEndpoint>): ModelEndpoint {
  return {
    modelId: "test/model",
    action: "generation",
    provider: "test",
    modelName: "model",
    description: "Test model",
    inputTypes: ["text"],
    outputType: "image",
    apiPath: "/test/path",
    parameters: [],
    availableOn: ["mulerouter", "mulerun"],
    resultKey: "images",
    ...overrides,
  };
}

describe("registry", () => {
  describe("ModelRegistry", () => {
    let testRegistry: ModelRegistry;

    beforeEach(() => {
      ModelRegistry.resetForTesting();
      testRegistry = ModelRegistry.getInstance();
    });

    it("should be a singleton", () => {
      const instance1 = ModelRegistry.getInstance();
      const instance2 = ModelRegistry.getInstance();
      expect(instance1).toBe(instance2);
    });

    it("should register and retrieve endpoints", () => {
      const endpoint = createEndpoint();
      testRegistry.register(endpoint);

      const result = testRegistry.get("test/model", "generation");
      expect(result).toBe(endpoint);
    });

    it("should return undefined for unknown endpoints", () => {
      expect(testRegistry.get("unknown/model", "generation")).toBeUndefined();
    });

    it("should list all endpoints", () => {
      testRegistry.register(createEndpoint({ modelId: "a/model" }));
      testRegistry.register(createEndpoint({ modelId: "b/model" }));

      const all = testRegistry.listAll();
      expect(all).toHaveLength(2);
    });

    it("should find by model ID", () => {
      testRegistry.register(createEndpoint({ modelId: "test/model", action: "generation" }));
      testRegistry.register(createEndpoint({ modelId: "test/model", action: "edit" }));
      testRegistry.register(createEndpoint({ modelId: "other/model", action: "generation" }));

      const results = testRegistry.findByModelId("test/model");
      expect(results).toHaveLength(2);
    });

    it("should filter by site", () => {
      testRegistry.register(
        createEndpoint({ modelId: "a/model", availableOn: ["mulerouter", "mulerun"] }),
      );
      testRegistry.register(createEndpoint({ modelId: "b/model", availableOn: ["mulerun"] }));

      const mulerouter = testRegistry.listForSite("mulerouter");
      expect(mulerouter).toHaveLength(1);
      expect(mulerouter[0].modelId).toBe("a/model");

      const mulerun = testRegistry.listForSite("mulerun");
      expect(mulerun).toHaveLength(2);
    });

    it("should filter by provider", () => {
      testRegistry.register(createEndpoint({ modelId: "a/m1", provider: "alibaba" }));
      testRegistry.register(createEndpoint({ modelId: "b/m2", provider: "google" }));
      testRegistry.register(createEndpoint({ modelId: "c/m3", provider: "alibaba" }));

      const results = testRegistry.listByProvider("alibaba");
      expect(results).toHaveLength(2);
    });

    it("should filter by output type", () => {
      testRegistry.register(createEndpoint({ modelId: "a/m1", outputType: "image" }));
      testRegistry.register(createEndpoint({ modelId: "b/m2", outputType: "video" }));
      testRegistry.register(createEndpoint({ modelId: "c/m3", outputType: "image" }));

      const images = testRegistry.listByOutputType("image");
      expect(images).toHaveLength(2);

      const videos = testRegistry.listByOutputType("video");
      expect(videos).toHaveLength(1);
    });

    it("should filter by tag (case-insensitive)", () => {
      testRegistry.register(createEndpoint({ modelId: "a/m1", tags: ["SOTA", "fast"] }));
      testRegistry.register(createEndpoint({ modelId: "b/m2", tags: [] }));
      testRegistry.register(createEndpoint({ modelId: "c/m3", tags: ["sota"] }));

      const results = testRegistry.listByTag("SOTA");
      expect(results).toHaveLength(2);

      const fast = testRegistry.listByTag("fast");
      expect(fast).toHaveLength(1);
    });

    it("should get unique providers", () => {
      testRegistry.register(createEndpoint({ modelId: "a/m1", provider: "google" }));
      testRegistry.register(createEndpoint({ modelId: "b/m2", provider: "alibaba" }));
      testRegistry.register(createEndpoint({ modelId: "c/m3", provider: "google" }));

      const providers = testRegistry.getProviders();
      expect(providers).toEqual(["alibaba", "google"]);
    });

    it("should get unique model IDs", () => {
      testRegistry.register(createEndpoint({ modelId: "a/m1", action: "generation" }));
      testRegistry.register(createEndpoint({ modelId: "a/m1", action: "edit" }));
      testRegistry.register(createEndpoint({ modelId: "b/m2", action: "generation" }));

      const models = testRegistry.getModelIds();
      expect(models).toEqual(["a/m1", "b/m2"]);
    });
  });

  describe("registerEndpoint", () => {
    it("should register with global registry and return endpoint", () => {
      const endpoint = createEndpoint({ modelId: "register-test/model" });
      const result = registerEndpoint(endpoint);
      expect(result).toBe(endpoint);

      // registerEndpoint uses the module-level `registry` reference, so query it directly
      const retrieved = registry.get("register-test/model", "generation");
      expect(retrieved).toBe(endpoint);
    });
  });
});
