import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.5-i2i-preview",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.5-i2i-preview",
  description: "Wan2.5 Image-to-Image Preview: Transform images using text guidance",
  inputTypes: ["text", "image"],
  outputType: "image",
  apiPath: "/vendors/alibaba/v1/wan2.5-i2i-preview/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "images",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the desired transformation",
      required: true,
    },
    {
      name: "images",
      type: "array",
      description: "Array of input image URLs or local file paths (max 2)",
      required: true,
    },
    { name: "negative_prompt", type: "string", description: "Text describing what to avoid" },
    { name: "size", type: "string", description: "Output image resolution" },
    { name: "n", type: "integer", description: "Number of images to generate", default: 4 },
    {
      name: "prompt_extend",
      type: "boolean",
      description: "Whether to extend the prompt",
      default: true,
    },
    { name: "seed", type: "integer", description: "Random seed for reproducibility" },
    {
      name: "safety_filter",
      type: "boolean",
      description: "Enable safety filtering",
      default: true,
    },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
