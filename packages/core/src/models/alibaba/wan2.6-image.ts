import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.6-image",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.6-image",
  description:
    "Wan2.6 Image Processing: Edit and transform images using text prompts and reference images",
  inputTypes: ["text", "image"],
  outputType: "image",
  apiPath: "/vendors/alibaba/v1/wan2.6-image/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "images",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the desired image transformation",
      required: true,
    },
    {
      name: "images",
      type: "array",
      description: "Array of input image URLs or local file paths",
      required: true,
    },
    { name: "negative_prompt", type: "string", description: "Text describing what to avoid" },
    { name: "size", type: "string", description: "Output image resolution" },
    { name: "n", type: "integer", description: "Number of images to generate", default: 1 },
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
