import { $ } from "bun";
import { listFiles } from "./list-files";

export async function copyFiles(parentDir: string, targetDir = "/") {
  console.log(`Copying files: ${parentDir} -> ${targetDir}`);
  const files = await listFiles(parentDir);
  if (!files.length) return;
  await $`mkdir -p ${targetDir}`;
  await $`cp -r ${files} ${targetDir}`;
}
