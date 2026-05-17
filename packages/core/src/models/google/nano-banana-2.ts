import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const generation: ModelEndpoint = {
  modelId: "google/nano-banana-2",
  action: "generation",
  provider: "google",
  modelName: "nano-banana-2",
  description:
    "Nano Banana 2 Text-to-Image: High-quality image generation with web search grounding",
  inputTypes: ["text"],
  outputType: "image",
  apiPath: "/vendors/google/v1/nano-banana-2/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "images",
  tags: ["SOTA"],
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
      enum: [
        "1:1",
        "3:4",
        "4:3",
        "9:16",
        "16:9",
        "2:3",
        "3:2",
        "9:21",
        "21:9",
        "1:2",
        "2:1",
        "4:5",
        "5:4",
        "5:8",
      ],
    },
    {
      name: "resolution",
      type: "string",
      description: "Output resolution tier",
      enum: ["1K", "2K", "4K"],
    },
    {
      name: "web_search",
      type: "boolean",
      description: "Enable web search grounding for the prompt",
    },
  ],
};

const edit: ModelEndpoint = {
  modelId: "google/nano-banana-2",
  action: "edit",
  provider: "google",
  modelName: "nano-banana-2",
  description:
    "Nano Banana 2 Image Edit: Edit images using text prompts and up to 14 reference images",
  inputTypes: ["text", "image"],
  outputType: "image",
  apiPath: "/vendors/google/v1/nano-banana-2/edit",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "images",
  tags: ["SOTA"],
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
      description: "Array of input image URLs or local file paths (1-14)",
      required: true,
    },
    {
      name: "aspect_ratio",
      type: "string",
      description: "Output aspect ratio",
      default: "1:1",
      enum: [
        "1:1",
        "3:4",
        "4:3",
        "9:16",
        "16:9",
        "2:3",
        "3:2",
        "9:21",
        "21:9",
        "1:2",
        "2:1",
        "4:5",
        "5:4",
        "5:8",
      ],
    },
    {
      name: "resolution",
      type: "string",
      description: "Output resolution tier",
      enum: ["1K", "2K", "4K"],
    },
    { name: "web_search", type: "boolean", description: "Enable web search grounding" },
  ],
};

registerEndpoint(generation);
registerEndpoint(edit);

export { edit, generation };
