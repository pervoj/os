import { Glob } from "bun";
import { dirname, join } from "path";

const file = "variant.ts";
const glob = new Glob(`*/${file}`);
const path = join(dirname(__dirname), "variants");

const files = await Array.fromAsync(glob.scan({ onlyFiles: true, cwd: path }));
const variants = files.map((f) => f.replace(`/${file}`, ""));
const filtered = variants.filter((v) => !v.startsWith("_"));

console.log(JSON.stringify(filtered));
