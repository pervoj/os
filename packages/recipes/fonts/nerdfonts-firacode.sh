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
  log "Installing $NAME fonts."
  mkdir -p $OUTPUT_DIR$PREFIX/share/fonts
  cp $NAME/*.ttf $OUTPUT_DIR$PREFIX/share/fonts
}
