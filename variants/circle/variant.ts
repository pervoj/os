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
    fedoraVersion,
    addRepositoryFromString,
    addRepositoryFromUrl,
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

      // VS Code
      "code",

      // Firefox PWA
      "firefoxpwa"
    );
  }
);
