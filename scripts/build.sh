#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

SCRIPT_PATH=$(realpath "$0")
export SCRIPT_DIR=$(dirname "$SCRIPT_PATH")

find $SCRIPT_DIR -type f -name "*.sh" -exec chmod +x {} \;

# Install/remove rpm packages.
$SCRIPT_DIR/rpms.sh
