import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.2-i2v-plus",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.2-i2v-plus",
  description: "Wan2.2 Image-to-Video Plus: Animate images into 5-second videos",
  inputTypes: ["text", "image"],
  outputType: "video",
  apiPath: "/vendors/alibaba/v1/wan2.2-i2v-plus/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt for animation guidance",
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
      description: "Video resolution",
      enum: ["480P", "1080P"],
    },
    { name: "duration", type: "integer", description: "Video duration in seconds", default: 5 },
    {
      name: "prompt_extend",
      type: "boolean",
      description: "Whether to extend the prompt",
      default: true,
    },
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
