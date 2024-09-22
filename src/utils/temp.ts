import { mkdtempSync } from "node:fs";

export function getTempDir(...prefixes: [string, ...string[]]) {
  return mkdtempSync(`os-src-${prefixes.join("-")}`);
}
