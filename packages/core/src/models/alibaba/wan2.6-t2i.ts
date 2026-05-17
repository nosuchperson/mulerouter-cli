import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.6-t2i",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.6-t2i",
  description: "Wan2.6 Text-to-Image: Generate high-quality images from text prompts",
  inputTypes: ["text"],
  outputType: "image",
  apiPath: "/vendors/alibaba/v1/wan2.6-t2i/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "images",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the image to generate",
      required: true,
    },
    {
      name: "negative_prompt",
      type: "string",
      description: "Text describing what to avoid in the image",
    },
    { name: "size", type: "string", description: "Image resolution", default: "1280*1280" },
    { name: "n", type: "integer", description: "Number of images to generate (1-4)", default: 1 },
    {
      name: "prompt_extend",
      type: "boolean",
      description: "Whether to extend/enhance the prompt automatically",
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
