import { $ } from "bun";
import { installPackages, uninstallPackages } from "./packages";
import {
  addRepositoryFromFile,
  addRepositoryFromString,
  addRepositoryFromUrl,
} from "./repos";
import { getTempDir } from "./temp";
import { trimLines } from "./trim-lines";

export async function getVariantInput(baseDirectory: string) {
  const fedoraVersion = (await $`rpm -E %fedora`.text()).trim();

  return {
    baseDirectory,
    fedoraVersion,
    getTempDir,
    addRepositoryFromFile,
    addRepositoryFromString,
    addRepositoryFromUrl,
    installPackages,
    uninstallPackages,
    trimLines,
  };
}
