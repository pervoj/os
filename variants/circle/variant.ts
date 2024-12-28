import { join } from "path";
import { createVariant } from "~/utils/create-variant";
import { installNode } from "./scripts/node";
import { installPnpm } from "./scripts/pnpm";
import { installPrompt } from "./scripts/prompt";

export default createVariant(
  {
    imageTitle: "Circle OS",
    imageDescription: "Personal OS image based on Fedora Silverblue",
    baseImageName: "silverblue",
    baseImageVersion: "41",
    baseDirectory: __dirname,
  },
  async (ctx) => {
    await ctx.copyFiles(join(ctx.baseDirectory, "files"));

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

    const rpms = await ctx.listFiles(
      join(ctx.baseDirectory, "packages"),
      (file) => file.endsWith(".rpm")
    );

    const packages = [
      // embeded
      ...rpms,

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
      "firefoxpwa",
    ];

    await ctx.installPackages(...packages);

    // install Node
    await installNode(ctx);

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
