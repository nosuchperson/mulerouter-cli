import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "klingai/kling-v3-i2v",
  action: "generation",
  provider: "klingai",
  modelName: "kling-v3-i2v",
  description:
    "Kling V3 Image-to-Video: Animate images with keyframes, elements, and sound support",
  inputTypes: ["image", "text"],
  outputType: "video",
  apiPath: "/vendors/klingai/v1/kling-v3/image-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "first_frame",
      type: "string",
      description:
        "First-frame image (URL/Base64/local path). At least one of first_frame or last_frame required",
    },
    {
      name: "last_frame",
      type: "string",
      description: "End frame image (URL/Base64/local path)",
    },
    {
      name: "elements",
      type: "array",
      description: "Element list (JSON array, max 3). Use <<<element_N>>> in prompt to reference",
    },
    {
      name: "prompt",
      type: "string",
      description:
        "Motion/story description (max 2500 chars). Use <<<element_N>>> for element references",
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
