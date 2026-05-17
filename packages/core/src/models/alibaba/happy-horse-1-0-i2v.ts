import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/happy-horse-1-0-i2v",
  action: "generation",
  provider: "alibaba",
  modelName: "happy-horse-1-0-i2v",
  description: "Happy Horse 1.0 Image-to-Video: Generate videos from images",
  inputTypes: ["image", "text"],
  outputType: "video",
  apiPath: "/vendors/alibaba/v1/happy-horse-1-0-i2v/generation",
  availableOn: ["mulerun"],
  resultKey: "videos",
  parameters: [
    {
      name: "image",
      type: "string",
      description: "First-frame image (URL or Base64)",
      required: true,
    },
    {
      name: "prompt",
      type: "string",
      description: "Optional text prompt to guide video content (max 2500 chars)",
    },
    {
      name: "resolution",
      type: "string",
      description: "Output video resolution",
      default: "1080P",
      enum: ["720P", "1080P"],
    },
    {
      name: "duration",
      type: "integer",
      description: "Video duration in seconds (3-15)",
      default: 5,
    },
    {
      name: "seed",
      type: "integer",
      description: "Random seed for reproducibility",
    },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
