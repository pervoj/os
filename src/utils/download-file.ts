import { $ } from "bun";

export type UrlProtocol = `http${"s" | ""}://`;
export type Url = `${UrlProtocol}${string}`;

export async function downloadFile(url: string, outputPath: string) {
  return await $`wget -qO ${outputPath} ${url}`;
}
