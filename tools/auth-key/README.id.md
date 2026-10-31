# KlikBand Auth Key

Alat kecil untuk melihat **auth key** band dan jam di akun Xiaomi kamu, untuk menyambungkan band ke [AstroBox](https://astrobox.online) atau [Gadgetbridge](https://gadgetbridge.org/). Jalan di Windows dan Mac, tidak perlu HP atau kabel, cukup login akun Xiaomi.

🇬🇧 [Read in English](README.md)

## Unduh

| | |
|---|---|
| **Windows** | [KlikBand-AuthKey-Windows.zip](https://github.com/ashafizullah/klikband/releases/download/auth-key/KlikBand-AuthKey-Windows.zip) |
| **Mac** | [KlikBand-AuthKey-Mac.zip](https://github.com/ashafizullah/klikband/releases/download/auth-key/KlikBand-AuthKey-Mac.zip) |

Keduanya selalu ada di [rilis auth-key](https://github.com/ashafizullah/klikband/releases/tag/auth-key).

## Cara pakai

Sebelum mulai: band sudah dipasangkan di **Mi Fitness** dengan akun Xiaomi kamu, dan komputer tersambung internet.

**Windows**

1. Klik kanan file zip › **Extract All**, lalu buka folder hasil ekstrak.
2. Klik dua kali **KlikBand Auth Key.bat**. Kalau muncul "Windows protected your PC", klik **More info** › **Run anyway**.

**Mac**

1. Klik dua kali file zip untuk mengekstrak, lalu buka folder **KlikBand Auth Key**.
2. Klik dua kali **KlikBand Auth Key.command**. Kalau macOS bilang tidak bisa dibuka, klik **Selesai**, buka **Pengaturan Sistem › Privasi & Keamanan**, gulir ke bawah dan klik **Tetap Buka**, lalu buka lagi.

**Lalu, di keduanya**

3. Pertama kali, alat ini mengunduh Python sekali saja (sekitar 10 MB di Windows, 25 MB di Mac) kalau komputer belum punya.
4. Ketik **1** lalu Enter, lalu email atau nomor HP dan password akun Xiaomi yang dipakai di Mi Fitness. Password tidak terlihat saat diketik.
5. Kalau Xiaomi mengirim kode verifikasi lewat email atau SMS, ketik kodenya.
6. Setiap band di akun muncul dengan alamat MAC dan **auth key** (32 huruf dan angka). Salin key ke AstroBox (tambah perangkat › auth key) atau Gadgetbridge.
7. Ketik **0** untuk keluar.

## Perlu diketahui

- **Hanya membaca.** Alat ini login seperti aplikasi Mi Fitness dan membaca daftar perangkat di akun. Tidak ada yang diubah di akun maupun band.
- **Password** hanya dikirim ke Xiaomi (`account.xiaomi.com`) dan tidak disimpan. Yang disimpan hanya ID perangkat acak di `%APPDATA%\KlikBand` (Windows) atau `~/Library/Application Support/KlikBand` (Mac), supaya Xiaomi tidak meminta kode setiap kali.
- **Key berubah** setiap kali band dipasangkan ulang di Mi Fitness. Jalankan lagi alat ini setelah memasangkan ulang.
- **Jangan bagikan key.** Key berfungsi seperti password band.
- **Tidak resmi.** Tidak dibuat, didukung, atau berafiliasi dengan Xiaomi maupun AstroBox. Xiaomi bisa mengubah servernya kapan saja sehingga alat ini berhenti berfungsi.

## Kalau ada masalah

| Masalah | Solusi |
|---|---|
| "Xiaomi meminta captcha" | Login sekali di [account.xiaomi.com](https://account.xiaomi.com) lewat browser, lalu coba lagi. |
| "Email/nomor HP atau password salah" | Login salah. Pakai akun yang sama dengan di Mi Fitness. |
| "Tidak ada perangkat di akun ini" | Band belum terikat ke akun ini. Pasangkan dulu di Mi Fitness. |
| "Semua server menolak" | Coba lagi sebentar lagi. Kalau terus gagal, mungkin Xiaomi mengubah sesuatu: [laporkan di sini](https://github.com/ashafizullah/klikband/issues). |
| Windows: "auth_key.py tidak ditemukan" | Zip dibuka tanpa diekstrak. Extract All dulu. |

## Jalankan dari kode sumber

Dengan Python 3.9 atau lebih baru, tanpa paket tambahan:

```
python3 auth_key.py
```
