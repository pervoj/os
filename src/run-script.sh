#!/bin/bash
set -ouex pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" > /dev/null 2>&1; pwd -P)"
PACKAGE_DIR="$(dirname $SCRIPT_DIR)"

(cd "$SCRIPT_DIR"; bun install; bun "$SCRIPT_DIR/start-script.ts" "$VARIANT_NAME")
