import type { ModelEndpoint } from "@mulerouter/core";
import { registry, toCliFlag } from "@mulerouter/core";
import pc from "picocolors";

/** Format parameter list as text. */
function formatParamsText(endpoint: ModelEndpoint): string {
  const lines: string[] = [];
  lines.push(pc.bold(`${endpoint.modelId}/${endpoint.action}`));
  lines.push(pc.dim(endpoint.description));
  lines.push("");
  lines.push(pc.bold("Parameters:"));
  lines.push("-".repeat(60));

  for (const p of endpoint.parameters) {
    const required = p.required ? pc.red(" (required)") : "";
    const defaultVal = p.default !== undefined ? pc.dim(` [default: ${p.default}]`) : "";
    const enumVals = p.enum ? pc.dim(` [choices: ${p.enum.join(", ")}]`) : "";
    lines.push("");
    lines.push(`  ${pc.green(`--${toCliFlag(p.name)}`)}${required}${defaultVal}`);
    lines.push(`    Type: ${p.type}${enumVals}`);
    lines.push(`    ${p.description}`);
  }

  lines.push("");
  lines.push(pc.dim("API Path: ") + endpoint.apiPath);
  lines.push(pc.dim("Output Type: ") + endpoint.outputType);
  lines.push(pc.dim("Result Key: ") + endpoint.resultKey);
  lines.push(pc.dim("Available On: ") + endpoint.availableOn.join(", "));
  return lines.join("\n");
}

/** Format parameter list as JSON. */
function formatParamsJson(endpoint: ModelEndpoint): string {
  return JSON.stringify(
    {
      model_id: endpoint.modelId,
      action: endpoint.action,
      description: endpoint.description,
      api_path: endpoint.apiPath,
      output_type: endpoint.outputType,
      result_key: endpoint.resultKey,
      available_on: endpoint.availableOn,
      parameters: endpoint.parameters.map((p) => ({
        name: p.name,
        type: p.type,
        description: p.description,
        required: p.required ?? false,
        ...(p.default !== undefined ? { default: p.default } : {}),
        ...(p.enum ? { enum: p.enum } : {}),
      })),
    },
    null,
    2,
  );
}

/** Resolve an endpoint identifier to a ModelEndpoint. */
export function resolveEndpoint(identifier: string): ModelEndpoint {
  // Try exact match: "provider/model/action"
  const parts = identifier.split("/");
  if (parts.length === 3) {
    const modelId = `${parts[0]}/${parts[1]}`;
    const action = parts[2];
    const endpoint = registry.get(modelId, action);
    if (endpoint) return endpoint;
  }

  // Try as modelId with auto-resolved action: "provider/model"
  if (parts.length === 2) {
    const modelId = identifier;
    const matches = registry.findByModelId(modelId);
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      const actions = matches.map((m) => `${m.modelId}/${m.action}`).join(", ");
      throw new Error(`Multiple actions found for '${modelId}'. Please specify one of: ${actions}`);
    }
  }

  throw new Error(
    `Model endpoint '${identifier}' not found. Use 'mulerouter list' to see available models.`,
  );
}

/** Execute the params command. */
export function executeParams(identifier: string, options: { json?: boolean }): void {
  let endpoint: ModelEndpoint;
  try {
    endpoint = resolveEndpoint(identifier);
  } catch (error) {
    console.error(pc.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    process.exitCode = 1;
    return;
  }

  if (options.json) {
    console.log(formatParamsJson(endpoint));
  } else {
    console.log(formatParamsText(endpoint));
  }
}
