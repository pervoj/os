#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

# Setup path variables.
SCRIPT_PATH=$(realpath "$0")
PACKAGES_DIR=$(dirname "$SCRIPT_PATH")
SCRIPTS_DIR=$PACKAGES_DIR/scripts
RECIPES_DIR=$PACKAGES_DIR/recipes

# Ensure scripts are executable.
find $SCRIPTS_DIR -type f -name "*.sh" -exec chmod +x {} \;

# Setup working directory paths.
WORK_DIR=${WORK_DIR:-"$PWD/build"}
OUTPUT_DIR=${OUTPUT_DIR:-"$PWD/output"}

# Initialize build directories.
rm -rf $OUTPUT_DIR
mkdir -p $OUTPUT_DIR

# Build all recipes.
find $RECIPES_DIR -type f -name "*.sh" -exec $SCRIPTS_DIR/build-package.sh {} \;

# Move their output into the shared output directory.
for PACKAGE_OUTPUT in $WORK_DIR/*/output; do
  mv $PACKAGE_OUTPUT/* $OUTPUT_DIR
done
