#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

readonly WORK_DIR=${WORK_DIR:-"$PWD/build"}
readonly RECIPE=${1:?"You need to specify the package recipe!"}

readonly PREFIX=${PREFIX:-"/usr"}

RECIPE_NAME=$(basename $RECIPE)
readonly RECIPE_NAME=${RECIPE_NAME%.*}

run_function_if_exists() {
  FUNCTION_NAME=${1:?"You need to specify the name of the function!"}
  if [[ "$(type -t $FUNCTION_NAME)" == "function" ]]; then
    $FUNCTION_NAME
  fi
}

readonly PKG_WORK_DIR=$WORK_DIR/$RECIPE_NAME
readonly BUILD_DIR=$PKG_WORK_DIR/build
readonly OUTPUT_DIR=$PKG_WORK_DIR/output

rm -rf $PKG_WORK_DIR

mkdir -p $BUILD_DIR
mkdir -p $OUTPUT_DIR

_CURRENT_PWD=$PWD

source $RECIPE

if [[ -n "${BUILD_DEPENDENCIES[@]}" ]]; then
  dnf install -y "${BUILD_DEPENDENCIES[@]}"
fi

run_function_if_exists "prepare"
run_function_if_exists "build"
run_function_if_exists "install"

cd $_CURRENT_PWD
