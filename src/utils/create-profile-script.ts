import { writeFile } from "fs/promises";

export async function createProfileScript(scriptName: string, script: string) {
  await writeFile(`/etc/profile.d/${scriptName}.sh`, script, "utf-8");
}
