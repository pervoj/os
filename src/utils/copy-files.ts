import { $ } from "bun";
import { readdir } from "fs/promises";
import { join } from "path";

export async function copyFiles(parentDir: string, targetDir = "/") {
  console.log(`Copying files: ${parentDir} -> ${targetDir}`);
  const files = (await readdir(parentDir)).map((f) => join(parentDir, f));
  await $`mkdir -p ${targetDir}`;
  await $`cp -r ${files} ${targetDir}`;
}
