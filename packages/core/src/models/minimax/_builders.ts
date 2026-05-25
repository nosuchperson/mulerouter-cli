import type { ModelParameter } from "../../types.js";

/**
 * Build nested request body for MiniMax Speech 2.8 models.
 * Transforms flat CLI params into nested voice_setting and audio_setting objects.
 */
export function buildSpeechRequestBody(params: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  if (params.prompt !== undefined) body.prompt = params.prompt;

  const voiceSetting: Record<string, unknown> = {};
  if (params.voice_id !== undefined) voiceSetting.voice_id = params.voice_id;
  if (params.speed !== undefined) voiceSetting.speed = params.speed;
  if (params.vol !== undefined) voiceSetting.vol = params.vol;
  if (params.pitch !== undefined) voiceSetting.pitch = params.pitch;
  if (params.emotion !== undefined) voiceSetting.emotion = params.emotion;
  if (params.language_boost !== undefined) voiceSetting.language_boost = params.language_boost;
  if (Object.keys(voiceSetting).length > 0) body.voice_setting = voiceSetting;

  const audioSetting: Record<string, unknown> = {};
  if (params.audio_format !== undefined) audioSetting.format = params.audio_format;
  if (params.sample_rate !== undefined) audioSetting.sample_rate = params.sample_rate;
  if (params.bitrate !== undefined) audioSetting.bitrate = params.bitrate;
  if (Object.keys(audioSetting).length > 0) body.audio_setting = audioSetting;

  if (params.english_normalization !== undefined) {
    body.english_normalization = params.english_normalization;
  }

  // output_format belongs at body root per upstream ExternalSpeechGenerationRequest
  // schema (mule-router tasks/handlers/minimax/models/external.py:254). Nesting it
  // under audio_setting causes upstream pydantic to silently drop it and default to HEX.
  if (params.output_format !== undefined) body.output_format = params.output_format;

  return body;
}

/**
 * Build nested request body for MiniMax Music models.
 * Transforms flat CLI params into nested audio_setting object.
 */
export function buildMusicRequestBody(params: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  if (params.prompt !== undefined) body.prompt = params.prompt;
  if (params.lyrics_prompt !== undefined) body.lyrics_prompt = params.lyrics_prompt;
  if (params.lyrics_optimizer !== undefined) body.lyrics_optimizer = params.lyrics_optimizer;

  const audioSetting: Record<string, unknown> = {};
  if (params.audio_format !== undefined) audioSetting.format = params.audio_format;
  if (params.sample_rate !== undefined) audioSetting.sample_rate = params.sample_rate;
  if (params.bitrate !== undefined) audioSetting.bitrate = params.bitrate;
  if (Object.keys(audioSetting).length > 0) body.audio_setting = audioSetting;

  return body;
}

/** Shared parameter definitions for Speech 2.8 models. */
export const speechParameters: ModelParameter[] = [
  {
    name: "prompt",
    type: "string",
    description: "Text to convert to speech (1-50000 chars)",
    required: true,
  },
  {
    name: "voice_id",
    type: "string",
    description: "Voice ID for speech synthesis (see --list-params for options)",
    required: true,
  },
  { name: "speed", type: "number", description: "Speech speed (0.5-2.0)" },
  { name: "vol", type: "number", description: "Volume level (0.01-10.0)" },
  { name: "pitch", type: "integer", description: "Pitch adjustment (-12 to 12)" },
  {
    name: "emotion",
    type: "string",
    description: "Emotional tone",
    enum: ["happy", "sad", "angry", "fearful", "disgusted", "surprised", "neutral"],
  },
  {
    name: "language_boost",
    type: "string",
    description:
      "Optimize for a specific language (e.g., zh, en, ja, ko, es, pt, fr, id, de, ru, it, ar, tr, uk, nl, vi, th, pl, ro, el, cs, fi, hi)",
  },
  {
    name: "output_format",
    type: "string",
    description:
      "Output schema for audios[0]. 'url' → HTTPS download link (recommended). 'hex' → hex-encoded raw audio bytes (decode with `xxd -r -p > out.mp3`); the bytes are an MP3 with ID3 header regardless of --audio-format. Upstream MiniMax default: hex.",
    enum: ["url", "hex"],
  },
  {
    name: "audio_format",
    type: "string",
    description: "Audio encoding format",
    enum: ["mp3", "pcm", "flac"],
  },
  { name: "sample_rate", type: "integer", description: "Audio sample rate in Hz" },
  { name: "bitrate", type: "integer", description: "Audio bitrate in bps" },
  {
    name: "english_normalization",
    type: "boolean",
    description: "Enable English text normalization",
  },
];
