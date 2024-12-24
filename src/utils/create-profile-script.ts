import { $ } from "bun";
import { writeFile } from "fs/promises";

export async function createProfileScript(scriptName: string, script: string) {
  await $`mkdir -p /usr/etc/profile.d`;
  await writeFile(`/usr/etc/profile.d/${scriptName}.sh`, script, "utf-8");
}
