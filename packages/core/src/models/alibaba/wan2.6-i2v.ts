import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.6-i2v",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.6-i2v",
  description:
    "Wan2.6 Image-to-Video: Animate images into videos with text guidance and resolution control",
  inputTypes: ["text", "image"],
  outputType: "video",
  apiPath: "/vendors/alibaba/v1/wan2.6-i2v/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the desired video animation",
    },
    {
      name: "image",
      type: "string",
      description: "Input image URL or local file path to animate",
      required: true,
    },
    {
      name: "negative_prompt",
      type: "string",
      description: "Text describing what to avoid in the video",
    },
    {
      name: "resolution",
      type: "string",
      description: "Video resolution preset",
      default: "720P",
      enum: ["480P", "720P", "1080P"],
    },
    {
      name: "duration",
      type: "integer",
      description: "Video duration in seconds",
      default: 5,
      enum: [5, 10, 15],
    },
    {
      name: "prompt_extend",
      type: "boolean",
      description: "Whether to extend/enhance the prompt automatically",
      default: true,
    },
    {
      name: "multi_shots",
      type: "boolean",
      description: "Enable multi-shot video generation",
      default: false,
    },
    {
      name: "audio",
      type: "boolean",
      description: "Enable audio generation for the video",
      default: false,
    },
    { name: "audio_url", type: "string", description: "URL of audio to use in the video" },
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
