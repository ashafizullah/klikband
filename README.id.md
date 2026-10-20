<p align="center">
  <img src="design/icon.png" width="128" alt="KlikBand icon">
</p>

<h1 align="center">KlikBand</h1>

<p align="center">
  Quick app gratis dan open source untuk Xiaomi Smart Band 9 (mungkin juga jalan di band Xiaomi Vela lain seperti Band 10, belum diuji): jadwal sholat, dzikir berpanduan, tasbih, kalender Hijriah, hari besar Islam, kalender bulanan, hitung hari, dan papan skor. Sepenuhnya offline, tanpa akun.
</p>

<p align="center">
  <a href="https://github.com/ashafizullah/klikband/releases/latest"><img src="https://img.shields.io/github/v/release/ashafizullah/klikband?label=release" alt="Release"></a>
  <a href="https://github.com/ashafizullah/klikband/releases"><img src="https://img.shields.io/github/downloads/ashafizullah/klikband/total?color=1fa77a" alt="Downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/ashafizullah/klikband?color=blue" alt="MIT License"></a>
  <br>
  <img src="https://img.shields.io/badge/Xiaomi%20Vela-quick%20app-FF6900?logo=xiaomi&logoColor=white" alt="Xiaomi Vela quick app">
  <img src="https://img.shields.io/badge/device-Xiaomi%20Smart%20Band%209-lightgrey" alt="Xiaomi Smart Band 9">
  <a href="https://gadgetbridge.org/"><img src="https://img.shields.io/badge/install%20via-Gadgetbridge-3DDC84?logo=android&logoColor=white" alt="Install via Gadgetbridge"></a>
  <img src="https://img.shields.io/badge/languages-EN%20%7C%20ID%20%7C%20%E4%B8%AD%E6%96%87-lightgrey" alt="English, Indonesian, Chinese">
</p>

<p align="center">
  <a href="https://trakteer.id/adamshafizullah/tip"><img src="https://img.shields.io/badge/Buy%20me%20an%20AI%20token-Trakteer-C02E2E?style=for-the-badge" alt="Buy me an AI token on Trakteer"></a>
</p>

<p align="center">
  Bagian dari <a href="https://klikapps.pages.dev"><b>Klik Apps</b></a>, kumpulan aplikasi gratis dan open source: <a href="https://klikapps.pages.dev">klikapps.pages.dev</a>
</p>

<p align="center">
  <a href="README.md">English</a> | <b>Bahasa Indonesia</b> | <a href="README.zh.md">中文</a><br>
  <sub>Proyek komunitas, tidak berafiliasi dengan Xiaomi.</sub>
</p>

## Fitur

- **Islam**
  - **Hari Ini**: tanggal Masehi dan Hijriah, sholat berikutnya, serta puasa sunnah hari ini dan besok
  - **Dzikir Sholat**: penghitung berpanduan sesuai [Rumaysho](https://rumaysho.com/1997-dzikir-setelah-shalat.html)
  - **Dzikir Pagi Petang**: penghitung berpanduan sesuai [Almanhaj](https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html)
  - **Jadwal Sholat**: metode Kemenag RI, dihitung offline di band
  - **Tasbih**: penghitung ketuk dengan target 33/99/100 dan getar
  - **Hijriah**: kalender Hijriah aritmetika dengan koreksi manual ±2 hari
  - **Hari Besar Islam**: hitung mundur 8 hari besar Islam, diurutkan dari yang terdekat
  - **Asmaul Husna**: 99 nama Allah beserta artinya
  - **Doa Harian**: doa-doa pendek dalam bacaan Latin beserta artinya
- **Umum**
  - **Kalender**: kalender bulanan dengan tanggal Hijriah, hari besar Islam dan hari puasa ditandai; ketuk tanggal untuk detail
  - **Hitung Hari**: berapa hari menuju atau sejak tanggal pentingmu, bisa diulang bulanan atau tahunan
  - **Papan Skor**: penghitung poin dua sisi untuk badminton, padel dan permainan lain, dengan tombol batal
- **Pengaturan**: kota (46 kota di Indonesia, WIB/WITA/WIT) dan bahasa (Indonesia, English, 中文)

## Batasan

Smart Band 9 tidak punya GPS, dan Xiaomi tidak menyediakan API lokasi (`system.geolocation`) maupun internet (`system.fetch`) di band ini. Semua berjalan offline, dan kota dipilih manual.

Tata letaknya dirancang untuk layar Band 9 (192×490). Band Xiaomi Vela lain seperti Band 10 mungkin bisa, tetapi belum diuji; layar yang lebih lebar atau bulat (Band 9 Pro, jam Xiaomi/REDMI) tidak akan tampil rapi.

## Build

Butuh Node.js.

```
npm install
npm run build      # hasil: dist/*.rpk
```

## Pasang ke band

KlikBand bukan firmware: memasangnya tidak mem-flash atau mengubah sistem band. KlikBand adalah quick app (`.rpk`) yang dipasang (sideload) lewat [Gadgetbridge](https://gadgetbridge.org/), aplikasi pendamping open source untuk Android. Sudah diuji dengan Gadgetbridge 0.95.1 di Xiaomi Smart Band 9 (global).

### Yang dibutuhkan

- HP **Android**. iPhone tidak didukung, karena Gadgetbridge hanya ada di Android.
- Aplikasi **Mi Fitness**, hanya untuk mengambil auth key band.
- Komputer dengan [`adb`](https://developer.android.com/tools/adb) dan kabel USB, untuk membaca key dan menyalin file. Di macOS: `brew install android-platform-tools`.
- File `KlikBand.rpk`: unduh dari [Releases](https://github.com/ashafizullah/klikband/releases/latest), atau [build](#build) sendiri.

### 1. Pasangkan band ke Mi Fitness

Pasangkan band di Mi Fitness seperti biasa dan biarkan tersinkron. **Jangan unpair band di Mi Fitness setelahnya**, karena itu menghapus auth key.

### 2. Ambil auth key

1. Di HP, aktifkan **Opsi pengembang → USB debugging**, lalu sambungkan ke komputer.
2. Salin log Mi Fitness dan cari key-nya:

   ```
   adb pull /sdcard/Android/data/com.xiaomi.wearable/files/log ./mifitness-log
   grep -rhoaE 'encryptKey": "[0-9a-f]{32}' ./mifitness-log | tail -1
   ```

   Kalau Mi Fitness berjalan di dalam **Gbox** (HP Huawei/Honor tanpa layanan Google), lognya ada di
   `/sdcard/Android/data/com.gbox.android/_root/sdcard/Android/data/com.xiaomi.wearable/files/log`.
3. Pakai nilai 32 karakter yang **terakhir**. Setiap kali Mi Fitness memasangkan ulang band, key-nya berubah, jadi ambil yang terbaru.
4. **Tutup paksa Mi Fitness** (dan Gbox, kalau dipakai) dan biarkan tertutup. Kalau tidak, Mi Fitness akan menyambung ulang ke band dan membuat key baru.
5. Hapus salinan log tadi. Key ini seperti password band kamu.

### 3. Pasang Gadgetbridge

Pasang **Gadgetbridge** dari [F-Droid](https://f-droid.org/packages/nodomain.freeyourgadget.gadgetbridge/) sebagai aplikasi biasa (bukan di dalam Gbox). Jangan pakai "Bangle.js Gadgetbridge" dari Play Store, karena itu versi yang berbeda. Izinkan akses Bluetooth, Lokasi, dan Notifikasi saat diminta.

### 4. Sambungkan band

1. Di Gadgetbridge, ketuk **+**, pilih **Xiaomi Smart Band 9**, lalu masukkan auth key.
2. Setujui permintaan pairing di HP (bisa jadi hanya muncul sebagai **notifikasi**) dan di band (ketuk ✓).
3. Kalau Gadgetbridge memperingatkan perangkat "already bonded" dan pairing gagal, hapus band di **Pengaturan Android → Bluetooth** (bukan di Mi Fitness), lalu coba lagi. Kalau masih gagal, ambil ulang key-nya (langkah 2), karena Mi Fitness mungkin sudah menyambung ulang.

### 5. Pasang KlikBand

Gadgetbridge tidak bisa membaca file langsung dari folder Download, jadi taruh file `.rpk` di folder milik Gadgetbridge sendiri dan buka dari sana:

```
adb push KlikBand.rpk /sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk
adb shell am start -a android.intent.action.VIEW -t application/octet-stream \
  -d file:///sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk \
  -n nodomain.freeyourgadget.gadgetbridge/.activities.install.FileInstallerActivity
```

Tanpa komputer, kamu juga bisa membuka file `.rpk` dari pengelola file dengan **Buka dengan → Gadgetbridge**.

Ketuk **Install**. Tulisan merah "YOU ARE TRYING TO INSTALL A FIRMWARE" adalah peringatan umum Gadgetbridge untuk semua file selain watch face. Yang dikirim hanya aplikasinya, firmware tidak disentuh.

Setelah itu KlikBand muncul di daftar aplikasi band, di bagian **More**.

### Memperbarui atau menghapus

- **Memperbarui:** pasang file `.rpk` baru dengan cara yang sama. Nilai `versionCode` di `src/manifest.json` harus lebih tinggi dari versi yang terpasang.
- **Menghapus:** Gadgetbridge → kartu perangkat → **App Manager** (ikon kotak-kotak) → tekan lama KlikBand → hapus.

### Mengatasi masalah

| Masalah | Solusi |
|---|---|
| "No compatible device found" saat membuka `.rpk` | Gadgetbridge tidak bisa membaca file-nya. Salin ke folder Gadgetbridge (langkah 5), dan pastikan band berstatus **Connected**. |
| Perangkat terdeteksi sebagai Bangle.js | Yang terpasang adalah Bangle.js Gadgetbridge. Pasang Gadgetbridge dari F-Droid. |
| Tidak ada permintaan pairing | Tutup paksa Mi Fitness, biarkan layar band menyala, dan cek notifikasi HP. |
| Auth key ditolak | Mi Fitness memasangkan ulang band dan membuat key baru. Ambil ulang key terbaru (langkah 2). |
| Ikon aplikasi tidak berubah | Restart band: **Pengaturan → Sistem → Mulai ulang**. |
| KlikBand ada di "More" | Band tidak mengizinkan aplikasi pasang sendiri dipindah ke daftar utama. |

## Struktur proyek

```
src/
├── manifest.json        # info aplikasi dan rute halaman
├── common/
│   ├── i18n.js          # teks antarmuka (id, en, zh) dan pengaturan bahasa
│   ├── prayer.js        # perhitungan jadwal sholat
│   ├── hijri.js         # konversi kalender Hijriah
│   ├── cities.js        # daftar kota dan pengaturan kota
│   ├── asmaulhusna.js   # data 99 Asmaul Husna
│   ├── duas.js          # data doa harian
│   ├── dhikr.js         # dzikir setelah sholat
│   ├── dhikrmorningevening.js  # dzikir pagi dan petang
│   ├── fasting.js       # hari puasa sunnah dan hari dilarang puasa
│   ├── holidays.js      # tanggal hari besar Islam
│   ├── calendar.js      # grid kalender bulanan
│   ├── countdown.js     # data dan perhitungan Hitung Hari
│   ├── text.js          # bantuan marquee untuk label panjang
│   └── icons/           # ikon menu
└── pages/               # satu folder per layar
```

Untuk mengganti kota bawaan, ubah entri pertama di `src/common/cities.js`.

## Penafian

**Gunakan dengan risiko sendiri.** Software ini diberikan "apa adanya", tanpa jaminan apa pun (lihat [LICENSE](LICENSE)).

- Memasang aplikasi lewat Gadgetbridge tidak didukung resmi oleh Xiaomi. Proses pairing bisa membuat band perlu di-reset atau dipasangkan ulang.
- Jadwal sholat dan tanggal Hijriah adalah hasil perhitungan. Bisa berbeda beberapa menit atau ±1 hari dari ketetapan resmi; tetap ikuti jadwal masjid setempat atau Kemenag.
- Bacaan dzikir dan doa mengikuti sumber yang dicantumkan, tetapi transliterasi dan terjemahannya mungkin ada kekeliruan. Koreksi dipersilakan.
- KlikBand adalah proyek komunitas dan tidak berafiliasi dengan maupun didukung oleh Xiaomi.

## Lisensi

[MIT](LICENSE)
