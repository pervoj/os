NAME="nvm"
VERSION="0.39.4"

BUILD_DEPENDENCIES=(
  "git"
)

prepare() {
  git_clone_tag https://github.com/nvm-sh/nvm.git v$VERSION
}

install() {
  log "Installing $NAME source files."
  mkdir -p $OUTPUT_DIR$PREFIX/share
  mv repo $OUTPUT_DIR$PREFIX/share/$NAME
}
