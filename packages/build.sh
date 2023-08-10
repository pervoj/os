#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

SCRIPT_PATH=$(realpath "$0")
PACKAGES_DIR=$(dirname "$SCRIPT_PATH")
SCRIPTS_DIR=$PACKAGES_DIR/scripts
RECIPES_DIR=$PACKAGES_DIR/recipes

find $SCRIPTS_DIR -type f -name "*.sh" -exec chmod +x {} \;

WORK_DIR=$PWD/build
OUTPUT_DIR=$PWD/output

rm -rf $OUTPUT_DIR
mkdir -p $OUTPUT_DIR

find $RECIPES_DIR -type f -name "*.sh" -exec $SCRIPTS_DIR/build-package.sh {} \;

for PACKAGE_OUTPUT in $WORK_DIR/*/output; do
  mv $PACKAGE_OUTPUT/* $OUTPUT_DIR
done
