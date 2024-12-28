import { exists, readdir } from "fs/promises";
import { join } from "path";

export async function listFiles(
  parentDir: string,
  filter?: (f: string) => boolean
) {
  if (!(await exists(parentDir))) return [];
  const files = (await readdir(parentDir)).map((f) => join(parentDir, f));
  return filter ? files.filter(filter) : files;
}
