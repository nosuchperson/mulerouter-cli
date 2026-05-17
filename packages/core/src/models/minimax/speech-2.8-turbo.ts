import { registerEndpoint } from "../../registry.js";
import type { ModelEndpoint } from "../../types.js";
import { buildSpeechRequestBody, speechParameters } from "./_builders.js";

const endpoint: ModelEndpoint = {
  modelId: "minimax/speech-2.8-turbo",
  action: "generation",
  provider: "minimax",
  modelName: "speech-2.8-turbo",
  description: "MiniMax Speech 2.8 Turbo: Fast and affordable text-to-speech with 37+ languages",
  inputTypes: ["text"],
  outputType: "audio",
  apiPath: "/vendors/minimax/v1/speech-2.8-turbo/text-to-speech/generation",
  availableOn: ["mulerun"],
  resultKey: "audios",
  parameters: speechParameters,
  buildRequestBody: buildSpeechRequestBody,
};

registerEndpoint(endpoint);

export { endpoint };
