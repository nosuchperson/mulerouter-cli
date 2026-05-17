import type { ModelEndpoint, OutputType, Site } from "@mulerouter/core";
import { registry } from "@mulerouter/core";
import pc from "picocolors";

interface ListOptions {
  provider?: string;
  outputType?: string;
  tag?: string;
  site?: string;
  json?: boolean;
  providers?: boolean;
}

const VALID_OUTPUT_TYPES = new Set(["image", "video", "text", "audio"]);
const VALID_SITES = new Set(["mulerouter", "mulerun"]);

/** Validate filter options and warn on invalid values. */
function validateFilters(options: ListOptions): void {
  if (options.provider) {
    const providers = registry.getProviders();
    if (!providers.includes(options.provider)) {
      console.error(
        pc.yellow(
          `Warning: Unknown provider '${options.provider}'. ` +
            `Available providers: ${providers.join(", ")}`,
        ),
      );
    }
  }

  if (options.outputType && !VALID_OUTPUT_TYPES.has(options.outputType)) {
    console.error(
      pc.yellow(
        `Warning: Unknown output type '${options.outputType}'. ` +
          `Valid types: ${[...VALID_OUTPUT_TYPES].join(", ")}`,
      ),
    );
  }

  if (options.site && !VALID_SITES.has(options.site)) {
    console.error(
      pc.yellow(`Warning: Unknown site '${options.site}'. Valid sites: mulerouter, mulerun`),
    );
  }
}

/** Filter and list model endpoints. */
function filterEndpoints(options: ListOptions): ModelEndpoint[] {
  let endpoints = registry.listAll();

  if (options.site) {
    endpoints = endpoints.filter((e) => e.availableOn.includes(options.site as Site));
  }
  if (options.provider) {
    endpoints = endpoints.filter((e) => e.provider === options.provider);
  }
  if (options.outputType) {
    endpoints = endpoints.filter((e) => e.outputType === (options.outputType as OutputType));
  }
  if (options.tag) {
    const tagLower = options.tag.toLowerCase();
    endpoints = endpoints.filter((e) => e.tags?.some((t) => t.toLowerCase() === tagLower));
  }

  return endpoints;
}

/** Format endpoints as human-readable text. */
function formatEndpointsText(endpoints: ModelEndpoint[], site?: string): string {
  if (endpoints.length === 0) return "No models found.";

  const lines: string[] = [];
  let header = "Available Models";
  if (site) header += ` (${site})`;
  lines.push(pc.bold(header));
  lines.push("=".repeat(60));

  // Group by provider
  const byProvider = new Map<string, ModelEndpoint[]>();
  for (const e of endpoints) {
    const list = byProvider.get(e.provider) ?? [];
    list.push(e);
    byProvider.set(e.provider, list);
  }

  for (const [provider, models] of [...byProvider.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    lines.push("");
    lines.push(pc.cyan(`[${provider.toUpperCase()}]`));
    lines.push("-".repeat(40));

    const sorted = models.sort((a, b) => {
      const cmp = a.modelId.localeCompare(b.modelId);
      return cmp !== 0 ? cmp : a.action.localeCompare(b.action);
    });

    for (const m of sorted) {
      const tags = m.tags?.length ? ` ${pc.yellow(`[${m.tags.join(", ")}]`)}` : "";
      lines.push("");
      lines.push(`  ${pc.green(`${m.modelId}/${m.action}`)}${tags}`);
      lines.push(`    ${m.description}`);
      lines.push(`    Output: ${m.outputType}`);
    }
  }

  lines.push("");
  lines.push(`Total: ${endpoints.length} endpoint(s)`);
  return lines.join("\n");
}

/** Execute the list command. */
export function executeList(options: ListOptions): void {
  if (options.providers) {
    const providers = registry.getProviders();
    if (options.json) {
      console.log(JSON.stringify({ providers }, null, 2));
    } else {
      console.log(pc.bold("Available Providers:"));
      for (const p of providers) {
        console.log(`  - ${p}`);
      }
    }
    return;
  }

  validateFilters(options);

  const endpoints = filterEndpoints(options);

  if (options.json) {
    const models = endpoints.map((e) => ({
      model_id: e.modelId,
      action: e.action,
      provider: e.provider,
      model_name: e.modelName,
      description: e.description,
      input_types: e.inputTypes,
      output_type: e.outputType,
      api_path: e.apiPath,
      available_on: e.availableOn,
      result_key: e.resultKey,
      ...(e.tags?.length ? { tags: e.tags } : {}),
    }));
    console.log(JSON.stringify({ models, site: options.site ?? null }, null, 2));
  } else {
    console.log(formatEndpointsText(endpoints, options.site));
  }
}
