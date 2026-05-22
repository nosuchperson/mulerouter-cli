import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";
import { seedanceR2vParameters } from "./_builders.js";

const endpoint: ModelEndpoint = {
  modelId: "bytedance/seedance-2.0",
  action: "reference-to-video",
  provider: "bytedance",
  modelName: "seedance-2.0",
  description:
    "ByteDance Seedance 2.0 reference-to-video: multi-modal references (images/videos/audios), up to 1080p",
  inputTypes: ["text", "image", "video", "audio"],
  outputType: "video",
  apiPath: "/vendors/bytedance/v1/seedance-2.0/reference-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: seedanceR2vParameters(false),
};

registerEndpoint(endpoint);

export { endpoint };
