import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "klingai/kling-v3-t2v",
  action: "generation",
  provider: "klingai",
  modelName: "kling-v3-t2v",
  description:
    "Kling V3 Text-to-Video: Generate videos from text with multi-shot and sound support",
  inputTypes: ["text"],
  outputType: "video",
  apiPath: "/vendors/klingai/v1/kling-v3/text-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt (max 2500 chars). Mutually exclusive with multi_prompt",
    },
    {
      name: "negative_prompt",
      type: "string",
      description: "Text describing what to avoid (max 2500 chars)",
    },
    {
      name: "mode",
      type: "string",
      description: "Generation mode",
      default: "std",
      enum: ["std", "pro"],
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
      default: "customize",
      enum: ["customize", "intelligence"],
    },
    {
      name: "multi_prompt",
      type: "array",
      description: 'Multi-shot prompt list (JSON array). Each item: {"prompt":"...","duration":N}',
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
      name: "sound",
      type: "string",
      description: "Enable sound generation",
      default: "off",
      enum: ["off", "on"],
    },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
