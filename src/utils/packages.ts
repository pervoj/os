import { $ } from "bun";

export async function installPackages(...packages: string[]) {
  if (!packages.length) return;
  console.log("Installing packages:", ...packages);
  await $`rpm-ostree install ${packages}`;
}

export async function uninstallPackages(...packages: string[]) {
  if (!packages.length) return;
  console.log("Uninstalling packages:", ...packages);
  await $`rpm-ostree uninstall ${packages}`;
}
