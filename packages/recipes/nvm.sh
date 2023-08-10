NAME="nvm"
VERSION="0.39.4"

BUILD_DEPENDENCIES=(
  "git"
)

prepare() {
  git clone https://github.com/nvm-sh/nvm.git $BUILD_DIR/repo
  cd $BUILD_DIR/repo
  git checkout v$VERSION
  cd ..
}

build() {
  echo "source $PREFIX/share/$NAME/nvm.sh" > $BUILD_DIR/$NAME.sh
  echo "source $PREFIX/share/$NAME/bash_completion" >> $BUILD_DIR/$NAME.sh
}

install() {
  mkdir -p $OUTPUT_DIR$PREFIX/share
  mv $BUILD_DIR/repo $OUTPUT_DIR$PREFIX/share/$NAME

  mkdir -p $OUTPUT_DIR$PREFIX/etc/profile.d
  mv $BUILD_DIR/$NAME.sh $OUTPUT_DIR$PREFIX/etc/profile.d
}
