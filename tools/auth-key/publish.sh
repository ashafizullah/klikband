#!/bin/sh
# Builds KlikBand-AuthKey-Windows.zip and KlikBand-AuthKey-Mac.zip and uploads
# them to the fixed "auth-key" GitHub release, so the download links (and the
# video's QR code) stay the same. That release is never marked latest.
#
# usage: tools/auth-key/publish.sh [--build-only]
set -e
cd "$(dirname "$0")"
REPO=ashafizullah/klikband
TAG=auth-key
NAME="KlikBand Auth Key"
WIN=KlikBand-AuthKey-Windows.zip
MAC=KlikBand-AuthKey-Mac.zip

rm -rf dist && mkdir -p "dist/win/$NAME" "dist/mac/$NAME"
cp "$NAME.bat" auth_key.py "dist/win/$NAME/"
cp "$NAME.command" auth_key.py "dist/mac/$NAME/"
# Windows Notepad wants CRLF line endings
for d in win mac; do awk '{ printf "%s\r\n", $0 }' BACA-SAYA.txt > "dist/$d/$NAME/BACA-SAYA.txt"; done
chmod +x "dist/mac/$NAME/$NAME.command"
(cd dist/win && zip -qrX "../$WIN" "$NAME")
(cd dist/mac && zip -qrX "../$MAC" "$NAME")
rm -rf dist/win dist/mac
ls -l dist
[ "$1" = --build-only ] && exit 0

NOTES=$(mktemp)
cat > "$NOTES" <<NOTES_END
**KlikBand Auth Key** shows the auth key of the bands on your Xiaomi account, for connecting a band to AstroBox or Gadgetbridge. Windows and Mac.

- **Windows:** download \`$WIN\`, Extract All, double-click \`$NAME.bat\`.
- **Mac:** download \`$MAC\`, open it, double-click \`$NAME.command\` (if blocked: System Settings › Privacy & Security › Open Anyway).

Then type 1, log in with the Xiaomi account used in Mi Fitness, and copy the auth key. Read-only; the password goes only to Xiaomi and is never saved. Unofficial, not affiliated with Xiaomi or AstroBox.

**Bahasa Indonesia:** unduh zip untuk Windows atau Mac, buka \`$NAME\`, ketik 1, login akun Xiaomi, lalu salin auth key ke AstroBox.

Guide / panduan: https://github.com/$REPO/tree/main/tools/auth-key#readme
NOTES_END

if gh release view "$TAG" -R "$REPO" >/dev/null 2>&1; then
  gh release upload "$TAG" -R "$REPO" --clobber "dist/$WIN" "dist/$MAC"
  gh release edit "$TAG" -R "$REPO" --notes-file "$NOTES" --latest=false
else
  gh release create "$TAG" -R "$REPO" --target main --title "$NAME (Windows & Mac)" \
    --notes-file "$NOTES" --latest=false "dist/$WIN" "dist/$MAC"
fi
rm -f "$NOTES"

for f in "$WIN" "$MAC"; do
  url="https://github.com/$REPO/releases/download/$TAG/$f"
  echo "$(curl -sIL -o /dev/null -w '%{http_code}' "$url") $url"
done
echo "https://github.com/$REPO/releases/tag/$TAG"
