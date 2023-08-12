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
  cat > profile.sh << EOL
if [[ ! -f "\$HOME/.prompt-configured" ]]; then
  mkdir -p "\$HOME/.bashrc.d"
  echo "source $PREFIX/share/$NAME/$NAME.sh" > "\$HOME/.bashrc.d/prompt.sh"
  touch "\$HOME/.prompt-configured"
fi
EOL
}

install() {
  log "Installing $NAME.sh file."
  mkdir -p $OUTPUT_DIR$PREFIX/share/$NAME
  mv $NAME.sh $OUTPUT_DIR$PREFIX/share/$NAME

  log "Installing /etc/profile.d/$NAME.sh file."
  mkdir -p $OUTPUT_DIR$PREFIX/etc/profile.d
  mv profile.sh $OUTPUT_DIR$PREFIX/etc/profile.d
}
