/** Parse a string option as a positive integer, with default and flag name for errors. */
export function parsePositiveInt(
  value: string | undefined,
  defaultValue: number,
  flag: string,
): number {
  if (value === undefined) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`Invalid value for ${flag}: '${value}'. Must be a positive integer.`);
  }
  return parsed;
}
