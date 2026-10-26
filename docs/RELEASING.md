# Merilis KlikBand

Catatan untuk pengelola. Satu rilis memperbarui tiga tempat:

1. **GitHub Release** di repo ini: `KlikBand-x.y.z.rpk`, dan `KlikBand.abp` kalau plugin berubah.
2. **Toko aplikasi AstroBox**: repo rilis [`ashafizullah/astrobox-resource-com.ashafizullah.klikband`](https://github.com/ashafizullah/astrobox-resource-com.ashafizullah.klikband) dan pengajuan ke [`AstralSightStudios/AstroBox-Repo`](https://github.com/AstralSightStudios/AstroBox-Repo).
3. **Toko plugin AstroBox**, kalau plugin berubah: cukup folder `plugin/` di repo rilis yang sama.

## Cara cepat

Tulis catatan rilis (bahasa Inggris, seperti rilis sebelumnya) ke sebuah file, lalu:

```
tools/release.sh 1.26.0 --notes /tmp/notes.md
tools/release.sh 1.26.0 --notes /tmp/notes.md --plugin 1.1.0   # kalau plugin ikut berubah
```

Skrip ini berjalan di macOS (`sed -i ''`) dan butuh `git`, `gh` (sudah login), Node.js, Python 3, kunci tanda tangan di `sign/release/` (lihat di bawah), serta untuk plugin `cargo` dengan target `wasm32-wasip2`. Repo rilis AstroBox diharapkan ada di `../astrobox-resource-klikband`; kalau di tempat lain, set `RESOURCE_DIR`.

Skrip selalu bertanya dulu sebelum setiap langkah yang menerbitkan sesuatu. Urutannya:

1. Menaikkan `versionName` dan `versionCode` (+1) di `src/manifest.json` (dan versi plugin dengan `--plugin`), lalu lint, build release (`npx aiot release`, ditandatangani kunci KlikBand), dan commit "Release x.y.z".
2. Push `main` dan membuat GitHub Release `vx.y.z` dengan rpk (dan `.abp`).
3. Di repo rilis AstroBox: mengganti rpk, memperbarui `version`, `file_name` dan `versionCode` di `manifest_v2.json` (`versionCode` dipakai AstroBox untuk menawarkan update ke pengguna), menyalin plugin ke `plugin/`, commit, lalu push.
4. Di toko AstroBox:
   - Kalau KlikBand **belum** tercantum di `index_v2.csv` (pengajuan pertama, PR [#1688](https://github.com/AstralSightStudios/AstroBox-Repo/pull/1688), masih terbuka), hash commit di branch `add-klikband` fork diperbarui.
   - Kalau **sudah** tercantum, dibuat PR edit baru (`tmp/ashafizullah/astrobox-resource-com.ashafizullah.klikband/resource.csv` dan `request.json` bermode `edit`).

## Kunci tanda tangan

Mulai 1.25.2 semua rilis adalah **build release** yang ditandatangani kunci KlikBand sendiri: `sign/release/private.pem` dan `sign/release/certificate.pem` (folder `sign/` tidak masuk git). AstroBox menolak paket yang ditandatangani sertifikat debug bawaan toolkit.

- **Cadangkan kedua file itu** di tempat aman (misalnya password manager). Kalau hilang, rilis berikutnya ditandatangani kunci lain, dan pengguna mungkin harus uninstall dulu.
- Jangan pernah membagikan atau meng-commit `private.pem`.
- Kunci dibuat dengan: `openssl req -newkey rsa:2048 -nodes -keyout sign/release/private.pem -x509 -days 36500 -subj "/CN=KlikBand/O=Adam Suchi Hafizullah/C=ID" -out sign/release/certificate.pem`. Membuat ulang berarti kunci baru, jadi lakukan hanya kalau memang hilang.
- Pindah dari debug ke release: di emulator Band 10 (firmware 3.1.28) paket release menimpa versi debug dan pengaturan tetap tersimpan.

## Hal yang perlu diingat

- **`versionCode` harus selalu naik.** Band diam-diam melewati pemasangan dengan versionCode yang sama atau lebih rendah, termasuk build uji. Kalau sudah memasang build uji di band, pastikan rilisnya di atas angka itu.
- **Plugin dan aplikasi saling bergantung.** Plugin menolak KlikBand yang lebih lama dari `MIN_VERSION_CODE` di `plugin/src/band.rs` (sekarang 56 = 1.25.0). Kalau cara KlikBand menjawab plugin berubah (`src/common/phone.js`), naikkan angka ini dan rilis keduanya bersamaan.
- **Toko plugin membaca sendiri.** [`AstroBox-NG-Plugin-Repo`](https://github.com/AstralSightStudios/AstroBox-NG-Plugin-Repo) membaca `index.txt` dan `plugin/manifest.json` dari repo rilis setiap 4 jam (setelah PR [#31](https://github.com/AstralSightStudios/AstroBox-NG-Plugin-Repo/pull/31) di-merge). Untuk update plugin tidak perlu PR lagi.
- **Band 10** sengaja belum didaftarkan di toko AstroBox, karena ada laporan crash yang belum terjawab. Untuk menambahkannya, tambahkan `xmb10` dan `xmb10nfc` di `downloads` di `manifest_v2.json` dan di kolom `devices` pengajuan.
- **Push ke repo rilis AstroBox kadang dijawab GitHub dengan HTTP 500.** Skrip otomatis mengulang dengan HTTP/1.1; kalau manual, pakai `git -c http.version=HTTP/1.1 push`.
- **Untuk uji di band**, `npm run build` (debug) tetap boleh dipakai. Tapi setelah memasang build release, build debug bisa jadi ditolak band karena tanda tangannya berbeda.

## Format pengajuan ke toko AstroBox

Validator AstroBox-Repo (`.github/scripts/resource_submissions.py`) hanya menerima PR yang menyentuh satu folder `tmp/<pemilik>/<repo>/`, berisi:

- `resource.csv`: header `index_v2.csv` dan tepat satu baris, dengan `repo_commit_hash` berisi commit repo rilis.
- `request.json`:
  - pengajuan baru: `{ "schema_version": 1, "mode": "create", ... }`;
  - perubahan: `{ "schema_version": 1, "mode": "edit", "original_id", "base_entry_digest", "base_catalog_commit" }`.

  `base_entry_digest` adalah SHA-256 dari baris KlikBand di `index_v2.csv` pada `base_catalog_commit`, yaitu kolom-kolomnya di-*trim* lalu digabung dengan koma. Skrip menghitungnya dengan cara yang sama seperti Creator Console; sudah dicocokkan dengan PR edit asli (#1655).

## Menguji sebelum rilis

- Di band asli: buka file `.rpk` dengan AstroBox di Mac (`open -a AstroBox dist/*.rpk`); plugin juga sama (`open -a AstroBox plugin/dist/KlikBand.abp`). Log AstroBox ada di `~/Library/Logs/moe.astralsight.astrobox/`.
- Di emulator (Band 9 dan Band 10 dengan firmware asli): Mirage + qemu-miwear di `~/Projects/mirage-emu` (dibangun lokal, di luar repo ini):

  ```
  cd ~/Projects/mirage-emu
  M=Mirage/Packages/MirageKit/.build/release/miragectl
  $M boot band10 --no-shell
  tools/abx.sh band10 'install={"path":"/path/ke/file.rpk","kind":"quickapp"}' 'launchQuickApp={"packageName":"com.ashafizullah.klikband"}'
  tools/abx.sh band10 'sendQuickAppMessage={"packageName":"com.ashafizullah.klikband","text":"{\"type\":\"getState\"}"}'
  python3 -I tools/ramlog.py "$HOME/Library/Application Support/Mirage/Devices/<id>" --grep 'quickapp\]|interconnect'
  $M shutdown band10
  ```
