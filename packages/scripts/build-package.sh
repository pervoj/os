#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

# Setup input variables.

readonly WORK_DIR=${WORK_DIR:-"$PWD/build"}
readonly RECIPE=${1:?"You need to specify the package recipe!"}

readonly PREFIX=${PREFIX:-"/usr"}

RECIPE_NAME=$(basename $RECIPE)
readonly RECIPE_NAME=${RECIPE_NAME%.*}

readonly PKG_WORK_DIR=$WORK_DIR/$RECIPE_NAME
readonly BUILD_DIR=$PKG_WORK_DIR/build
readonly OUTPUT_DIR=$PKG_WORK_DIR/output

# Setup functions.

echo_color() {
  COLOR_CODE=${1:?"You need to specify the color code!"}
  echo -en "\e[${1}m"
  shift
  echo -e "$@"
  echo -en "\e[0m"
}

info() {
  echo_color "1;34" $@
}

log() {
  echo_color "1;33" $@
}

run_function_if_exists() {
  FUNCTION_NAME=${1:?"You need to specify the name of the function!"}
  if [[ "$(type -t $FUNCTION_NAME)" == "function" ]]; then
    $FUNCTION_NAME
  fi
}

git_clone_tag() {
  REPO_URL=${1:?"You need to specify the repository URL!"}
  TAG_NAME=${2:?"You need to specify the tag name!"}
  DIR_NAME=${3:-"$BUILD_DIR/repo"}
  log "Cloning a Git repository."
  git clone $REPO_URL $DIR_NAME
  (cd $DIR_NAME && git checkout $TAG_NAME)
}

# Log build started.
info "\n--- BUILDING PACKAGE ($RECIPE_NAME) ---\n"

# Initialize build directories.
rm -rf $PKG_WORK_DIR
mkdir -p $BUILD_DIR
mkdir -p $OUTPUT_DIR

# Load the recipe.
source $RECIPE

# Install build dependencies.
if [[ -n "${BUILD_DEPENDENCIES[@]}" ]]; then
  log "Installing build dependencies."
  dnf install -y  --repo fedora --repo updates "${BUILD_DEPENDENCIES[@]}"
fi

# Move to the build directory.
_CURRENT_PWD=$PWD
cd $BUILD_DIR

# Run build functions.
run_function_if_exists "prepare"
run_function_if_exists "build"
run_function_if_exists "install"

# Move to previous PWD.
cd $_CURRENT_PWD

info "\n--- END BUILDING PACKAGE ($RECIPE_NAME) ---\n"
