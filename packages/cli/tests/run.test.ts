import "@mulerouter/core";
import { describe, expect, it } from "vitest";
import { resolveEndpoint } from "../src/commands/params.js";

describe("run command internals", () => {
  describe("parameter coercion (via endpoint definitions)", () => {
    it("should resolve endpoints for run command", () => {
      const endpoint = resolveEndpoint("alibaba/wan2.6-t2v");
      expect(endpoint.modelId).toBe("alibaba/wan2.6-t2v");
      expect(endpoint.parameters.find((p) => p.name === "prompt")?.required).toBe(true);
    });

    it("should have integer params with enum for validation", () => {
      const endpoint = resolveEndpoint("alibaba/wan2.6-t2v");
      const duration = endpoint.parameters.find((p) => p.name === "duration");
      expect(duration?.type).toBe("integer");
      expect(duration?.enum).toEqual([5, 10, 15]);
    });

    it("should have string params with enum for validation", () => {
      const endpoint = resolveEndpoint("alibaba/wan2.6-t2v");
      const size = endpoint.parameters.find((p) => p.name === "size");
      expect(size?.type).toBe("string");
      expect(size?.enum).toContain("1280*720");
    });

    it("should have boolean params", () => {
      const endpoint = resolveEndpoint("alibaba/wan2.6-t2v");
      const audio = endpoint.parameters.find((p) => p.name === "audio");
      expect(audio?.type).toBe("boolean");
      expect(audio?.default).toBe(false);
    });
  });

  describe("MiniMax buildRequestBody", () => {
    it("should transform speech params into nested structure", () => {
      const endpoint = resolveEndpoint("minimax/speech-2.8-hd");
      expect(endpoint.buildRequestBody).toBeDefined();

      const result = endpoint.buildRequestBody?.({
        prompt: "Hello world",
        voice_id: "Charming_Lady",
        speed: 1.5,
        vol: 2.0,
        pitch: 3,
        emotion: "happy",
        language_boost: "English",
        output_format: "url",
        audio_format: "mp3",
        sample_rate: 44100,
        bitrate: 128000,
        english_normalization: true,
      });

      expect(result.prompt).toBe("Hello world");
      expect(result.voice_setting).toEqual({
        voice_id: "Charming_Lady",
        speed: 1.5,
        vol: 2.0,
        pitch: 3,
        emotion: "happy",
        language_boost: "English",
      });
      expect(result.audio_setting).toEqual({
        output_format: "url",
        format: "mp3",
        sample_rate: 44100,
        bitrate: 128000,
      });
      expect(result.english_normalization).toBe(true);
    });

    it("should omit empty nested objects", () => {
      const endpoint = resolveEndpoint("minimax/speech-2.8-turbo");
      const result = endpoint.buildRequestBody?.({ prompt: "test" });

      expect(result.prompt).toBe("test");
      expect(result.voice_setting).toBeUndefined();
      expect(result.audio_setting).toBeUndefined();
    });

    it("should transform music params into nested structure", () => {
      const endpoint = resolveEndpoint("minimax/music-2.5");
      const result = endpoint.buildRequestBody?.({
        prompt: "upbeat pop",
        lyrics_prompt: "[verse] Hello",
        lyrics_optimizer: true,
        audio_format: "flac",
        sample_rate: 48000,
        bitrate: 256000,
      });

      expect(result.prompt).toBe("upbeat pop");
      expect(result.lyrics_prompt).toBe("[verse] Hello");
      expect(result.lyrics_optimizer).toBe(true);
      expect(result.audio_setting).toEqual({
        format: "flac",
        sample_rate: 48000,
        bitrate: 256000,
      });
    });
  });

  describe("seedance endpoint resolution", () => {
    it("should resolve 3-part seedance identifiers", () => {
      const t2v = resolveEndpoint("bytedance/seedance-2.0/text-to-video");
      expect(t2v.provider).toBe("bytedance");
      expect(t2v.action).toBe("text-to-video");
      expect(t2v.apiPath).toBe("/vendors/bytedance/v1/seedance-2.0/text-to-video/generation");
      expect(t2v.resultKey).toBe("videos");
    });

    it("should throw for 2-part seedance identifier (ambiguous: 3 actions)", () => {
      expect(() => resolveEndpoint("bytedance/seedance-2.0")).toThrow("Multiple actions");
    });

    it("should distinguish std vs fast variants", () => {
      const std = resolveEndpoint("bytedance/seedance-2.0/text-to-video");
      const fast = resolveEndpoint("bytedance/seedance-2.0-fast/text-to-video");
      expect(std.modelName).toBe("seedance-2.0");
      expect(fast.modelName).toBe("seedance-2.0-fast");
      expect(std.parameters.find((p) => p.name === "camera_fixed")).toBeDefined();
      expect(fast.parameters.find((p) => p.name === "camera_fixed")).toBeUndefined();
    });
  });
});
