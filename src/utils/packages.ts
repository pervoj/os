import { $ } from "bun";

export async function installPackages(...packages: string[]) {
  await $`rpm-ostree install ${packages}`;
}

export async function uninstallPackages(...packages: string[]) {
  await $`rpm-ostree uninstall ${packages}`;
}
