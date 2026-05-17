import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/happy-horse-1-0-t2v",
  action: "generation",
  provider: "alibaba",
  modelName: "happy-horse-1-0-t2v",
  description: "Happy Horse 1.0 Text-to-Video: Generate videos from text prompts",
  inputTypes: ["text"],
  outputType: "video",
  apiPath: "/vendors/alibaba/v1/happy-horse-1-0-t2v/generation",
  availableOn: ["mulerun"],
  resultKey: "videos",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text description for video content (max 2500 chars)",
      required: true,
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
