arch="x64"
pkg="bun-linux-$arch"
repo="oven-sh/bun"
bin="bun"

file="$pkg.zip"
url="https://github.com/$repo/releases/latest/download/$file"

file_path="$WORKING_DIR/$file"
bin_path="$WORKING_DIR/$pkg/$bin"
out_path="/usr/bin/$bin"

wget -qO "$file_path" "$url"
unzip -qod "$WORKING_DIR" "$file_path"
chmod +x "$bin_path"
mv "$bin_path" "$out_path"

BUN="$out_path"