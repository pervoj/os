#!/bin/bash
set -ouex pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" > /dev/null 2>&1; pwd -P)"
WORKING_DIR="$SCRIPT_DIR/.temp"

if [[ -e "$WORKING_DIR" ]]; then
  rm -rf "$WORKING_DIR"
fi

mkdir "$WORKING_DIR"

. "$SCRIPT_DIR/bun.sh"
. "$SCRIPT_DIR/script.sh"