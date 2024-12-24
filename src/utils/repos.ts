import { $ } from "bun";
import { writeFile } from "fs/promises";
import { join } from "node:path";
import { downloadFile, type Url } from "./download-file";
import { getTempDir } from "./temp";

export async function addRepositoryFromUrl(url: `${Url}.repo`) {
  const fileName = url.split("/").reverse().shift()!;
  const outputPath = join(getTempDir("repo", fileName), fileName);

  console.log("Downloading repository:", fileName);
  await downloadFile(url, outputPath);
  await addRepositoryFromFile(fileName, outputPath);
}

export async function addRepositoryFromString(
  fileName: string,
  content: string
) {
  const outputPath = join(getTempDir("repo", fileName), fileName);

  console.log("Writing repository:", fileName);
  await writeFile(outputPath, content, { encoding: "utf8" });
  await addRepositoryFromFile(fileName, outputPath);
}

export async function addRepositoryFromFile(
  fileName: string,
  filePath: string
) {
  console.log("Installing repository:", fileName);
  await $`mkdir -p /usr/etc/yum.repos.d`;
  await $`install -o 0 -g 0 -m644 ${filePath} ${`/usr/etc/yum.repos.d/${fileName}`}`;
}
