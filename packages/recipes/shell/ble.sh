NAME="ble"
VERSION="0.3.4"

BUILD_DEPENDENCIES=(
  "git"
  "make"
)

prepare() {
  git_clone_tag https://github.com/akinomyoga/ble.sh.git v$VERSION
}

build() {
  log "Building $NAME."
  (cd repo && make)

  log "Creating /etc/profile.d/$NAME.sh file."
  echo "source $PREFIX/share/$NAME/ble.sh" > $NAME.sh
}

install() {
  log "Installing $NAME source files."
  mkdir -p $OUTPUT_DIR$PREFIX/share
  mv repo/out $OUTPUT_DIR$PREFIX/share/$NAME


  log "Installing /etc/profile.d/$NAME.sh file."
  mkdir -p $OUTPUT_DIR$PREFIX/etc/profile.d
  mv $NAME.sh $OUTPUT_DIR$PREFIX/etc/profile.d
}
