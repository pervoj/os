#!/usr/bin/env bash

# Tell build process to exit if there are any errors.
set -oue pipefail

get_yaml_array() {
  mapfile -t "$1" < <(yq -- "$2" $SCRIPT_DIR/rpms.yml)
}

get_yaml_array install_rpms ".install[]"
if [[ ${#install_rpms[@]} -gt 0 ]]; then
  echo "Installing: ${install_rpms[@]}"
  rpm-ostree install "${install_rpms[@]}"
fi

get_yaml_array remove_rpms ".remove[]"
if [[ ${#remove_rpms[@]} -gt 0 ]]; then
  echo "Removing: ${remove_rpms[@]}"
  rpm-ostree override remove "${remove_rpms[@]}"
fi
