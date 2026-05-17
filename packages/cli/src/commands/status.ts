import type { TaskStatus } from "@mulerouter/core";
import {
  APIClient,
  isSuccessStatus,
  isTerminalStatus,
  loadConfig,
  parseTaskResponse,
  pollTask,
} from "@mulerouter/core";
import pc from "picocolors";
import { parsePositiveInt } from "../utils.js";

interface StatusOptions {
  apiKey?: string;
  baseUrl?: string;
  site?: string;
  wait?: boolean;
  pollInterval?: string;
  maxWait?: string;
  quiet?: boolean;
  json?: boolean;
}

function formatStatus(
  taskId: string,
  status: string,
  error: string | undefined,
  results: string[] | undefined,
  json: boolean,
): string {
  if (json) {
    return JSON.stringify(
      {
        task_id: taskId,
        status,
        ...(error ? { error } : {}),
        ...(results?.length ? { results } : {}),
      },
      null,
      2,
    );
  }

  const lines: string[] = [];
  lines.push(`Task ID: ${taskId}`);
  const color = isSuccessStatus(status as TaskStatus)
    ? pc.green
    : isTerminalStatus(status as TaskStatus)
      ? pc.red
      : pc.yellow;
  lines.push(`Status:  ${color(status)}`);
  if (error) lines.push(`Error:   ${pc.red(error)}`);
  if (results?.length) {
    lines.push("");
    lines.push(pc.bold("Results:"));
    for (const url of results) {
      lines.push(`  ${url}`);
    }
  }
  return lines.join("\n");
}

export async function executeStatus(
  endpoint: string,
  taskId: string,
  options: StatusOptions,
): Promise<void> {
  let config: ReturnType<typeof loadConfig> | undefined;
  try {
    config = loadConfig({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      site: options.site,
    });
  } catch (error) {
    console.error(pc.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    process.exitCode = 1;
    return;
  }

  const client = new APIClient(config);
  const verbose = !options.quiet;

  try {
    if (options.wait) {
      const pollInterval = parsePositiveInt(options.pollInterval, 20, "--poll-interval") * 1000;
      const maxWait = parsePositiveInt(options.maxWait, 900, "--max-wait") * 1000;

      const result = await pollTask({
        client,
        taskPath: endpoint,
        taskId,
        interval: pollInterval,
        maxWait,
        verbose,
      });

      console.log(
        formatStatus(result.taskId, result.status, result.error, result.results, !!options.json),
      );

      if (!isSuccessStatus(result.status)) {
        process.exitCode = 1;
      }
    } else {
      const pollUrl = `${endpoint}/${taskId}`;
      const response = await client.get(pollUrl);

      if (!response.success) {
        console.error(pc.red(`Error: ${response.error ?? "Request failed"}`));
        process.exitCode = 1;
        return;
      }

      const result = parseTaskResponse(response.data ?? {});
      console.log(
        formatStatus(result.taskId, result.status, result.error, result.results, !!options.json),
      );

      if (result.status === "failed") {
        process.exitCode = 1;
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(pc.red(`Error: ${message}`));
    process.exitCode = 1;
  }
}
