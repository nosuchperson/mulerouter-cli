import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";
import { seedanceT2vParameters } from "./_builders.js";

const endpoint: ModelEndpoint = {
  modelId: "bytedance/seedance-2.0",
  action: "text-to-video",
  provider: "bytedance",
  modelName: "seedance-2.0",
  description:
    "ByteDance Seedance 2.0 text-to-video: generate videos from text prompts (up to 1080p, 4-15s)",
  inputTypes: ["text"],
  outputType: "video",
  apiPath: "/vendors/bytedance/v1/seedance-2.0/text-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: seedanceT2vParameters(false),
};

registerEndpoint(endpoint);

export { endpoint };
