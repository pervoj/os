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

  LANG_FILE="$PREFIX/etc/profile.d/lang.sh"
  echo -e "if [[ -z \"\$LANG\" ]]; then\n  source $LANG_FILE\nfi\n" > $NAME.sh

  echo -e "source $PREFIX/share/$NAME/ble.sh\n" >> $NAME.sh

  PROMPT_FILE="$PREFIX/etc/profile.d/prompt.sh"
  echo -e "if [[ -f \"$PROMPT_FILE\" ]]; then\n  source $PROMPT_FILE\nfi" >> $NAME.sh
}

install() {
  log "Installing $NAME source files."
  mkdir -p $OUTPUT_DIR$PREFIX/share
  mv repo/out $OUTPUT_DIR$PREFIX/share/$NAME

  log "Installing /etc/profile.d/$NAME.sh file."
  mkdir -p $OUTPUT_DIR$PREFIX/etc/profile.d
  mv $NAME.sh $OUTPUT_DIR$PREFIX/etc/profile.d
}
