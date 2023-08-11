NAME="profiled"
VERSION="1.0.0"

install() {
  log "Generating file in /etc/profile.d/."
  mkdir -p $OUTPUT_DIR$PREFIX/etc/profile.d

  FILE=$OUTPUT_DIR$PREFIX/etc/profile.d/z_last.sh

  # ble
  echo "source $PREFIX/share/ble/ble.sh" >> $FILE

  # prompt
  echo "source $PREFIX/share/prompt/prompt.sh" >> $FILE

  # nvm
  echo "source $PREFIX/share/nvm/nvm.sh" >> $FILE
  echo "source $PREFIX/share/nvm/bash_completion" >> $FILE
}
