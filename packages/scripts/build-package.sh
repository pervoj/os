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

# Initialize build directories.
rm -rf $PKG_WORK_DIR
mkdir -p $BUILD_DIR
mkdir -p $OUTPUT_DIR

# Setup functions.

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
  git clone $REPO_URL $DIR_NAME
  (cd $DIR_NAME && git checkout $TAG_NAME)
}

# Load the recipe.
source $RECIPE

# Install build dependencies.
if [[ -n "${BUILD_DEPENDENCIES[@]}" ]]; then
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
