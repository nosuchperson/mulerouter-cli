import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "klingai/kling-v3-omni-i2v",
  action: "generation",
  provider: "klingai",
  modelName: "kling-v3-omni-i2v",
  description: "Kling V3 Omni Image-to-Video: Animate images with advanced controls",
  inputTypes: ["image", "text"],
  outputType: "video",
  apiPath: "/vendors/klingai/v1/kling-v3-omni/image-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "first_frame",
      type: "string",
      description: "First frame image (URL/Base64/local path)",
    },
    {
      name: "last_frame",
      type: "string",
      description: "Last frame image (requires first_frame)",
    },
    {
      name: "prompt",
      type: "string",
      description: "Text prompt for animation",
    },
    {
      name: "multi_prompt",
      type: "array",
      description: "Multi-shot prompt list (JSON array)",
    },
    {
      name: "negative_prompt",
      type: "string",
      description: "Text describing what to avoid",
    },
    {
      name: "model_name",
      type: "string",
      description: "Model version",
      default: "kling-v3-omni",
      enum: ["kling-v3-omni"],
    },
    {
      name: "sound",
      type: "string",
      description: "Enable sound generation",
      default: "off",
      enum: ["off", "on"],
    },
    {
      name: "mode",
      type: "string",
      description: "Generation mode",
      enum: ["std", "pro"],
    },
    {
      name: "duration",
      type: "integer",
      description: "Video duration in seconds (3-15)",
    },
    {
      name: "aspect_ratio",
      type: "string",
      description: "Aspect ratio (required if no first_frame)",
      enum: ["16:9", "9:16", "1:1"],
    },
    {
      name: "multi_shot",
      type: "string",
      description: "Enable multi-shot mode",
      default: "false",
      enum: ["false", "true"],
    },
    {
      name: "shot_type",
      type: "string",
      description: "Shot type when multi_shot is true",
      enum: ["customize", "intelligence"],
    },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
