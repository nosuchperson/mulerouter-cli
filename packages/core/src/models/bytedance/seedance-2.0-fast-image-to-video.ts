import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";
import { seedanceI2vParameters } from "./_builders.js";

const endpoint: ModelEndpoint = {
  modelId: "bytedance/seedance-2.0-fast",
  action: "image-to-video",
  provider: "bytedance",
  modelName: "seedance-2.0-fast",
  description: "ByteDance Seedance 2.0-fast image-to-video: faster variant (max 720p)",
  inputTypes: ["text", "image"],
  outputType: "video",
  apiPath: "/vendors/bytedance/v1/seedance-2.0-fast/image-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  parameters: seedanceI2vParameters(true),
};

registerEndpoint(endpoint);

export { endpoint };
