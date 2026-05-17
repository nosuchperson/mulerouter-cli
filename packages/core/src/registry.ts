import type { ModelEndpoint, OutputType, Site } from "./types.js";

/**
 * Registry for tracking available model endpoints.
 * Singleton pattern — models register themselves at import time.
 */
export class ModelRegistry {
  private static instance: ModelRegistry | null = null;
  private endpoints = new Map<string, ModelEndpoint>();

  private constructor() {}

  static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  /** Reset registry (for testing). */
  static resetForTesting(): void {
    ModelRegistry.instance = null;
  }

  /** Register a model endpoint. */
  register(endpoint: ModelEndpoint): void {
    const key = `${endpoint.modelId}/${endpoint.action}`;
    this.endpoints.set(key, endpoint);
  }

  /** Get a registered endpoint. */
  get(modelId: string, action: string): ModelEndpoint | undefined {
    return this.endpoints.get(`${modelId}/${action}`);
  }

  /** Find an endpoint by partial match (modelId only, auto-resolve action). */
  findByModelId(modelId: string): ModelEndpoint[] {
    const results: ModelEndpoint[] = [];
    for (const endpoint of this.endpoints.values()) {
      if (endpoint.modelId === modelId) {
        results.push(endpoint);
      }
    }
    return results;
  }

  /** List all registered endpoints. */
  listAll(): ModelEndpoint[] {
    return [...this.endpoints.values()];
  }

  /** List endpoints available on a specific site. */
  listForSite(site: Site): ModelEndpoint[] {
    return this.listAll().filter((e) => e.availableOn.includes(site));
  }

  /** List endpoints for a specific provider. */
  listByProvider(provider: string): ModelEndpoint[] {
    return this.listAll().filter((e) => e.provider === provider);
  }

  /** List endpoints by output type. */
  listByOutputType(outputType: OutputType): ModelEndpoint[] {
    return this.listAll().filter((e) => e.outputType === outputType);
  }

  /** List endpoints by tag (case-insensitive). */
  listByTag(tag: string): ModelEndpoint[] {
    const tagLower = tag.toLowerCase();
    return this.listAll().filter((e) => e.tags?.some((t) => t.toLowerCase() === tagLower));
  }

  /** Get unique provider names. */
  getProviders(): string[] {
    const providers = new Set<string>();
    for (const e of this.endpoints.values()) {
      providers.add(e.provider);
    }
    return [...providers].sort();
  }

  /** Get unique model IDs. */
  getModelIds(): string[] {
    const models = new Set<string>();
    for (const e of this.endpoints.values()) {
      models.add(e.modelId);
    }
    return [...models].sort();
  }
}

/** Global registry instance. */
export const registry = ModelRegistry.getInstance();

/** Register an endpoint with the global registry. */
export function registerEndpoint(endpoint: ModelEndpoint): ModelEndpoint {
  registry.register(endpoint);
  return endpoint;
}
