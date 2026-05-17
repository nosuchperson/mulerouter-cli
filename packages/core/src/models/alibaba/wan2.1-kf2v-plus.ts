import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.1-kf2v-plus",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.1-kf2v-plus",
  description:
    "Wan2.1 Keyframe-to-Video Plus: Generate videos by interpolating between keyframe images",
  inputTypes: ["text", "image"],
  outputType: "video",
  apiPath: "/vendors/alibaba/v1/wan2.1-kf2v-plus/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt for video generation",
      required: true,
    },
    {
      name: "image",
      type: "string",
      description: "First keyframe image URL or local file path",
      required: true,
    },
    {
      name: "last_frame",
      type: "string",
      description: "Last keyframe image URL or local file path",
      required: true,
    },
    { name: "negative_prompt", type: "string", description: "Text describing what to avoid" },
    { name: "template", type: "string", description: "Video template to use" },
    { name: "resolution", type: "string", description: "Video resolution", default: "720P" },
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
