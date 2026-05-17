import { describe, expect, it } from "vitest";
import { toCliFlag } from "../src/utils.js";

describe("utils", () => {
  describe("toCliFlag", () => {
    it("should convert snake_case to hyphen-case", () => {
      expect(toCliFlag("prompt_extend")).toBe("prompt-extend");
      expect(toCliFlag("negative_prompt")).toBe("negative-prompt");
      expect(toCliFlag("safety_filter")).toBe("safety-filter");
    });

    it("should leave simple names unchanged", () => {
      expect(toCliFlag("prompt")).toBe("prompt");
      expect(toCliFlag("seed")).toBe("seed");
    });

    it("should handle multiple underscores", () => {
      expect(toCliFlag("ref_images_url")).toBe("ref-images-url");
      expect(toCliFlag("mask_image_url")).toBe("mask-image-url");
    });
  });
});
