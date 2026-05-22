import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";
import { seedanceT2vParameters } from "./_builders.js";

const endpoint: ModelEndpoint = {
  modelId: "bytedance/seedance-2.0-fast",
  action: "text-to-video",
  provider: "bytedance",
  modelName: "seedance-2.0-fast",
  description:
    "ByteDance Seedance 2.0-fast text-to-video: faster variant (max 720p, no camera_fixed/watermark)",
  inputTypes: ["text"],
  outputType: "video",
  apiPath: "/vendors/bytedance/v1/seedance-2.0-fast/text-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  parameters: seedanceT2vParameters(true),
};

registerEndpoint(endpoint);

export { endpoint };
