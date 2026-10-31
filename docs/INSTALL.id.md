[← Kembali ke README](../README.id.md)

# Cara Memasang KlikBand

[English](INSTALL.md) | **Bahasa Indonesia** | [中文](INSTALL.zh.md)

Panduan ini ditulis untuk pemula. Pemasangan pertama butuh sekitar **30–45 menit** dan cukup dilakukan **sekali**. Setelah itu, memperbarui KlikBand hanya butuh 1 menit.

KlikBand **bukan firmware**: memasangnya tidak mengubah sistem band. KlikBand adalah aplikasi kecil (file `.rpk`) yang dikirim ke band lewat [Gadgetbridge](https://gadgetbridge.org/). Sudah diuji dengan Gadgetbridge 0.95.1 di Xiaomi Smart Band 9 (global).

## Gambaran singkat

Aplikasi resmi **Mi Fitness** tidak bisa memasang aplikasi dari luar. **Gadgetbridge** bisa, tapi ia butuh "kunci" band (disebut **auth key**) yang hanya disimpan oleh Mi Fitness. Jadi alurnya:

```
Mi Fitness ──(ambil kunci)──▶ Gadgetbridge ──(kirim KlikBand)──▶ Band
```

> [!NOTE]
> Band hanya bisa tersambung ke **satu** aplikasi. Setelah pindah ke Gadgetbridge, notifikasi dan data aktivitas diurus oleh Gadgetbridge, dan Mi Fitness jangan dibuka lagi. Fiturnya tidak sama persis dengan Mi Fitness.

## Yang perlu disiapkan

- [ ] HP **Android**. iPhone tidak bisa, karena Gadgetbridge hanya ada di Android.
- [ ] Laptop/PC **Windows** atau **Mac**, dan kabel USB HP yang bisa transfer data (bukan kabel cas saja).
- [ ] Band yang sudah tersambung ke aplikasi **Mi Fitness**.
- [ ] File **`KlikBand-x.y.z.rpk`** dari halaman [Releases](https://github.com/ashafizullah/klikband/releases/latest), diunduh ke komputer.

## Langkah 1. Pasangkan band ke Mi Fitness

Pasangkan band di Mi Fitness seperti biasa dan tunggu sampai tersinkron.

> [!WARNING]
> Setelah ini **jangan** hapus/unpair band di Mi Fitness. Itu akan menghapus kuncinya.

## Langkah 2. Siapkan komputer

Komputer butuh alat kecil dari Google bernama **adb** untuk "berbicara" dengan HP.

<details>
<summary><b>Windows</b></summary>

1. Unduh [SDK Platform-Tools for Windows](https://developer.android.com/tools/releases/platform-tools) dan ekstrak (klik kanan → Extract All). Akan muncul folder `platform-tools`.
2. Buka folder `platform-tools`, klik di kolom alamat (address bar) di atas, ketik `powershell`, lalu tekan Enter. Jendela biru akan terbuka. Semua perintah di panduan ini diketik di jendela itu.
3. Di Windows, setiap perintah diawali `.\adb` (bukan `adb`).

</details>

<details>
<summary><b>Mac</b></summary>

1. Buka aplikasi **Terminal**.
2. Kalau sudah punya [Homebrew](https://brew.sh), ketik `brew install android-platform-tools`. Kalau belum, unduh [SDK Platform-Tools for Mac](https://developer.android.com/tools/releases/platform-tools), ekstrak, lalu di Terminal ketik `cd ` (dengan spasi), seret folder `platform-tools` ke jendela Terminal, dan tekan Enter. Dengan cara ini, perintah diawali `./adb`.

</details>

## Langkah 3. Izinkan HP disambungkan ke komputer

1. Di HP, buka **Setelan → Tentang ponsel**, lalu ketuk **Nomor bentukan** (Build number) **7 kali** sampai muncul tulisan "Anda sekarang developer". Di HP Xiaomi, yang diketuk adalah **Versi MIUI / HyperOS**.
2. Kembali ke Setelan, buka **Opsi pengembang** (biasanya di **Sistem** atau **Setelan tambahan**), lalu nyalakan **USB debugging**.
3. Sambungkan HP ke komputer dengan kabel. Kalau HP bertanya mode USB, pilih **Transfer file**.
4. Di komputer, ketik:

   ```
   adb devices
   ```

5. Di HP akan muncul pertanyaan **"Izinkan USB debugging?"**. Centang **Selalu izinkan**, lalu ketuk **Izinkan**.
6. Ketik `adb devices` sekali lagi. Kalau berhasil, akan muncul satu baris berakhiran **`device`**.

## Langkah 4. Ambil kunci band (auth key)

> **Jalan pintas:** [KlikBand Auth Key](../tools/auth-key/README.id.md) mengambil kunci dari akun Xiaomi kamu di Windows atau Mac, tanpa log. Kalau kunci band kamu muncul, salin, hentikan paksa Mi Fitness seperti poin 4 di bawah, lalu lanjut ke langkah 5.

1. Salin catatan (log) Mi Fitness dari HP ke komputer:

   ```
   adb pull /sdcard/Android/data/com.xiaomi.wearable/files/log mifitness-log
   ```

   Kalau Mi Fitness kamu berjalan di dalam **Gbox** (HP Huawei/Honor tanpa layanan Google), pakai alamat ini:
   `/sdcard/Android/data/com.gbox.android/_root/sdcard/Android/data/com.xiaomi.wearable/files/log`

2. Cari kuncinya di log tadi.

   **Mac:**

   ```
   grep -rhoaE 'encryptKey": "[0-9a-f]{32}' mifitness-log | tail -1
   ```

   **Windows (PowerShell):**

   ```
   Get-ChildItem -Recurse mifitness-log -File | Select-String -Pattern 'encryptKey": "[0-9a-f]{32}' -AllMatches | ForEach-Object { $_.Matches.Value } | Select-Object -Last 1
   ```

3. Hasilnya kira-kira seperti ini (contoh, bukan kunci asli):

   ```
   encryptKey": "0123456789abcdef0123456789abcdef
   ```

   Kuncinya adalah **32 huruf/angka setelah tanda kutip**. Salin dan simpan sementara di catatan.
4. Di HP, **tutup paksa Mi Fitness**: tekan lama ikon Mi Fitness → **Info aplikasi** → **Paksa berhenti**. Lakukan juga pada Gbox kalau dipakai. Jangan buka Mi Fitness lagi, karena ia bisa menyambung ulang ke band dan membuat kunci baru.
5. Hapus folder `mifitness-log` di komputer. Kunci ini sama seperti password band kamu, jangan dibagikan.

## Langkah 5. Pasang Gadgetbridge

1. Di HP, buka halaman [Gadgetbridge di F-Droid](https://f-droid.org/packages/nodomain.freeyourgadget.gadgetbridge/) dan ketuk **Download APK** (versi teratas).
2. Buka file yang terunduh. Kalau HP menolak, izinkan **Pasang aplikasi tak dikenal** untuk browser kamu, lalu buka lagi.
3. Buka Gadgetbridge dan izinkan akses **Bluetooth**, **Lokasi**, dan **Notifikasi** saat diminta.

> [!IMPORTANT]
> Jangan pakai "Bangle.js Gadgetbridge" dari Play Store, itu versi yang berbeda. Kalau Mi Fitness ada di dalam Gbox, Gadgetbridge tetap dipasang sebagai aplikasi biasa (di luar Gbox).

## Langkah 6. Sambungkan band ke Gadgetbridge

1. Pastikan Mi Fitness masih tertutup paksa dan layar band menyala.
2. Di Gadgetbridge, ketuk tombol **+**, tunggu band muncul, lalu pilih **Xiaomi Smart Band 9**.
3. Tempel (paste) kunci dari langkah 4, lalu lanjutkan.
4. Setujui permintaan pairing di HP (kadang hanya muncul sebagai **notifikasi**) dan di band (ketuk ✓).
5. Berhasil kalau kartu band di Gadgetbridge menunjukkan **Connected** / **Tersambung**.

## Langkah 7. Pasang KlikBand

**Cara A, lewat komputer (paling pasti berhasil).** Ganti nama file jadi `KlikBand.rpk` dan pindahkan ke folder tempat jendela perintah dibuka: folder `platform-tools`, atau folder Home di Mac kalau adb dipasang lewat Homebrew. Lalu ketik dua perintah ini satu per satu:

```
adb push KlikBand.rpk /sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk
```

```
adb shell am start -a android.intent.action.VIEW -t application/octet-stream -d file:///sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk -n nodomain.freeyourgadget.gadgetbridge/.activities.install.FileInstallerActivity
```

Layar pemasangan Gadgetbridge akan terbuka di HP.

**Cara B, tanpa komputer.** Unduh file `.rpk` di HP, buka aplikasi pengelola file, ketuk file tersebut, lalu pilih **Buka dengan → Gadgetbridge**. Kalau muncul "No compatible device found", pakai Cara A.

Di layar pemasangan, ketuk **Install** dan tunggu sampai selesai.

> [!NOTE]
> Tulisan merah "YOU ARE TRYING TO INSTALL A FIRMWARE" itu peringatan umum Gadgetbridge untuk semua file selain watch face. Yang dikirim hanya aplikasinya, firmware band tidak disentuh.

## Langkah 8. Buka KlikBand di band

1. Di band, buka daftar aplikasi, gulir ke bawah, lalu ketuk **More**.
2. Ketuk **KlikBand**.
3. Buka **Pengaturan** di KlikBand untuk memilih **Kota** (untuk jadwal sholat) dan **Bahasa**.

Selesai! 🎉

## Memperbarui atau menghapus

- **Memperbarui:** unduh `.rpk` versi terbaru, lalu ulangi **langkah 7** saja.
- **Menghapus:** Gadgetbridge → kartu band → **App Manager** (ikon kotak-kotak) → tekan lama KlikBand → hapus.

## Mengatasi masalah

| Masalah | Solusi |
|---|---|
| `adb devices` tidak menampilkan apa pun | Cek kabelnya (harus kabel data), pilih mode **Transfer file** di HP, dan pastikan **USB debugging** menyala. |
| `adb devices` menampilkan `unauthorized` | Lihat layar HP dan ketuk **Izinkan** pada pertanyaan USB debugging. |
| Perintah mencari kunci tidak menampilkan apa pun | Buka Mi Fitness sebentar dan pastikan band tersinkron, tutup paksa lagi, lalu ulangi langkah 4. |
| "No compatible device found" saat membuka `.rpk` | Pakai Cara A di langkah 7, dan pastikan band berstatus **Connected** di Gadgetbridge. |
| Band terdeteksi sebagai Bangle.js | Yang terpasang adalah Bangle.js Gadgetbridge. Hapus, lalu pasang Gadgetbridge dari F-Droid. |
| Tidak ada permintaan pairing | Tutup paksa Mi Fitness, biarkan layar band menyala, dan cek notifikasi HP. |
| "Already bonded" dan pairing gagal | Hapus band di **Setelan Android → Bluetooth** (bukan di Mi Fitness), lalu coba lagi. |
| Kunci ditolak | Mi Fitness sempat menyambung ulang dan membuat kunci baru. Ulangi langkah 4 untuk mengambil kunci terbaru. |
| Ikon aplikasi tidak berubah setelah update | Restart band: **Pengaturan → Sistem → Mulai ulang**. |
| KlikBand hanya ada di "More" | Memang begitu. Band tidak mengizinkan aplikasi tambahan dipindah ke daftar utama. |

## Pertanyaan umum

**Bisa pakai iPhone?** Belum bisa, karena Gadgetbridge hanya ada di Android.

**Apakah band saya di-root atau diganti firmware-nya?** Tidak. KlikBand hanya aplikasi tambahan, sistem band tidak diubah.

**Bisa kembali ke Mi Fitness?** Bisa. Hapus band dari Gadgetbridge, lalu pasangkan lagi di Mi Fitness. Kalau nanti mau pindah ke Gadgetbridge lagi, ulangi dari langkah 4, karena kuncinya akan berubah.

**Butuh internet?** Tidak. Semua fitur KlikBand jalan offline di band.
