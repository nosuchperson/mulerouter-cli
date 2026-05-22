import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";
import { seedanceR2vParameters } from "./_builders.js";

const endpoint: ModelEndpoint = {
  modelId: "bytedance/seedance-2.0-fast",
  action: "reference-to-video",
  provider: "bytedance",
  modelName: "seedance-2.0-fast",
  description:
    "ByteDance Seedance 2.0-fast reference-to-video: faster multi-modal references variant (max 720p)",
  inputTypes: ["text", "image", "video", "audio"],
  outputType: "video",
  apiPath: "/vendors/bytedance/v1/seedance-2.0-fast/reference-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  parameters: seedanceR2vParameters(true),
};

registerEndpoint(endpoint);

export { endpoint };
