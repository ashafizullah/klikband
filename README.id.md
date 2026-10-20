# KlikBand

[English](README.md) | **Bahasa Indonesia** | [中文](README.zh.md)

Quick app Xiaomi Vela untuk **Xiaomi Smart Band 9**. Proyek komunitas, tidak berafiliasi dengan Xiaomi.

## Fitur

- **Islam**
  - **Jadwal Sholat**: metode Kemenag RI, dihitung offline di band
  - **Tasbih**: penghitung ketuk dengan target 33/99/100 dan getar
  - **Hijriah**: kalender Hijriah aritmetika dengan koreksi manual ±2 hari
  - **Asmaul Husna**: 99 nama Allah beserta artinya
  - **Doa Harian**: doa-doa pendek dalam bacaan Latin beserta artinya
- **Pengaturan**: kota (46 kota di Indonesia, WIB/WITA/WIT) dan bahasa (Indonesia, English, 中文)

## Batasan

Smart Band 9 tidak punya GPS, dan Xiaomi tidak menyediakan API lokasi (`system.geolocation`) maupun internet (`system.fetch`) di band ini. Semua berjalan offline, dan kota dipilih manual.

## Build

Butuh Node.js.

```
npm install
npm run build      # hasil: dist/*.rpk
```

## Pasang ke band

Sideload file `.rpk` lewat [Gadgetbridge](https://gadgetbridge.org/) di Android:

1. Pasangkan band ke Mi Fitness, lalu ambil auth key band ([panduan](https://gadgetbridge.org/gadgets/wearables/xiaomi/)). Jangan unpair dari Mi Fitness setelahnya.
2. Tutup paksa Mi Fitness, lalu tambahkan band di Gadgetbridge dengan auth key tersebut.
3. Buka file `.rpk` dengan Gadgetbridge dan ketuk **Install**.

Kalau memasang lewat USB dengan `adb`, taruh file di folder milik Gadgetbridge supaya bisa dibaca:

```
adb push dist/*.rpk /sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk
adb shell am start -a android.intent.action.VIEW -t application/octet-stream \
  -d file:///sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk \
  -n nodomain.freeyourgadget.gadgetbridge/.activities.install.FileInstallerActivity
```

Band menampilkan ikon bawaan untuk aplikasi yang dipasang dengan cara ini.

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
│   ├── text.js          # bantuan marquee untuk label panjang
│   └── icons/           # ikon menu
└── pages/               # satu folder per layar
```

Untuk mengganti kota bawaan, ubah entri pertama di `src/common/cities.js`.

## Lisensi

[MIT](LICENSE)
