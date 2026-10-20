# KlikBand

Aplikasi tambahan (quick app Xiaomi Vela) untuk **Xiaomi Smart Band 9**. Proyek komunitas, tidak berafiliasi dengan Xiaomi.

## Fitur

- **Islam**: Jadwal Sholat (metode Kemenag, dihitung offline), Tasbih, Kalender Hijriah, Asmaul Husna, Doa Harian
- **Pengaturan**: bahasa Indonesia, English, 中文

## Build

```
npm install
npm run build      # hasil: dist/*.rpk
```

## Pasang ke band

Sideload file `.rpk` lewat [Gadgetbridge](https://gadgetbridge.org/) (Android).

## Lokasi jadwal sholat

Koordinat ada di `src/common/prayer.js` (default: Jakarta).

## Lisensi

[MIT](LICENSE)
