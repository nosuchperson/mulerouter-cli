import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "google/veo3",
  action: "generation",
  provider: "google",
  modelName: "veo3",
  description:
    "Google Veo 3: State-of-the-art text/image-to-video generation with multiple model variants",
  inputTypes: ["text", "image"],
  outputType: "video",
  apiPath: "/vendors/google/v1/veo/generation",
  availableOn: ["mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the video to generate",
      required: true,
    },
    { name: "negative_prompt", type: "string", description: "Text describing what to avoid" },
    { name: "image", type: "string", description: "First frame image URL or local file path" },
    { name: "last_frame", type: "string", description: "Last frame image URL or local file path" },
    {
      name: "reference_images",
      type: "array",
      description: "Reference images (max 3) for style guidance",
    },
    {
      name: "model",
      type: "string",
      description: "Veo model variant",
      default: "veo-3.1",
      enum: ["veo-3.1", "veo-3.1-fast", "veo-3"],
    },
    {
      name: "aspect_ratio",
      type: "string",
      description: "Video aspect ratio",
      enum: ["16:9", "9:16"],
    },
    {
      name: "resolution",
      type: "string",
      description: "Video resolution",
      enum: ["720p", "1080p"],
    },
    {
      name: "duration",
      type: "integer",
      description: "Video duration in seconds",
      default: 8,
      enum: [4, 6, 8],
    },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
