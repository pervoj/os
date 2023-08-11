NAME="nerdfonts-firacode"
VERSION="3.0.2"

BUILD_DEPENDENCIES=(
  "wget"
  "unzip"
)

prepare() {
  log "Downloading $NAME.zip."
  wget \
    -O $NAME.zip \
    https://github.com/ryanoasis/nerd-fonts/releases/download/v$VERSION/FiraCode.zip
}

build() {
  log "Unzipping $NAME.zip."
  unzip $NAME.zip -d $NAME
}

install() {
  log "Installing $NAME directory."
  mkdir -p $OUTPUT_DIR$PREFIX/share/fonts
  mv $NAME $OUTPUT_DIR$PREFIX/share/fonts
}
