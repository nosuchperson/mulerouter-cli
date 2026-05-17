import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";
import { buildMusicRequestBody } from "./_builders.js";

const endpoint: ModelEndpoint = {
  modelId: "minimax/music-2.0",
  action: "generation",
  provider: "minimax",
  modelName: "music-2.0",
  description: "MiniMax Music 2.0: Generate music from lyrics and style descriptions (up to 5 min)",
  inputTypes: ["text"],
  outputType: "audio",
  apiPath: "/vendors/minimax/v1/music-2.0/text-to-music/generation",
  availableOn: ["mulerun"],
  resultKey: "audios",
  parameters: [
    { name: "prompt", type: "string", description: "Style description (max 2000 chars)" },
    {
      name: "lyrics_prompt",
      type: "string",
      description: "Song lyrics with structure tags like [verse], [chorus] (10-3000 chars)",
      required: true,
    },
    { name: "audio_format", type: "string", description: "Audio encoding format" },
    { name: "sample_rate", type: "integer", description: "Audio sample rate in Hz" },
    { name: "bitrate", type: "integer", description: "Audio bitrate in bps" },
  ],
  buildRequestBody: buildMusicRequestBody,
};

registerEndpoint(endpoint);

export { endpoint };
