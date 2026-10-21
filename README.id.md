<p align="center">
  <img src="design/icon.png" width="128" alt="KlikBand icon">
</p>

<h1 align="center">KlikBand</h1>

<p align="center">
  Quick app gratis dan open source untuk Xiaomi Smart Band 9, dengan tata letak khusus untuk Band 9 Pro (Band 10 juga seharusnya bisa): jam, jadwal sholat, dzikir berpanduan, tasbih, kalender Hijriah, hari besar Islam, panduan umrah, kalender bulanan, hitung hari, dan papan skor. Sepenuhnya offline, tanpa akun.
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

- **Jam**: halaman bergaya watch face berisi jam, tanggal Masehi dan Hijriah, sholat berikutnya dengan hitung mundur dan bar progres, serta jadwal 5 waktu hari ini; geser ke kiri untuk pintasan ke Dzikir Sholat, Dzikir Pagi Petang dan Arah Kiblat
- **Islam**
  - **Hari Ini**: tanggal Masehi dan Hijriah, sholat berikutnya, serta puasa sunnah hari ini dan besok
  - **Dzikir Sholat**: penghitung berpanduan sesuai [Almanhaj](https://almanhaj.or.id/97313-dzikir-setelah-shalat.html)
  - **Dzikir Pagi Petang**: penghitung berpanduan sesuai [Almanhaj](https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html)
  - **Jadwal Sholat**: metode Kemenag RI, dihitung offline di band; bergetar dan menampilkan pesan saat masuk waktu sholat selama halaman Jam, Hari Ini atau Jadwal Sholat terbuka
  - **Arah Kiblat**: arah dan jarak ke Ka'bah dari kotamu, dengan posisi matahari di kompas sehingga cukup menyamakannya dengan matahari sungguhan untuk menghadap kiblat, plus jadwal Rashdul Qiblat
  - **Tasbih**: penghitung ketuk dengan target 33/99/100 dan getar
  - **Hijriah**: kalender Hijriah aritmetika dengan koreksi manual ±2 hari
  - **Hari Besar Islam**: hitung mundur 8 hari besar Islam, diurutkan dari yang terdekat
  - **Asmaul Husna**: 99 nama Allah beserta artinya
  - **Doa-doa Nabi**: 47 doa Nabi ﷺ sesuai [Almanhaj](https://almanhaj.or.id/83989-doa-doa-nabi-shallallahu-alaihi-wa-sallam.html), dengan bacaan Latin, arti dan perawinya
  - **Panduan Umrah**: tata cara umrah langkah demi langkah sesuai [Almanhaj](https://almanhaj.or.id/2252-tata-cara-umrah.html), lengkap dengan bacaan dan penghitung putaran thawaf/sa'i
- **Umum**
  - **Kalender**: kalender bulanan dengan tanggal Hijriah, hari besar Islam dan hari puasa ditandai; ketuk tanggal untuk detail
  - **Hitung Hari**: berapa hari menuju atau sejak tanggal pentingmu, bisa diulang bulanan atau tahunan
  - **Papan Skor**: penghitung skor dua sisi: poin bebas, badminton (21 poin, best of 3) atau padel/tenis (15-30-40, deuce, set, tiebreak), dengan tombol batal
  - **Penghitung**: hingga enam penghitung dengan nama pilihan (tamu, orang, barang, putaran, repetisi)
  - **Kalkulator**: + − × ÷ dengan persen dan ganti tanda
- **Pengaturan**: kota (46 kota di Indonesia, WIB/WITA/WIT) dan bahasa (Indonesia, English, 中文)
- **Tentang**: versi aplikasi dan info perangkat (penyimpanan, model, versi OS dan platform)

Halaman bacaan dan penghitung membuat layar tetap menyala selama dibuka.

## Batasan

Smart Band 9 tidak punya GPS, dan Xiaomi tidak menyediakan API lokasi (`system.geolocation`) maupun internet (`system.fetch`) di band ini. Semua berjalan offline, dan kota dipilih manual.

Tata letaknya dirancang untuk layar Band 9 (192×490). Band 9 Pro (336×480) punya tata letak sendiri dan Band 10 (212×520) memakai tata letak Band 9; keduanya baru dicek di emulator Vela, belum di perangkat asli. Layar bulat (jam Xiaomi/REDMI) tidak didukung.

## Pasang ke band

KlikBand dipasang dari HP **Android** (iPhone belum bisa) lewat [Gadgetbridge](https://gadgetbridge.org/). Pemasangan pertama butuh sekitar 30–45 menit dan sekali memakai komputer, untuk mengambil kunci band dari Mi Fitness. Update berikutnya cukup 1 menit.

👉 **[Panduan pemasangan langkah demi langkah](docs/INSTALL.id.md)** (untuk pemula, lengkap dengan cara mengatasi masalah dan FAQ)

## Build

Butuh Node.js.

```
npm install
npm run build      # hasil: dist/*.rpk
```

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
│   ├── duas.js          # data doa-doa Nabi
│   ├── umrah.js         # data panduan umrah
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
