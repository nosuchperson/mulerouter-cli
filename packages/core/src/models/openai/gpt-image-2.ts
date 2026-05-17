import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const generation: ModelEndpoint = {
  modelId: "openai/gpt-image-2",
  action: "generation",
  provider: "openai",
  modelName: "gpt-image-2",
  description:
    "OpenAI GPT Image 2: Generate images from text with up to 4K resolution and batch support",
  inputTypes: ["text"],
  outputType: "image",
  apiPath: "/vendors/openai/v1/gpt-image-2/generation",
  availableOn: ["mulerouter"],
  resultKey: "images",
  tags: ["SOTA"],
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt to guide image generation",
      required: true,
    },
    {
      name: "quality",
      type: "string",
      description: "Image quality level",
      default: "high",
      enum: ["high", "medium", "low", "auto"],
    },
    {
      name: "size",
      type: "string",
      description: "Output image resolution",
      default: "auto",
      enum: [
        "1024x1024",
        "1536x1024",
        "1024x1536",
        "2048x2048",
        "2048x1152",
        "3840x2160",
        "2160x3840",
        "auto",
      ],
    },
    {
      name: "n",
      type: "integer",
      description: "Number of images to generate (1-4)",
      default: 1,
    },
    {
      name: "format",
      type: "string",
      description: "Output image format",
      default: "png",
      enum: ["png", "jpeg", "webp"],
    },
  ],
};

const edit: ModelEndpoint = {
  modelId: "openai/gpt-image-2",
  action: "edit",
  provider: "openai",
  modelName: "gpt-image-2",
  description:
    "OpenAI GPT Image 2: Edit images with text prompts, optional mask, and up to 4K output",
  inputTypes: ["image", "text"],
  outputType: "image",
  apiPath: "/vendors/openai/v1/gpt-image-2/edit",
  availableOn: ["mulerouter"],
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
      description: "Input images to edit (URLs or base64, min 1)",
      required: true,
    },
    {
      name: "size",
      type: "string",
      description: "Output image resolution",
      default: "auto",
      enum: [
        "1024x1024",
        "1536x1024",
        "1024x1536",
        "2048x2048",
        "2048x1152",
        "3840x2160",
        "2160x3840",
        "auto",
      ],
    },
    {
      name: "n",
      type: "integer",
      description: "Number of edited images to generate (1-4)",
      default: 1,
    },
    {
      name: "mask",
      type: "string",
      description: "Optional mask image specifying the region to edit",
    },
    {
      name: "format",
      type: "string",
      description: "Output image format",
      default: "png",
      enum: ["png", "jpeg", "webp"],
    },
  ],
};

registerEndpoint(generation);
registerEndpoint(edit);

export { edit, generation };
