import { $ } from "bun";
import { join } from "path";

export async function copyFiles(
  parentDirectory: string,
  targetDirectory = "/"
) {
  console.log(`Copying files: ${parentDirectory} -> ${targetDirectory}`);
  await $`cp -r ${join(parentDirectory, "*")} ${targetDirectory}`;
}
