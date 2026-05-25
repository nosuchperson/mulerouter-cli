import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.1-vace-plus",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.1-vace-plus",
  description:
    "Wan2.1 VACE Plus: Advanced video editing — image_reference, video_repainting, video_edit, video_extension, video_outpainting",
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
      description:
        "VACE function. image_reference: multi-image fusion to video (needs --images, 1-3). video_repainting: repaint video by control features (needs --video-url + --control-condition). video_edit: local edit by mask (needs --video-url + one of --mask-image-url/--mask-video-url). video_extension: extend a video (combine --first/last-frame-url, --first/last-clip-url, --video-url). video_outpainting: expand canvas (needs --video-url + --top/bottom/left/right-scale).",
      required: true,
      enum: [
        "image_reference",
        "video_repainting",
        "video_edit",
        "video_extension",
        "video_outpainting",
      ],
    },
    {
      name: "prompt",
      type: "string",
      description: "Text prompt (≤800 chars)",
      required: true,
    },
    {
      name: "images",
      type: "array",
      description:
        "Input reference image URLs (JSON array). image_reference: 1-3 images. video_repainting/video_edit: exactly 1 (optional). Example: --images '[\"https://...png\"]'",
    },
    {
      name: "obj_or_bg",
      type: "array",
      description:
        "image_reference only: per-image role tags, parallel to --images. Each entry 'obj' or 'bg'. 'bg' may appear at most once. Required when --images has length > 1.",
    },
    {
      name: "video_url",
      type: "string",
      description:
        "Input video URL. Required for video_repainting, video_edit, video_outpainting; optional for video_extension (if set, --control-condition becomes required).",
    },
    {
      name: "control_condition",
      type: "string",
      description:
        "Feature-extraction mode. video_repainting: posebodyface|posebody|depth|scribble (required). video_edit: posebodyface|depth. video_extension: posebodyface|depth (required when --video-url is provided).",
    },
    {
      name: "strength",
      type: "number",
      description: "video_repainting only: control strength, 0.0–1.0 (default 1.0).",
    },
    {
      name: "mask_image_url",
      type: "string",
      description:
        "video_edit only: mask image URL. Mutually exclusive with --mask-video-url; exactly one required.",
    },
    {
      name: "mask_video_url",
      type: "string",
      description:
        "video_edit only: mask video URL. Mutually exclusive with --mask-image-url; exactly one required.",
    },
    {
      name: "mask_frame_id",
      type: "integer",
      description: "video_edit only: 1-based frame index where the mask target appears.",
    },
    {
      name: "mask_type",
      type: "string",
      description: "video_edit only: mask type. Effective when --mask-image-url is set.",
      enum: ["tracking", "fixed"],
    },
    {
      name: "expand_ratio",
      type: "number",
      description: "video_edit only with --mask-type tracking: mask expansion ratio, 0.0–1.0.",
    },
    {
      name: "expand_mode",
      type: "string",
      description:
        "video_edit only with --mask-type tracking: mask region shape. Note: 'orginal' is the upstream spelling (verbatim).",
      enum: ["hull", "bbox", "orginal"],
    },
    {
      name: "first_frame_url",
      type: "string",
      description: "video_extension only: first frame image URL.",
    },
    {
      name: "last_frame_url",
      type: "string",
      description: "video_extension only: last frame image URL.",
    },
    {
      name: "first_clip_url",
      type: "string",
      description: "video_extension only: first video clip URL (mp4, ≤3s, ≤50MB).",
    },
    {
      name: "last_clip_url",
      type: "string",
      description: "video_extension only: last video clip URL (mp4, ≤3s, ≤50MB).",
    },
    {
      name: "top_scale",
      type: "number",
      description: "video_outpainting only: upward expansion scale, 1.0–2.0 (default 1.0 = no expansion).",
    },
    {
      name: "bottom_scale",
      type: "number",
      description: "video_outpainting only: downward expansion scale, 1.0–2.0 (default 1.0).",
    },
    {
      name: "left_scale",
      type: "number",
      description: "video_outpainting only: leftward expansion scale, 1.0–2.0 (default 1.0).",
    },
    {
      name: "right_scale",
      type: "number",
      description: "video_outpainting only: rightward expansion scale, 1.0–2.0 (default 1.0).",
    },
    {
      name: "size",
      type: "string",
      description: "Output resolution. Applies to image_reference and video_edit.",
      enum: ["1280x720", "720x1280", "960x960", "832x1088", "1088x832"],
    },
    {
      name: "duration",
      type: "integer",
      description: "Video duration in seconds. Currently fixed at 5.",
      default: 5,
    },
    {
      name: "prompt_extend",
      type: "boolean",
      description: "Whether to enable prompt smart-rewrite.",
    },
    {
      name: "seed",
      type: "integer",
      description: "Random seed for reproducibility (0–2147483647).",
    },
    {
      name: "safety_filter",
      type: "boolean",
      description: "Enable content safety filter. Default: enabled.",
    },
  ],
};

registerEndpoint(endpoint);

export { endpoint };
