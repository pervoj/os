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
  cat > $NAME.sh << EOL
if [[ ! -f "\$HOME/.bashrc.d/$NAME.sh" ]]; then
  mkdir -p "\$HOME/.bashrc.d"
  echo "source $PREFIX/share/$NAME/ble.sh" > "\$HOME/.bashrc.d/$NAME.sh"
fi
EOL
}

install() {
  log "Installing $NAME source files."
  mkdir -p $OUTPUT_DIR$PREFIX/share
  mv repo/out $OUTPUT_DIR$PREFIX/share/$NAME

  log "Installing /etc/profile.d/$NAME.sh file."
  mkdir -p $OUTPUT_DIR$PREFIX/etc/profile.d
  mv $NAME.sh $OUTPUT_DIR$PREFIX/etc/profile.d
}
