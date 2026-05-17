import { describe, expect, it } from "vitest";
import { ModelRegistry } from "../src/registry.js";

// Import all models to register them
import "../src/models/index.js";

describe("models", () => {
  const registry = ModelRegistry.getInstance();

  it("should register all expected endpoints", () => {
    const all = registry.listAll();
    // Sum of per-provider counts below: 15 + 7 + 7 + 2 + 4 + 2 = 37
    expect(all.length).toBeGreaterThanOrEqual(37);
  });

  it("should register all expected providers", () => {
    const providers = registry.getProviders();
    expect(providers).toContain("alibaba");
    expect(providers).toContain("google");
    expect(providers).toContain("klingai");
    expect(providers).toContain("midjourney");
    expect(providers).toContain("minimax");
    expect(providers).toContain("openai");
    expect(providers.length).toBeGreaterThanOrEqual(6);
  });

  describe("alibaba", () => {
    it("should have 15 endpoints", () => {
      const endpoints = registry.listByProvider("alibaba");
      expect(endpoints).toHaveLength(15);
    });

    it("should include wan2.6-t2v with correct config", () => {
      const endpoint = registry.get("alibaba/wan2.6-t2v", "generation");
      expect(endpoint).toBeDefined();
      expect(endpoint?.outputType).toBe("video");
      expect(endpoint?.resultKey).toBe("videos");
      expect(endpoint?.apiPath).toBe("/vendors/alibaba/v1/wan2.6-t2v/generation");
      expect(endpoint?.parameters.find((p) => p.name === "prompt")?.required).toBe(true);
    });

    it("should include wan2.6-t2i", () => {
      const endpoint = registry.get("alibaba/wan2.6-t2i", "generation");
      expect(endpoint).toBeDefined();
      expect(endpoint?.outputType).toBe("image");
      expect(endpoint?.resultKey).toBe("images");
    });

    it("should include wan2.1-vace-plus with VACE functions", () => {
      const endpoint = registry.get("alibaba/wan2.1-vace-plus", "generation");
      expect(endpoint).toBeDefined();
      const funcParam = endpoint?.parameters.find((p) => p.name === "function");
      expect(funcParam?.required).toBe(true);
      expect(funcParam?.enum).toContain("outpainting");
      expect(funcParam?.enum).toContain("inpainting");
    });
  });

  describe("google", () => {
    it("should have 7 endpoints", () => {
      const endpoints = registry.listByProvider("google");
      expect(endpoints).toHaveLength(7);
    });

    it("should include nano-banana-2 generation and edit", () => {
      expect(registry.get("google/nano-banana-2", "generation")).toBeDefined();
      expect(registry.get("google/nano-banana-2", "edit")).toBeDefined();
    });

    it("should include veo3 on mulerun only", () => {
      const endpoint = registry.get("google/veo3", "generation");
      expect(endpoint).toBeDefined();
      expect(endpoint?.availableOn).toEqual(["mulerun"]);
      expect(endpoint?.outputType).toBe("video");
    });

    it("should tag SOTA models", () => {
      const endpoint = registry.get("google/nano-banana-2", "generation");
      expect(endpoint?.tags).toContain("SOTA");
    });
  });

  describe("klingai", () => {
    it("should have 7 endpoints", () => {
      const endpoints = registry.listByProvider("klingai");
      expect(endpoints).toHaveLength(7);
    });

    it("should include kling-v3-t2v and kling-v3-i2v", () => {
      expect(registry.get("klingai/kling-v3-t2v", "generation")).toBeDefined();
      expect(registry.get("klingai/kling-v3-i2v", "generation")).toBeDefined();
    });

    it("should include kling-v3-omni variants", () => {
      expect(registry.get("klingai/kling-v3-omni-t2v", "generation")).toBeDefined();
      expect(registry.get("klingai/kling-v3-omni-i2v", "generation")).toBeDefined();
      expect(registry.get("klingai/kling-v3-omni-ref2v", "generation")).toBeDefined();
      expect(registry.get("klingai/kling-v3-omni-v2v", "generation")).toBeDefined();
      expect(registry.get("klingai/kling-v3-omni-v2v-edit", "generation")).toBeDefined();
    });
  });

  describe("midjourney", () => {
    it("should have 2 endpoints", () => {
      const endpoints = registry.listByProvider("midjourney");
      expect(endpoints).toHaveLength(2);
    });

    it("should include diffusion and video", () => {
      expect(registry.get("midjourney/diffusion", "generation")).toBeDefined();
      expect(registry.get("midjourney/video", "generation")).toBeDefined();
    });
  });

  describe("minimax", () => {
    it("should have 4 endpoints", () => {
      const endpoints = registry.listByProvider("minimax");
      expect(endpoints).toHaveLength(4);
    });

    it("should have audio output type for all", () => {
      const endpoints = registry.listByProvider("minimax");
      expect(endpoints.every((e) => e.outputType === "audio")).toBe(true);
      expect(endpoints.every((e) => e.resultKey === "audios")).toBe(true);
    });

    it("should have custom buildRequestBody for speech models", () => {
      const speech = registry.get("minimax/speech-2.8-hd", "generation");
      expect(speech?.buildRequestBody).toBeDefined();

      // Test the custom builder
      const result = speech?.buildRequestBody?.({
        prompt: "Hello",
        voice_id: "Charming_Lady",
        speed: 1.0,
        audio_format: "mp3",
      });
      expect(result?.prompt).toBe("Hello");
      expect(result?.voice_setting).toEqual({ voice_id: "Charming_Lady", speed: 1.0 });
      expect(result?.audio_setting).toEqual({ format: "mp3" });
    });

    it("should have custom buildRequestBody for music models", () => {
      const music = registry.get("minimax/music-2.5", "generation");
      expect(music?.buildRequestBody).toBeDefined();

      const result = music?.buildRequestBody?.({
        prompt: "upbeat pop",
        lyrics_prompt: "[verse] Hello world",
        audio_format: "mp3",
        sample_rate: 44100,
      });
      expect(result?.prompt).toBe("upbeat pop");
      expect(result?.lyrics_prompt).toBe("[verse] Hello world");
      expect(result?.audio_setting).toEqual({ format: "mp3", sample_rate: 44100 });
    });
  });

  describe("openai", () => {
    it("should have 2 endpoints", () => {
      const endpoints = registry.listByProvider("openai");
      expect(endpoints).toHaveLength(2);
    });

    it("should include gpt-image-2 generation and edit", () => {
      const gen = registry.get("openai/gpt-image-2", "generation");
      expect(gen).toBeDefined();
      expect(gen?.outputType).toBe("image");
      expect(gen?.availableOn).toEqual(["mulerouter"]);
      expect(gen?.tags).toContain("SOTA");

      const edit = registry.get("openai/gpt-image-2", "edit");
      expect(edit).toBeDefined();
      expect(edit?.outputType).toBe("image");
    });
  });

  describe("filtering", () => {
    it("should filter by output type", () => {
      const images = registry.listByOutputType("image");
      const videos = registry.listByOutputType("video");
      const audios = registry.listByOutputType("audio");

      expect(images.length).toBeGreaterThan(0);
      expect(videos.length).toBeGreaterThan(0);
      expect(audios.length).toBe(4); // minimax only

      expect(images.length + videos.length + audios.length).toBeGreaterThanOrEqual(37);
    });

    it("should filter SOTA models", () => {
      const sota = registry.listByTag("SOTA");
      expect(sota.length).toBeGreaterThan(0);
      expect(sota.every((e) => e.tags?.includes("SOTA"))).toBe(true);
    });

    it("should filter by site", () => {
      const mulerunOnly = registry
        .listAll()
        .filter((e) => e.availableOn.includes("mulerun") && !e.availableOn.includes("mulerouter"));
      expect(mulerunOnly.length).toBeGreaterThan(0);
      // nano-banana gen+edit, veo3, minimax (4), happy-horse (2)
      expect(mulerunOnly.map((e) => e.modelId)).toContain("google/nano-banana");
      expect(mulerunOnly.map((e) => e.modelId)).toContain("minimax/speech-2.8-hd");
    });
  });

  describe("endpoint parameters", () => {
    it("should have valid parameter definitions", () => {
      const all = registry.listAll();
      for (const endpoint of all) {
        for (const param of endpoint.parameters) {
          expect(param.name).toBeTruthy();
          expect(["string", "integer", "number", "boolean", "array"]).toContain(param.type);
          expect(param.description).toBeTruthy();
        }
      }
    });

    it("should have unique parameter names per endpoint", () => {
      const all = registry.listAll();
      for (const endpoint of all) {
        const names = endpoint.parameters.map((p) => p.name);
        const unique = new Set(names);
        expect(unique.size).toBe(names.length);
      }
    });
  });
});
