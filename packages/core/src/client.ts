import type { APIResponse, Config } from "./types.js";
import { sleep } from "./utils.js";

/** Retryable HTTP status codes. */
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

/**
 * HTTP client for MuleRouter/MuleRun API.
 *
 * Features:
 * - Automatic retries with exponential backoff
 * - Proper authentication headers
 * - Timeout handling
 */
export class APIClient {
  private controller: AbortController | null = null;
  private aborted = false;
  private userAgent: string;

  constructor(private readonly config: Config) {
    this.userAgent = `MuleRouter-CLI/${config.version ?? "dev"}`;
  }

  /** Make an HTTP request with retry logic. */
  async request(
    method: string,
    path: string,
    options?: { json?: Record<string, unknown>; params?: Record<string, string> },
  ): Promise<APIResponse> {
    this.aborted = false;
    let lastResponse: APIResponse | undefined;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      if (this.aborted) {
        return (
          lastResponse ?? {
            success: false,
            error: "Request aborted",
            statusCode: 0,
          }
        );
      }

      this.controller?.abort();
      this.controller = new AbortController();

      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      try {
        timeoutId = setTimeout(() => this.controller?.abort(), this.config.timeout);

        let url = `${this.config.baseUrl}${path}`;
        if (options?.params) {
          const searchParams = new URLSearchParams(options.params);
          url += `?${searchParams.toString()}`;
        }

        const site = this.config.site ?? "mulerouter";

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": this.userAgent,
            "X-Agent-Skills": site,
          },
          body: options?.json ? JSON.stringify(options.json) : undefined,
          signal: this.controller.signal,
        });

        const apiResponse = await this.handleResponse(response);
        if (apiResponse.success || !RETRYABLE_STATUS_CODES.has(response.status)) {
          return apiResponse;
        }

        lastResponse = apiResponse;

        // Respect Retry-After header for backoff
        if (attempt < this.config.maxRetries) {
          const retryAfter = response.headers.get("retry-after");
          if (retryAfter) {
            const seconds = Number.parseInt(retryAfter, 10);
            if (!Number.isNaN(seconds) && seconds > 0 && seconds <= 120) {
              await sleep(seconds * 1000);
              continue;
            }
          }
        }
      } catch (error) {
        if (this.aborted || (error instanceof DOMException && error.name === "AbortError")) {
          lastResponse = {
            success: false,
            error: this.aborted
              ? "Request aborted"
              : `Request timeout after ${this.config.timeout}ms`,
            statusCode: 0,
          };
          if (this.aborted) return lastResponse;
        } else {
          lastResponse = {
            success: false,
            error: `Request error: ${error instanceof Error ? error.message : String(error)}`,
            statusCode: 0,
          };
        }
      } finally {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }
      }

      if (attempt < this.config.maxRetries) {
        const waitMs = 2 ** attempt * 1000 * (0.5 + Math.random() * 0.5);
        await sleep(waitMs);
      }
    }

    return lastResponse ?? { success: false, error: "Max retries exceeded", statusCode: 0 };
  }

  /** Make a POST request. */
  async post(path: string, json?: Record<string, unknown>): Promise<APIResponse> {
    return this.request("POST", path, { json });
  }

  /** Make a GET request. */
  async get(path: string, params?: Record<string, string>): Promise<APIResponse> {
    return this.request("GET", path, { params });
  }

  /** Abort any in-flight request. */
  abort(): void {
    this.aborted = true;
    this.controller?.abort();
  }

  private async handleResponse(response: Response): Promise<APIResponse> {
    const traceparent = response.headers.get("traceparent") ?? undefined;

    let data: Record<string, unknown> | undefined;
    try {
      data = (await response.json()) as Record<string, unknown>;
    } catch {
      data = undefined;
    }

    if (response.ok) {
      return { success: true, data, statusCode: response.status, traceparent };
    }

    // Extract error message
    let errorMsg = `HTTP ${response.status}`;
    if (data) {
      if (typeof data.detail === "string") {
        errorMsg = data.detail;
      } else if (typeof data.error === "string") {
        errorMsg = data.error;
      } else if (typeof data.message === "string") {
        errorMsg = data.message;
      } else if (data.task_info && typeof data.task_info === "object") {
        const taskInfo = data.task_info as Record<string, unknown>;
        if (taskInfo.error && typeof taskInfo.error === "object") {
          const err = taskInfo.error as Record<string, unknown>;
          errorMsg = (err.detail as string) ?? (err.title as string) ?? JSON.stringify(err);
        }
      }
    }

    return { success: false, data, error: errorMsg, statusCode: response.status, traceparent };
  }
}
