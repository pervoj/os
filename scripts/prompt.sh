#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

echo -e "\n" >> /usr/etc/bashrc
echo -e "# Setup the prompt." >> /usr/etc/bashrc
echo -e "source /usr/share/prompt/prompt.sh" >> /usr/etc/bashrc
