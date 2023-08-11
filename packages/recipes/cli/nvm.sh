NAME="nvm"
VERSION="0.39.4"

BUILD_DEPENDENCIES=(
  "git"
)

prepare() {
  git_clone_tag https://github.com/nvm-sh/nvm.git v$VERSION
}

build() {
  log "Creating /etc/profile.d/$NAME.sh file."
  echo "source $PREFIX/share/$NAME/nvm.sh" > $NAME.sh
  echo "source $PREFIX/share/$NAME/bash_completion" >> $NAME.sh
}

install() {
  log "Installing $NAME source files."
  mkdir -p $OUTPUT_DIR$PREFIX/share
  mv repo $OUTPUT_DIR$PREFIX/share/$NAME

  log "Installing /etc/profile.d/$NAME.sh file."
  mkdir -p $OUTPUT_DIR$PREFIX/etc/profile.d
  mv $NAME.sh $OUTPUT_DIR$PREFIX/etc/profile.d
}
