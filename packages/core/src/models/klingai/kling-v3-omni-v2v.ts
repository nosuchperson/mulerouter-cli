import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "klingai/kling-v3-omni-v2v",
  action: "generation",
  provider: "klingai",
  modelName: "kling-v3-omni-v2v",
  description:
    "Kling V3 Omni Video-to-Video: Generate new videos from reference videos with feature guidance",
  inputTypes: ["video", "text"],
  outputType: "video",
  apiPath: "/vendors/klingai/v1/kling-v3-omni/reference-video-to-video/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt (max 2500 chars, required). Use @Video1 to reference videos",
      required: true,
    },
    {
      name: "negative_prompt",
      type: "string",
      description: "Text describing what to avoid (max 2500 chars)",
    },
    {
      name: "video",
      type: "array",
      description:
        'Reference video (JSON array, 1 video). Each: {"video_url":"...","refer_type":"feature","keep_original_sound":"no"}',
      required: true,
    },
    {
      name: "first_frame",
      type: "string",
      description: "First-frame reference image (URL/Base64)",
    },
    {
      name: "last_frame",
      type: "string",
      description: "Last-frame reference image (requires first_frame)",
    },
    {
      name: "images",
      type: "array",
      description: "Reference images (JSON array of URL/Base64 strings)",
    },
    {
      name: "elements",
      type: "array",
      description: "Element list (JSON array). Total elements+images+frames must not exceed 4",
    },
    {
      name: "model_name",
      type: "string",
      description: "Model version",
      default: "kling-v3-omni",
      enum: ["kling-v3-omni"],
    },
    {
      name: "mode",
      type: "string",
      description: "Generation mode",
      default: "pro",
      enum: ["std", "pro"],
    },
    {
      name: "aspect_ratio",
      type: "string",
      description: "Video aspect ratio (auto-inferred from video if omitted)",
      enum: ["16:9", "9:16", "1:1"],
    },
    {
      name: "duration",
      type: "integer",
      description: "Video duration in seconds (3-15, auto-inferred from video if omitted)",
      default: 5,
    },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
