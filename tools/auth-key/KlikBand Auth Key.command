#!/bin/sh
# Double-click in Finder to run KlikBand Auth Key. Uses Python 3.9+ when the Mac
# has it, otherwise downloads a private copy once (python-build-standalone,
# about 25 MB) into ~/Library/Application Support/KlikBand/python.
cd "$(dirname "$0")" || exit 1
HERE=$(pwd)
DIR="$HOME/Library/Application Support/KlikBand/python"
PBS=20261003
VERSION=3.12.15

usable() { "$1" -c 'import sys; sys.exit(sys.version_info < (3, 9))' >/dev/null 2>&1; }

PY=
for candidate in "$DIR/bin/python3" /opt/homebrew/bin/python3 /usr/local/bin/python3 \
    /Library/Frameworks/Python.framework/Versions/Current/bin/python3; do
  if [ -x "$candidate" ] && usable "$candidate"; then PY=$candidate; break; fi
done
# Without the developer tools /usr/bin/python3 only offers to install them
if [ -z "$PY" ] && xcode-select -p >/dev/null 2>&1 && usable /usr/bin/python3; then PY=/usr/bin/python3; fi

if [ -z "$PY" ]; then
  echo "Menyiapkan Python (sekali saja, sekitar 25 MB)..."
  case $(uname -m) in arm64) ARCH=aarch64 ;; *) ARCH=x86_64 ;; esac
  URL="https://github.com/astral-sh/python-build-standalone/releases/download/$PBS/cpython-$VERSION%2B$PBS-$ARCH-apple-darwin-install_only.tar.gz"
  rm -rf "$DIR" && mkdir -p "$DIR" &&
    curl -fL --progress-bar "$URL" | tar -xz -C "$DIR" --strip-components 1
  if usable "$DIR/bin/python3"; then
    PY="$DIR/bin/python3"
    echo
  else
    rm -rf "$DIR"
    echo "Gagal menyiapkan Python. Periksa koneksi internet, lalu coba lagi."
  fi
fi

[ -n "$PY" ] && "$PY" -I "$HERE/auth_key.py"
echo
printf "Tekan Enter untuk menutup..."
read -r _
