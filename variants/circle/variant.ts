import { $ } from "bun";
import { readdir, writeFile } from "fs/promises";
import { join } from "path";
import { createVariant, type VariantCtx } from "~/utils/create-variant";

export default createVariant(
  {
    imageTitle: "Circle OS",
    imageDescription: "Personal OS image based on Fedora Silverblue",
    baseImageName: "silverblue",
    baseImageVersion: "41",
    baseDirectory: __dirname,
  },
  async (ctx) => {
    await ctx.installPackages(
      `https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-${ctx.fedoraVersion}.noarch.rpm`,
      `https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-${ctx.fedoraVersion}.noarch.rpm`
    );

    await ctx.addRepositoryFromString(
      "firefoxpwa.repo",
      `
        [firefoxpwa]
        name=FirefoxPWA
        metadata_expire=300
        baseurl=https://packagecloud.io/filips/FirefoxPWA/rpm_any/rpm_any/$basearch
        gpgkey=https://packagecloud.io/filips/FirefoxPWA/gpgkey
        repo_gpgcheck=1
        gpgcheck=0
        enabled=1
      `
    );

    await ctx.addRepositoryFromUrl(
      "https://download.docker.com/linux/fedora/docker-ce.repo"
    );

    await ctx.addRepositoryFromUrl(
      "https://packages.microsoft.com/yumrepos/vscode/config.repo"
    );

    await ctx.installPackages(
      // drivers
      "intel-media-driver",
      "mesa-vulkan-drivers",

      // codecs
      "gstreamer1-plugin-openh264",
      "gstreamer1-plugins-bad-free-extras",
      "gstreamer1-plugins-bad-free-fluidsynth",
      "gstreamer1-plugins-bad-free-wildmidi",
      "gstreamer1-plugins-bad-free-zbar",
      "gstreamer1-plugins-good-extras",
      "gstreamer1-plugins-good-gtk",
      "lame",

      // misc packages
      "langpacks-cs",
      "gnome-tweaks",
      "firewall-config",
      "nautilus-python",
      "steam-devices",
      "twitter-twemoji-fonts",

      // Docker
      "docker-ce",
      "docker-ce-cli",
      "containerd.io",
      "docker-buildx-plugin",
      "docker-compose-plugin",

      // Python
      "python3",
      "python3-pip",
      "python3-virtualenv",
      "python3-wheel",
      "python3-devel",

      // VS Code
      "code",

      // Firefox PWA
      "firefoxpwa"
    );

    // install Node
    await installNode(ctx);

    // install NPM
    await installNpm(ctx);

    // install PNPM
    await installPnpm(ctx);

    // install SBP
    await installPrompt(ctx);

    // overrides for GNOME
    await ctx.createGschemaOverride("gnome-desktop-overrides", {
      schema: "org.gnome.mutter",
      overrides: {
        "center-new-windows": "true",
      },
    });
  }
);

async function installNode(ctx: VariantCtx) {
  const nodePath = "/usr/share/node";

  type Res = { date: string; version: string }[];
  const res = await fetch("https://nodejs.org/dist/index.json");
  const data = (await res.json()) as Res;
  const latest = data.sort((a, b) => b.date.localeCompare(a.date)).shift()!;
  const version = latest.version;

  const url = `https://nodejs.org/dist/${version}/node-${version}-linux-x64.tar.xz`;
  const fileName = join(ctx.getTempDir("node", "archive"), "node.tar.xz");
  await ctx.downloadFile(url, fileName);

  const unzipPath = ctx.getTempDir("node", "contents");
  await $`tar -xJf ${fileName} -C ${unzipPath}`;
  await $`mv ${unzipPath} ${nodePath}`;

  const binFiles = (await readdir(join(nodePath, "bin")))
    .filter((f) => f != "node")
    .map((f) => join(nodePath, "bin", f));

  await $`rm ${binFiles}`;
  await $`rm -r ${join(nodePath, "lib")}`;

  await ctx.createProfileScript(
    "node-home",
    `export NODEJS_HOME="${nodePath}"`
  );
  await ctx.addToPath("node-bin", "$NODEJS_HOME/bin");
}

async function installNpm(ctx: VariantCtx) {
  const npmPath = "/usr/share/npm";

  type Res = { version: string; dist: { tarball: string } };
  const res = await fetch("https://registry.npmjs.org/npm/latest");
  const data = (await res.json()) as Res;
  const url = data.dist.tarball;

  const fileName = join(ctx.getTempDir("npm", "archive"), "npm.tgz");
  await ctx.downloadFile(url, fileName);

  const unzipPath = ctx.getTempDir("npm", "contents");
  await $`tar -xzf ${fileName} -C ${unzipPath}`;
  await $`mv ${unzipPath}/package ${npmPath}`;

  await ctx.addToPath("npm", join(npmPath, "bin"), [
    "NPM_HOME",
    "$HOME/.npm-pkg",
  ]);

  await writeFile("/etc/npmrc", "prefix=${NPM_HOME}", "utf-8");
}

async function installPnpm(ctx: VariantCtx) {
  const pnpmPath = "/usr/share/pnpm";
  await $`mkdir -p pnpmPath`;

  await ctx.downloadFile(
    "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linux-x64",
    `${pnpmPath}/pnpm`
  );

  await writeFile(
    `${pnpmPath}/pnpx`,
    ctx.trimLines(`
        #!/bin/sh
        exec pnpm dlx "$@"
      `),
    "utf-8"
  );

  await $`chmod +x ${pnpmPath}/pnpm`;
  await $`chmod +x ${pnpmPath}/pnpx`;

  await ctx.addToPath("pnpm-bin", pnpmPath);
  await ctx.createProfileScript("pnpm-home", 'export PNPM_HOME="$HOME/.pnpm"');
}

async function installPrompt(ctx: VariantCtx) {
  const sbpPath = "/usr/share/sbp";
  await ctx.cloneGitRepo("https://github.com/brujoand/sbp.git", sbpPath);
  await ctx.createProfileScript(
    "sbp",
    `
      export SBP_PATH=${sbpPath}
      source \$SBP_PATH/sbp.bash
    `
  );
}
