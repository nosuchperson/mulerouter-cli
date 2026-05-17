import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.1-vace-plus",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.1-vace-plus",
  description:
    "Wan2.1 VACE Plus: Advanced video editing — outpainting, inpainting, interpolation, and more",
  inputTypes: ["text", "image", "video"],
  outputType: "video",
  apiPath: "/vendors/alibaba/v1/wan2.1-vace-plus/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  parameters: [
    {
      name: "model",
      type: "string",
      description: "Model name",
      required: true,
      enum: ["wan2.1-vace-plus"],
    },
    {
      name: "function",
      type: "string",
      description: "VACE function to use",
      required: true,
      enum: ["outpainting", "video_extend", "reference_generation", "interpolation", "inpainting"],
    },
    { name: "prompt", type: "string", description: "Text prompt", required: true },
    { name: "negative_prompt", type: "string", description: "Text describing what to avoid" },
    { name: "ref_images_url", type: "array", description: "Reference image URLs" },
    { name: "obj_or_bg", type: "string", description: "Object or background mode" },
    { name: "video_url", type: "string", description: "Input video URL" },
    { name: "control_condition", type: "string", description: "Control condition" },
    { name: "strength", type: "number", description: "Control strength" },
    { name: "mask_image_url", type: "string", description: "Mask image URL" },
    { name: "mask_video_url", type: "string", description: "Mask video URL" },
    { name: "mask_frame_id", type: "string", description: "Mask frame ID" },
    { name: "mask_type", type: "string", description: "Mask type" },
    { name: "expand_ratio", type: "number", description: "Expand ratio for outpainting" },
    { name: "expand_mode", type: "string", description: "Expand mode for outpainting" },
    { name: "first_frame_url", type: "string", description: "First frame image URL" },
    { name: "last_frame_url", type: "string", description: "Last frame image URL" },
    { name: "first_clip_url", type: "string", description: "First clip URL" },
    { name: "last_clip_url", type: "string", description: "Last clip URL" },
    { name: "top_scale", type: "number", description: "Top scale for outpainting" },
    { name: "bottom_scale", type: "number", description: "Bottom scale for outpainting" },
    { name: "left_scale", type: "number", description: "Left scale for outpainting" },
    { name: "right_scale", type: "number", description: "Right scale for outpainting" },
    { name: "size", type: "string", description: "Output resolution" },
    { name: "duration", type: "integer", description: "Video duration in seconds", default: 5 },
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
