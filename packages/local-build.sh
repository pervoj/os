#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

SCRIPT_PATH=$(realpath "$0")
PACKAGES_DIR=$(dirname "$SCRIPT_PATH")

podman run --rm --privileged \
  -v $PACKAGES_DIR:/tmp/packages \
  -w /tmp/packages \
  registry.fedoraproject.org/fedora:latest \
  ./build.sh
