import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.5-i2v-preview",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.5-i2v-preview",
  description: "Wan2.5 Image-to-Video Preview: Animate images into videos with audio support",
  inputTypes: ["text", "image"],
  outputType: "video",
  apiPath: "/vendors/alibaba/v1/wan2.5-i2v-preview/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the desired animation",
      required: true,
    },
    {
      name: "image",
      type: "string",
      description: "Input image URL or local file path",
      required: true,
    },
    { name: "negative_prompt", type: "string", description: "Text describing what to avoid" },
    {
      name: "resolution",
      type: "string",
      description: "Video resolution preset",
      enum: ["480P", "720P", "1080P"],
    },
    {
      name: "duration",
      type: "integer",
      description: "Video duration in seconds",
      default: 5,
      enum: [5, 10],
    },
    {
      name: "prompt_extend",
      type: "boolean",
      description: "Whether to extend the prompt",
      default: true,
    },
    { name: "audio", type: "boolean", description: "Enable audio generation", default: false },
    { name: "audio_url", type: "string", description: "URL of audio to use" },
    { name: "seed", type: "integer", description: "Random seed for reproducibility" },
    {
      name: "safety_filter",
      type: "boolean",
      description: "Enable safety filtering",
      default: true,
    },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
