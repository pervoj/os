#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

# Setup path variables.
SCRIPT_PATH=$(realpath "$0")
PACKAGES_DIR=$(dirname "$SCRIPT_PATH")

# If specified, build a specific package. Otherwise build all packages.
EXEC="./build.sh"
if [[ -n "$1" ]]; then
  EXEC="./scripts/build-package.sh recipes/$1"
fi

# Setup working directory paths.
WORK_DIR=${WORK_DIR:-"$PWD/build"}
OUTPUT_DIR=${OUTPUT_DIR:-"$PWD/output"}

# Run the build in a Podman container.
podman run --rm --privileged \
  -e WORK_DIR \
  -e OUTPUT_DIR \
  -v $PACKAGES_DIR:/tmp/packages \
  -w /tmp/packages \
  registry.fedoraproject.org/fedora:latest \
  $EXEC
