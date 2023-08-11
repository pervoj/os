NAME="prompt"
VERSION="1.0.0"

COMMIT=ecd76d34978e21d77d6627cf0038d588efaf7c04

BUILD_DEPENDENCIES=(
  "wget"
)

prepare() {
  log "Downloading $NAME.sh."
  wget \
    -O $NAME.sh \
    https://gitlab.com/pervoj/dotfiles/raw/$COMMIT/.bashrc.d/prompt.sh
}

build() {
  log "Creating /etc/profile.d/$NAME.sh file."
  echo "source $PREFIX/share/$NAME/$NAME.sh" > profile.sh
}

install() {
  log "Installing $NAME.sh file."
  mkdir -p $OUTPUT_DIR$PREFIX/share/$NAME
  mv $NAME.sh $OUTPUT_DIR$PREFIX/share/$NAME

  log "Installing /etc/profile.d/$NAME.sh file."
  mkdir -p $OUTPUT_DIR$PREFIX/etc/profile.d
  mkdir -p $OUTPUT_DIR/etc/profile.d
  cp profile.sh $OUTPUT_DIR$PREFIX/etc/profile.d/$NAME.sh
  cp profile.sh $OUTPUT_DIR/etc/profile.d/$NAME.sh
}
