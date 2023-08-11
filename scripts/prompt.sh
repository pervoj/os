#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

echo  "\n" >> /usr/etc/bashrc
echo  "# Setup the prompt." >> /usr/etc/bashrc
echo  "source /usr/share/prompt/prompt.sh" >> /usr/etc/bashrc
