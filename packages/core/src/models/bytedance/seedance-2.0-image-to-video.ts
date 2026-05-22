import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";
import { seedanceI2vParameters } from "./_builders.js";

const endpoint: ModelEndpoint = {
  modelId: "bytedance/seedance-2.0",
  action: "image-to-video",
  provider: "bytedance",
  modelName: "seedance-2.0",
  description:
    "ByteDance Seedance 2.0 image-to-video: animate an image (optional last-frame target), up to 1080p",
  inputTypes: ["text", "image"],
  outputType: "video",
  apiPath: "/vendors/bytedance/v1/seedance-2.0/image-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: seedanceI2vParameters(false),
};

registerEndpoint(endpoint);

export { endpoint };
