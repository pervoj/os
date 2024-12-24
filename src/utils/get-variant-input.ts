import { $ } from "bun";
import {
  addToPath,
  getAddToPathSnippet,
  getAddToPathSnippetForSinglePath,
} from "./add-to-path";
import { cloneGitRepo } from "./clone-git-repo";
import { createGschemaOverride } from "./create-gschema-override";
import { createProfileScript } from "./create-profile-script";
import { downloadFile } from "./download-file";
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
    addRepositoryFromFile,
    addRepositoryFromString,
    addRepositoryFromUrl,
    addToPath,
    baseDirectory,
    cloneGitRepo,
    createGschemaOverride,
    createProfileScript,
    downloadFile,
    fedoraVersion,
    getAddToPathSnippet,
    getAddToPathSnippetForSinglePath,
    getTempDir,
    installPackages,
    trimLines,
    uninstallPackages,
  };
}
