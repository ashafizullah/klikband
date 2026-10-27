# KlikBand

Quick app Xiaomi Vela (Smart Band 9 dan perangkat lain) plus plugin AstroBox di `plugin/`. Pengelola berbahasa Indonesia; kode, komentar, commit dan catatan rilis dalam bahasa Inggris.

## "Rilis"

Kalau pengelola bilang "rilis" (atau "rilis x.y.z"), itu berarti rilis lengkap menurut [docs/RELEASING.md](docs/RELEASING.md), bukan hanya build rpk:

1. Catatan rilis di `release-notes/x.y.z.md` (di-gitignore). Kalau belum ada, tulis dulu dalam bahasa Inggris dengan format rilis sebelumnya, dan tunjukkan ke pengelola.
2. Jalankan `tools/release.sh x.y.z`, dengan `--plugin a.b.c` kalau ada perubahan di `plugin/` sejak rilis terakhir (cek `git log vX.Y.Z..HEAD -- plugin/`). Script ini sekaligus:
   - membuat GitHub Release (rpk release bertanda tangan, dan `.abp`);
   - memperbarui repo rilis AstroBox (`../astrobox-resource-klikband`);
   - memperbarui pengajuan di toko AstroBox (memperbarui PR edit yang masih terbuka, atau membuat PR edit baru).
3. Script bertanya `[y/N]` di setiap langkah yang menerbitkan sesuatu. Kalau pengelola sudah bilang "rilis", jawab `y` untuk semuanya (misalnya `yes y | tools/release.sh x.y.z`).
4. Laporkan link GitHub Release dan PR toko AstroBox.

Kunci tanda tangan ada di `sign/release/` (tidak masuk git, cadangannya di Keychain macOS). Tanpa kunci itu, jangan merilis.
