import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "midjourney/video",
  action: "generation",
  provider: "midjourney",
  modelName: "video",
  description:
    "Midjourney Video: Generate videos from text prompts with optional image reference in prompt",
  inputTypes: ["text"],
  outputType: "video",
  apiPath: "/vendors/midjourney/v1/tob/video-diffusion",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "prompt",
      type: "string",
      description:
        "Text prompt (max 8192 chars). Include image URL in prompt for I2V: 'description https://example.com/image.jpg'",
      required: true,
    },
    {
      name: "video_type",
      type: "integer",
      description: "Video quality: 0=480p, 1=720p",
      default: 0,
      enum: [0, 1],
    },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
