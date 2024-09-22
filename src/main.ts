import { $ } from "bun";
import { installPackages } from "./utils/packages";
import { addRepository } from "./utils/repos";

console.log("Enable RPM Fusion");
await $`
  rpm-ostree install \
    https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm \
    https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
`;

console.log("Install codecs");
await installPackages(
  "gstreamer1-plugin-openh264",
  "gstreamer1-plugins-bad-free-extras",
  "gstreamer1-plugins-bad-free-fluidsynth",
  "gstreamer1-plugins-bad-free-wildmidi",
  "gstreamer1-plugins-bad-free-zbar",
  "gstreamer1-plugins-good-extras",
  "gstreamer1-plugins-good-gtk",
  "lame"
);

console.log("Install misc packages");
await installPackages(
  "langpacks-cs",
  "gnome-tweaks",
  "firewall-config",
  "nautilus-python",
  "steam-devices",
  "twitter-twemoji-fonts"
);

console.log("Install Docker");
await addRepository("https://download.docker.com/linux/fedora/docker-ce.repo");
await installPackages(
  "docker-ce",
  "docker-ce-cli",
  "containerd.io",
  "docker-buildx-plugin",
  "docker-compose-plugin"
);

console.log("Install VS Code");
await addRepository(
  "https://packages.microsoft.com/yumrepos/vscode/config.repo"
);
await installPackages("code");
