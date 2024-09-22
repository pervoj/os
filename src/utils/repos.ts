import { $ } from "bun";
import { join } from "node:path";
import { getTempDir } from "./temp";

export async function addRepository(url: `http${"s" | ""}://${string}.repo`) {
  const fileName = url.split("/").reverse().shift()!;
  const outputPath = join(getTempDir("repo", fileName), fileName);

  console.log("Adding repository:", fileName);

  await $`
    wget -qO ${outputPath} ${url}
    install -o 0 -g 0 -m644 ${outputPath} ${`/etc/yum.repos.d/${fileName}`}
  `;
}
