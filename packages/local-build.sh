#!/usr/bin/env bash

# Setup path variables.
SCRIPT_PATH=$(realpath "$0")
PACKAGES_DIR=$(dirname "$SCRIPT_PATH")

# If specified, build a specific package. Otherwise build all packages.
EXEC="./build.sh"
if [[ -v 1 ]]; then
  EXEC="./scripts/build-package.sh recipes/$1"
fi

# Run the build in a Podman container.
podman run --rm --privileged \
  -e PREFIX \
  -v $PACKAGES_DIR:/tmp/packages \
  -w /tmp/packages \
  registry.fedoraproject.org/fedora:latest \
  $EXEC
