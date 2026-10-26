#!/bin/sh
# Builds the plugin and packs dist/KlikBand.abp for AstroBox (a zip of the
# manifest, icon and wasm).
set -e
cd "$(dirname "$0")"
cargo build --release
rm -rf dist
mkdir dist
cp manifest.json icon.png target/wasm32-wasip2/release/klikband_astrobox.wasm dist/
(cd dist && zip -q -X KlikBand.abp manifest.json icon.png klikband_astrobox.wasm)
echo "built plugin/dist/KlikBand.abp"
