/** Convert a snake_case parameter name to a CLI flag name (e.g., "prompt_extend" -> "prompt-extend"). */
export function toCliFlag(name: string): string {
  return name.replace(/_/g, "-");
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
