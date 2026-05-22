import type { ModelParameter } from "../../types.js";

/**
 * Shared parameter definitions for ByteDance Seedance 2.0 series.
 * Source: extracted from mule-router payloads/seedance.py + docs/api/bytedance/.
 *
 * Two model variants (seedance-2.0 vs seedance-2.0-fast) differ only in:
 *  - `resolution` enum: std accepts 1080p, fast does not.
 *  - T2V fast does NOT accept `camera_fixed` / `watermark` non-false values
 *    (so the fast T2V parameter list omits those two flags entirely).
 *
 * `model` is auto-injected by mule-router from URL segments and MUST NOT be
 * exposed as a CLI parameter.
 */

const RESOLUTIONS_STD = ["480p", "720p", "1080p"] as const;
const RESOLUTIONS_FAST = ["480p", "720p"] as const;
const ASPECT_RATIOS = ["16:9", "4:3", "1:1", "3:4", "9:16", "21:9", "adaptive"] as const;

/** Parameters common to all 6 seedance endpoints. */
const commonParameters: ModelParameter[] = [
  {
    name: "aspect_ratio",
    type: "string",
    description: "Output video aspect ratio",
    default: "adaptive",
    enum: [...ASPECT_RATIOS],
  },
  {
    name: "duration",
    type: "integer",
    description: "Video duration in seconds. Discrete: -1 (model decides) or 4..15",
    default: 5,
  },
  {
    name: "generate_audio",
    type: "boolean",
    description: "Generate audio track alongside video",
    default: true,
  },
  {
    name: "seed",
    type: "integer",
    description: "Random seed for reproducibility (-1 to 4294967295)",
  },
];

function resolutionParam(forFast: boolean): ModelParameter {
  return {
    name: "resolution",
    type: "string",
    description: "Output video resolution",
    default: "720p",
    enum: forFast ? [...RESOLUTIONS_FAST] : [...RESOLUTIONS_STD],
  };
}

/** Build T2V parameters for std (seedance-2.0) or fast variant. */
export function seedanceT2vParameters(forFast: boolean): ModelParameter[] {
  const base: ModelParameter[] = [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the video to generate",
      required: true,
    },
    resolutionParam(forFast),
    ...commonParameters,
    {
      name: "web_search",
      type: "boolean",
      description: "Enable web search grounding for the prompt",
      default: false,
    },
  ];

  if (!forFast) {
    // camera_fixed / watermark only accepted on std variant
    base.push(
      {
        name: "camera_fixed",
        type: "boolean",
        description: "Lock camera position (no panning/zooming)",
        default: false,
      },
      {
        name: "watermark",
        type: "boolean",
        description: "Add watermark to the output video",
        default: false,
      },
    );
  }

  return base;
}

/** Build I2V parameters for std or fast variant. */
export function seedanceI2vParameters(forFast: boolean): ModelParameter[] {
  return [
    {
      name: "image",
      type: "string",
      description:
        "First frame image. HTTP(S) URL, data: URI, or local file path (auto-converted to base64)",
      required: true,
    },
    {
      name: "last_frame_image",
      type: "string",
      description:
        "Optional last frame image. HTTP(S) URL, data: URI, or local file path (auto-converted to base64)",
    },
    {
      name: "prompt",
      type: "string",
      description: "Optional text prompt for video motion guidance",
    },
    resolutionParam(forFast),
    ...commonParameters,
  ];
}

/** Build R2V parameters for std or fast variant. */
export function seedanceR2vParameters(forFast: boolean): ModelParameter[] {
  return [
    {
      name: "prompt",
      type: "string",
      description: "Optional text prompt for video generation",
    },
    {
      name: "images",
      type: "array",
      description:
        'Reference images (1-9). JSON array of HTTP(S) URLs / data: URIs / local file paths. At least one of --images / --videos must be provided. Example: --images \'["/tmp/a.png","https://example.com/b.jpg"]\'',
    },
    {
      name: "videos",
      type: "array",
      description:
        "Reference videos (1-3). JSON array of HTTPS URLs ONLY (no http, no base64). At least one of --images / --videos must be provided. Example: --videos '[\"https://example.com/clip.mp4\"]'",
    },
    {
      name: "audios",
      type: "array",
      description:
        "Reference audios (1-3). JSON array of URLs / data: URIs. Cannot be used alone — must be combined with --images or --videos. Example: --audios '[\"https://example.com/voice.mp3\"]'",
    },
    resolutionParam(forFast),
    ...commonParameters,
    {
      name: "web_search",
      type: "boolean",
      description: "Enable web search grounding for the prompt",
      default: false,
    },
  ];
}
