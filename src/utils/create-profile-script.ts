import { writeFile } from "fs/promises";
import { trimLines } from "./trim-lines";

export async function createProfileScript(scriptName: string, script: string) {
  console.log(`Creating profile script: ${scriptName}`);
  await writeFile(
    `/etc/profile.d/${scriptName}.sh`,
    trimLines(script),
    "utf-8"
  );
}
