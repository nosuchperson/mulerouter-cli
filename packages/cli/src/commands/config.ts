import { getConfigHelp, loadConfig } from "@mulerouter/core";
import pc from "picocolors";

/** Execute the config command. */
export function executeConfig(): void {
  // Try loading current config
  try {
    const config = loadConfig();
    console.log(pc.bold("Current Configuration:"));
    console.log(`  API Key:    ${config.apiKey.slice(0, 4)}..${config.apiKey.slice(-2)}`);
    console.log(`  Base URL:   ${config.baseUrl}`);
    console.log(`  Site:       ${config.site ?? "(derived from base URL)"}`);
    console.log(`  Timeout:    ${config.timeout}ms`);
    console.log(`  Max Retries: ${config.maxRetries}`);
  } catch {
    console.log(pc.yellow("No configuration found.\n"));
  }

  console.log("");
  console.log(getConfigHelp());
}
