import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "midjourney/diffusion",
  action: "generation",
  provider: "midjourney",
  modelName: "diffusion",
  description: "Midjourney Diffusion: Generate high-quality images from text prompts",
  inputTypes: ["text"],
  outputType: "image",
  apiPath: "/vendors/midjourney/v1/tob/diffusion",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "images",
  tags: ["SOTA"],
  parameters: [
    { name: "prompt", type: "string", description: "Text prompt (max 8192 chars)", required: true },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
