import { createProfileScript } from "./create-profile-script";

type PathEntry = string | [string, string];

export async function addToPath(
  profileScriptName: string,
  ...paths: [PathEntry, ...PathEntry[]]
) {
  const script = getAddToPathSnippet(...paths);
  await createProfileScript(profileScriptName, script);
}

export function getAddToPathSnippet(...paths: [PathEntry, ...PathEntry[]]) {
  return paths
    .map((entry) => {
      if (Array.isArray(entry)) {
        const [variable, path] = entry;
        const variableSnippet = `export ${variable}=${JSON.stringify(path)}`;
        const snippet = getAddToPathSnippetForSinglePath(`\$${variable}`);
        return `${variableSnippet}\n${snippet}`;
      }

      return getAddToPathSnippetForSinglePath(entry);
    })
    .join("\n\n");
}

export function getAddToPathSnippetForSinglePath(path: string) {
  return `
case ":$PATH:" in
  *":${path}:"*) ;;
  *) export PATH="$PATH:${path}" ;;
esac
  `;
}
