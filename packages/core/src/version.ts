declare const __VERSION__: string;

export const VERSION: string = typeof __VERSION__ !== "undefined" ? __VERSION__ : "dev";
