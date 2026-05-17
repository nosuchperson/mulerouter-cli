import { beforeEach, describe, expect, it, vi } from "vitest";
import { APIClient } from "../src/client.js";
import type { Config } from "../src/types.js";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function createConfig(overrides?: Partial<Config>): Config {
  return {
    apiKey: "test-api-key",
    baseUrl: "https://api.test.com",
    timeout: 5000,
    maxRetries: 2,
    ...overrides,
  };
}

function jsonResponse(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: { "Content-Type": "application/json", ...headers },
  });
}

describe("APIClient", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("constructor", () => {
    it("should store config", () => {
      const config = createConfig();
      const client = new APIClient(config);
      expect(client).toBeDefined();
    });
  });

  describe("request", () => {
    it("should make a successful request with proper headers", async () => {
      const config = createConfig();
      const client = new APIClient(config);

      mockFetch.mockResolvedValueOnce(jsonResponse({ result: "ok" }));

      const response = await client.request("POST", "/test/path", {
        json: { prompt: "hello" },
      });

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ result: "ok" });
      expect(response.statusCode).toBe(200);

      // Verify fetch was called with correct args
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.test.com/test/path");
      expect(options.method).toBe("POST");
      expect(options.headers.Authorization).toBe("Bearer test-api-key");
      expect(options.headers["User-Agent"]).toContain("MuleRouter-CLI");
      expect(options.headers["X-Agent-Skills"]).toBe("mulerouter");
      expect(JSON.parse(options.body)).toEqual({ prompt: "hello" });
    });

    it("should handle query parameters", async () => {
      const client = new APIClient(createConfig());
      mockFetch.mockResolvedValueOnce(jsonResponse({ data: true }));

      await client.get("/path", { key: "value" });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.test.com/path?key=value");
    });

    it("should handle error responses with detail field", async () => {
      const client = new APIClient(createConfig());
      mockFetch.mockResolvedValueOnce(jsonResponse({ detail: "Not found" }, 404));

      const response = await client.request("GET", "/not-found");
      expect(response.success).toBe(false);
      expect(response.error).toBe("Not found");
      expect(response.statusCode).toBe(404);
    });

    it("should handle error responses with error field", async () => {
      const client = new APIClient(createConfig());
      mockFetch.mockResolvedValueOnce(jsonResponse({ error: "Bad request" }, 400));

      const response = await client.request("GET", "/bad");
      expect(response.success).toBe(false);
      expect(response.error).toBe("Bad request");
    });

    it("should handle error responses with task_info.error", async () => {
      const client = new APIClient(createConfig());
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ task_info: { error: { detail: "Task failed", title: "Error" } } }, 500),
      );

      const response = await client.request("GET", "/task");
      // 500 is retryable, so it retries — but after retries exhausted, returns error
      expect(response.success).toBe(false);
    });

    it("should extract traceparent header", async () => {
      const client = new APIClient(createConfig());
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ ok: true }, 200, { traceparent: "00-trace-id" }),
      );

      const response = await client.request("GET", "/trace");
      expect(response.traceparent).toBe("00-trace-id");
    });

    it("should retry on 429 status", async () => {
      const client = new APIClient(createConfig({ maxRetries: 1 }));

      mockFetch
        .mockResolvedValueOnce(jsonResponse({ error: "Rate limited" }, 429))
        .mockResolvedValueOnce(jsonResponse({ result: "ok" }, 200));

      const response = await client.request("GET", "/rate-limited");
      expect(response.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should retry on 500 status", async () => {
      const client = new APIClient(createConfig({ maxRetries: 1 }));

      mockFetch
        .mockResolvedValueOnce(jsonResponse({ error: "Server error" }, 500))
        .mockResolvedValueOnce(jsonResponse({ result: "ok" }, 200));

      const response = await client.request("GET", "/server-error");
      expect(response.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should not retry on 400 status", async () => {
      const client = new APIClient(createConfig({ maxRetries: 2 }));
      mockFetch.mockResolvedValueOnce(jsonResponse({ error: "Bad request" }, 400));

      const response = await client.request("GET", "/bad");
      expect(response.success).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should not retry on 401 status", async () => {
      const client = new APIClient(createConfig({ maxRetries: 2 }));
      mockFetch.mockResolvedValueOnce(jsonResponse({ error: "Unauthorized" }, 401));

      const response = await client.request("GET", "/unauth");
      expect(response.success).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should return last response after exhausting retries", async () => {
      const client = new APIClient(createConfig({ maxRetries: 1 }));

      mockFetch
        .mockResolvedValueOnce(jsonResponse({ error: "Server error" }, 500))
        .mockResolvedValueOnce(jsonResponse({ error: "Still failing" }, 500));

      const response = await client.request("GET", "/failing");
      expect(response.success).toBe(false);
      expect(response.error).toBe("Still failing");
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should handle network errors", async () => {
      const client = new APIClient(createConfig({ maxRetries: 0 }));
      mockFetch.mockRejectedValueOnce(new Error("Network failure"));

      const response = await client.request("GET", "/network-fail");
      expect(response.success).toBe(false);
      expect(response.error).toContain("Network failure");
    });

    it("should retry on 502 status", async () => {
      const client = new APIClient(createConfig({ maxRetries: 1 }));

      mockFetch
        .mockResolvedValueOnce(jsonResponse({ error: "Bad Gateway" }, 502))
        .mockResolvedValueOnce(jsonResponse({ result: "ok" }, 200));

      const response = await client.request("GET", "/bad-gateway");
      expect(response.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should retry on 503 status", async () => {
      const client = new APIClient(createConfig({ maxRetries: 1 }));

      mockFetch
        .mockResolvedValueOnce(jsonResponse({ error: "Service Unavailable" }, 503))
        .mockResolvedValueOnce(jsonResponse({ result: "ok" }, 200));

      const response = await client.request("GET", "/unavailable");
      expect(response.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should retry on 504 status", async () => {
      const client = new APIClient(createConfig({ maxRetries: 1 }));

      mockFetch
        .mockResolvedValueOnce(jsonResponse({ error: "Gateway Timeout" }, 504))
        .mockResolvedValueOnce(jsonResponse({ result: "ok" }, 200));

      const response = await client.request("GET", "/timeout");
      expect(response.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should handle error responses with message field", async () => {
      const client = new APIClient(createConfig());
      mockFetch.mockResolvedValueOnce(jsonResponse({ message: "Validation failed" }, 422));

      const response = await client.request("GET", "/validate");
      expect(response.success).toBe(false);
      expect(response.error).toBe("Validation failed");
    });

    it("should handle non-JSON error responses", async () => {
      const client = new APIClient(createConfig({ maxRetries: 0 }));
      mockFetch.mockResolvedValueOnce(
        new Response("Internal Server Error", {
          status: 500,
          statusText: "Internal Server Error",
        }),
      );

      const response = await client.request("GET", "/text-error");
      expect(response.success).toBe(false);
      expect(response.error).toBe("HTTP 500");
    });
  });

  describe("abort", () => {
    it("should abort in-flight request", async () => {
      const client = new APIClient(createConfig({ maxRetries: 0 }));

      // Mock a fetch that will hang until aborted
      mockFetch.mockImplementationOnce(
        (_url: string, init: { signal: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            init.signal.addEventListener("abort", () => {
              reject(new DOMException("The operation was aborted.", "AbortError"));
            });
          }),
      );

      const promise = client.request("GET", "/slow");
      // Abort after a tick
      setTimeout(() => client.abort(), 1);
      const response = await promise;

      expect(response.success).toBe(false);
      expect(response.error).toContain("aborted");
    });
  });

  describe("post", () => {
    it("should make a POST request", async () => {
      const client = new APIClient(createConfig());
      mockFetch.mockResolvedValueOnce(jsonResponse({ created: true }));

      const response = await client.post("/create", { data: "test" });
      expect(response.success).toBe(true);

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe("POST");
    });
  });

  describe("get", () => {
    it("should make a GET request", async () => {
      const client = new APIClient(createConfig());
      mockFetch.mockResolvedValueOnce(jsonResponse({ data: "test" }));

      const response = await client.get("/read");
      expect(response.success).toBe(true);

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe("GET");
    });
  });
});
