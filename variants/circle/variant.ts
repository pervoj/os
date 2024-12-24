import { $ } from "bun";
import { writeFile } from "fs/promises";
import { createVariant } from "~/utils/create-variant";

export default createVariant(
  {
    imageTitle: "Circle OS",
    imageDescription: "Personal OS image based on Fedora Silverblue",
    baseImageName: "silverblue",
    baseImageVersion: "41",
    baseDirectory: __dirname,
  },
  async ({
    addRepositoryFromString,
    addRepositoryFromUrl,
    addToPath,
    cloneGitRepo,
    createGschemaOverride,
    createProfileScript,
    downloadFile,
    fedoraVersion,
    installPackages,
    trimLines,
  }) => {
    await installPackages(
      `https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-${fedoraVersion}.noarch.rpm`,
      `https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-${fedoraVersion}.noarch.rpm`
    );

    await addRepositoryFromString(
      "firefoxpwa.repo",
      trimLines(`
        [firefoxpwa]
        name=FirefoxPWA
        metadata_expire=300
        baseurl=https://packagecloud.io/filips/FirefoxPWA/rpm_any/rpm_any/$basearch
        gpgkey=https://packagecloud.io/filips/FirefoxPWA/gpgkey
        repo_gpgcheck=1
        gpgcheck=0
        enabled=1
      `)
    );

    await addRepositoryFromUrl(
      "https://download.docker.com/linux/fedora/docker-ce.repo"
    );

    await addRepositoryFromUrl(
      "https://packages.microsoft.com/yumrepos/vscode/config.repo"
    );

    await installPackages(
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

    // install PNPM
    const pnpmPath = "/usr/share/pnpm";
    await $`mkdir -p pnpmPath`;
    await downloadFile(
      "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linux-x64",
      `${pnpmPath}/pnpm`
    );
    await writeFile(
      `${pnpmPath}/pnpx`,
      trimLines(`
        #!/bin/sh
        exec pnpm dlx "$@"
      `),
      "utf-8"
    );
    await $`chmod +x ${pnpmPath}/pnpx`;
    await addToPath("pnpm", ["PNPM_HOME", pnpmPath]);

    // install SBP
    const sbpPath = "/usr/share/sbp";
    await cloneGitRepo("https://github.com/brujoand/sbp.git", sbpPath);
    await createProfileScript("sbp", `source ${sbpPath}/sbp.bash`);

    await createGschemaOverride("gnome-desktop-overrides", {
      schema: "org.gnome.mutter",
      overrides: {
        "center-new-windows": "true",
      },
    });
  }
);
