import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const generation: ModelEndpoint = {
  modelId: "google/nano-banana",
  action: "generation",
  provider: "google",
  modelName: "nano-banana",
  description: "Nano Banana Text-to-Image: Generate images from text prompts",
  inputTypes: ["text"],
  outputType: "image",
  apiPath: "/vendors/google/v1/nano-banana/generation",
  availableOn: ["mulerun"],
  resultKey: "images",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the image to generate",
      required: true,
    },
    {
      name: "aspect_ratio",
      type: "string",
      description: "Image aspect ratio",
      default: "1:1",
      enum: ["1:1", "3:4", "4:3", "9:16", "16:9", "2:3", "3:2", "9:21", "21:9"],
    },
  ],
};

const edit: ModelEndpoint = {
  modelId: "google/nano-banana",
  action: "edit",
  provider: "google",
  modelName: "nano-banana",
  description: "Nano Banana Image Edit: Edit images using text prompts and reference images",
  inputTypes: ["text", "image"],
  outputType: "image",
  apiPath: "/vendors/google/v1/nano-banana/edit",
  availableOn: ["mulerun"],
  resultKey: "images",
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the desired edit",
      required: true,
    },
    {
      name: "images",
      type: "array",
      description: "Array of input image URLs or local file paths (1-10)",
      required: true,
    },
    {
      name: "aspect_ratio",
      type: "string",
      description: "Output aspect ratio",
      default: "1:1",
      enum: ["1:1", "3:4", "4:3", "9:16", "16:9", "2:3", "3:2", "9:21", "21:9"],
    },
  ],
};

registerEndpoint(generation);
registerEndpoint(edit);

export { edit, generation };
