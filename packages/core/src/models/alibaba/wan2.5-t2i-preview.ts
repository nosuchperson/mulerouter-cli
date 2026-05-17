import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.5-t2i-preview",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.5-t2i-preview",
  description: "Wan2.5 Text-to-Image Preview: Generate images from text prompts",
  inputTypes: ["text"],
  outputType: "image",
  apiPath: "/vendors/alibaba/v1/wan2.5-t2i-preview/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "images",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the image to generate",
      required: true,
    },
    { name: "negative_prompt", type: "string", description: "Text describing what to avoid" },
    { name: "size", type: "string", description: "Image resolution" },
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
