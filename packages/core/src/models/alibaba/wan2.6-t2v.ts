import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";

const endpoint: ModelEndpoint = {
  modelId: "alibaba/wan2.6-t2v",
  action: "generation",
  provider: "alibaba",
  modelName: "wan2.6-t2v",
  description:
    "Wan2.6 Text-to-Video: Generate videos from text prompts with multi-shot, audio, and resolution control",
  inputTypes: ["text"],
  outputType: "video",
  apiPath: "/vendors/alibaba/v1/wan2.6-t2v/generation",
  availableOn: ["mulerouter", "mulerun"],
  resultKey: "videos",
  tags: ["SOTA"],
  parameters: [
    {
      name: "prompt",
      type: "string",
      description: "Text prompt describing the video to generate",
      required: true,
    },
    {
      name: "negative_prompt",
      type: "string",
      description: "Text describing what to avoid in the video",
    },
    {
      name: "size",
      type: "string",
      description: "Video resolution",
      default: "1280*720",
      enum: [
        "1280*720",
        "960*960",
        "720*1280",
        "1920*1080",
        "1080*1920",
        "2048*1080",
        "1080*2048",
        "1080*1080",
      ],
    },
    {
      name: "duration",
      type: "integer",
      description: "Video duration in seconds",
      default: 5,
      enum: [5, 10, 15],
    },
    {
      name: "prompt_extend",
      type: "boolean",
      description: "Whether to extend/enhance the prompt automatically",
      default: true,
    },
    {
      name: "multi_shots",
      type: "boolean",
      description: "Enable multi-shot video generation",
      default: false,
    },
    {
      name: "audio",
      type: "boolean",
      description: "Enable audio generation for the video",
      default: false,
    },
    { name: "audio_url", type: "string", description: "URL of audio to use in the video" },
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
