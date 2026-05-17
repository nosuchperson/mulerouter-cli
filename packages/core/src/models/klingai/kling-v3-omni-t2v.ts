import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "klingai/kling-v3-omni-t2v",
  action: "generation",
  provider: "klingai",
  modelName: "kling-v3-omni-t2v",
  description: "Kling V3 Omni Text-to-Video: Advanced text-to-video with multi-shot and sound",
  inputTypes: ["text"],
  outputType: "video",
  apiPath: "/vendors/klingai/v1/kling-v3-omni/text-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt (max 2500 chars)",
    },
    {
      name: "multi_prompt",
      type: "array",
      description: "Multi-shot prompt list (JSON array, max 6 shots)",
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
