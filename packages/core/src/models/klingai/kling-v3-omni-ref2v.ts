import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "klingai/kling-v3-omni-ref2v",
  action: "generation",
  provider: "klingai",
  modelName: "kling-v3-omni-ref2v",
  description:
    "Kling V3 Omni Reference-to-Video: Generate videos from reference images/elements with style guidance",
  inputTypes: ["image", "text"],
  outputType: "video",
  apiPath: "/vendors/klingai/v1/kling-v3-omni/reference-image-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt (max 2500 chars). Use <<<element_N>>> to reference elements",
    },
    {
      name: "multi_prompt",
      type: "array",
      description: "Multi-shot prompt list (JSON array, max 6 shots)",
    },
    {
      name: "negative_prompt",
      type: "string",
      description: "Text describing what to avoid (max 2500 chars)",
    },
    {
      name: "first_frame",
      type: "string",
      description: "First-frame reference image (URL/Base64)",
    },
    {
      name: "last_frame",
      type: "string",
      description: "Last-frame reference image (requires first_frame)",
    },
    {
      name: "images",
      type: "array",
      description: "Reference images (JSON array of URL/Base64 strings)",
    },
    {
      name: "elements",
      type: "array",
      description: "Element list (JSON array). Total elements+images+frames must not exceed 7",
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
      default: "pro",
      enum: ["std", "pro"],
    },
    {
      name: "aspect_ratio",
      type: "string",
      description: "Video aspect ratio",
      default: "16:9",
      enum: ["16:9", "9:16", "1:1"],
    },
    {
      name: "duration",
      type: "integer",
      description: "Video duration in seconds (3-15)",
      default: 5,
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
