<p align="center">
  <img src="design/icon.png" width="128" alt="KlikBand icon">
</p>

<h1 align="center">KlikBand</h1>

<p align="center">
  A free, open-source quick app for Xiaomi Smart Band 9 (may also work on other Xiaomi Vela bands such as Band 10, untested): prayer times, guided dhikr, tasbih, Hijri date, Islamic holidays, a calendar, a day counter and a scoreboard. Fully offline, no account.
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
  Part of <a href="https://klikapps.pages.dev"><b>Klik Apps</b></a>, a family of free, open-source apps: <a href="https://klikapps.pages.dev">klikapps.pages.dev</a>
</p>

<p align="center">
  <b>English</b> | <a href="README.id.md">Bahasa Indonesia</a> | <a href="README.zh.md">中文</a><br>
  <sub>Community project, not affiliated with Xiaomi.</sub>
</p>

## Features

- **Islam**
  - **Today**: Gregorian and Hijri date, next prayer, and sunnah fasts for today and tomorrow
  - **Post-prayer Dhikr**: guided counter following [Rumaysho](https://rumaysho.com/1997-dzikir-setelah-shalat.html)
  - **Morning & Evening Dhikr**: guided counter following [Almanhaj](https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html)
  - **Prayer Times**: Indonesian Ministry of Religious Affairs (Kemenag) method, computed offline on the band
  - **Tasbih**: tap counter with a 33/99/100 target and vibration
  - **Hijri Date**: arithmetic Hijri calendar with a ±2 day manual correction
  - **Islamic Holidays**: countdown to 8 Islamic holidays, nearest first
  - **Asmaul Husna**: the 99 Names of Allah with meanings
  - **Daily Duas**: short daily prayers in Latin transliteration with meanings
- **General**
  - **Calendar**: monthly calendar with Hijri dates, Islamic holidays and fasting days marked; tap a day for details
  - **Day Counter**: days until or since your own dates, with monthly or yearly repeat
  - **Scoreboard**: two-side counter with free points, badminton (21 points, best of 3) or padel/tennis scoring (15-30-40, deuce, sets, tiebreak), with undo
- **Settings**: city (46 Indonesian cities, WIB/WITA/WIT) and language (Indonesian, English, 中文)

## Limitations

The Smart Band 9 has no GPS, and Xiaomi does not offer the location (`system.geolocation`) or internet (`system.fetch`) APIs on this band. Everything runs offline, and the city is picked manually.

The layout is designed for the Band 9 screen (192×490). Other Xiaomi Vela bands such as Band 10 may work but are untested; wider or round screens (Band 9 Pro, Xiaomi/REDMI watches) will not look right.

## Build

Requires Node.js.

```
npm install
npm run build      # output: dist/*.rpk
```

## Install on the band

KlikBand is not a firmware: installing it does not flash or modify the band's system. It is a quick app (`.rpk`) sideloaded with [Gadgetbridge](https://gadgetbridge.org/), an open-source companion app for Android. Tested with Gadgetbridge 0.95.1 on a Xiaomi Smart Band 9 (global).

### What you need

- An **Android** phone. iPhone is not supported, because Gadgetbridge is Android-only.
- The **Mi Fitness** app, only to get the band's auth key.
- A computer with [`adb`](https://developer.android.com/tools/adb) and a USB cable, to read the key and copy files. On macOS: `brew install android-platform-tools`.
- The `KlikBand.rpk` file: download it from [Releases](https://github.com/ashafizullah/klikband/releases/latest), or [build](#build) it yourself.

### 1. Pair the band with Mi Fitness

Pair the band in Mi Fitness as usual and let it sync. **Do not unpair the band in Mi Fitness afterwards**: that erases the auth key.

### 2. Get the auth key

1. On the phone, enable **Developer options → USB debugging** and connect it to the computer.
2. Copy the Mi Fitness logs and search for the key:

   ```
   adb pull /sdcard/Android/data/com.xiaomi.wearable/files/log ./mifitness-log
   grep -rhoaE 'encryptKey": "[0-9a-f]{32}' ./mifitness-log | tail -1
   ```

   If Mi Fitness runs inside **Gbox** (Huawei/Honor phones without Google services), the logs are at
   `/sdcard/Android/data/com.gbox.android/_root/sdcard/Android/data/com.xiaomi.wearable/files/log`.
3. Use the **last** 32-character value. Every time Mi Fitness pairs again, the key changes, so take the newest one.
4. **Force-stop Mi Fitness** (and Gbox, if used) and keep it closed. Otherwise it reconnects to the band and generates a new key.
5. Delete the copied logs; the key works like a password for your band.

### 3. Install Gadgetbridge

Install **Gadgetbridge** from [F-Droid](https://f-droid.org/packages/nodomain.freeyourgadget.gadgetbridge/), as a normal app (not inside Gbox). Do not use "Bangle.js Gadgetbridge" from the Play Store; it is a different build. Grant the Bluetooth, Location and Notification permissions when asked.

### 4. Connect the band

1. In Gadgetbridge, tap **+**, pick **Xiaomi Smart Band 9**, and enter the auth key.
2. Accept the pairing request on the phone (it may appear only as a **notification**) and on the band (tap ✓).
3. If Gadgetbridge warns that the device is "already bonded" and pairing fails, remove the band in **Android Settings → Bluetooth** (not in Mi Fitness) and try again. If it still fails, read the key again (step 2), since Mi Fitness may have reconnected.

### 5. Install KlikBand

Gadgetbridge cannot read files from the Download folder directly, so put the `.rpk` in Gadgetbridge's own folder and open it there:

```
adb push KlikBand.rpk /sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk
adb shell am start -a android.intent.action.VIEW -t application/octet-stream \
  -d file:///sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk \
  -n nodomain.freeyourgadget.gadgetbridge/.activities.install.FileInstallerActivity
```

Without a computer, you can also open the `.rpk` from a file manager with **Open with → Gadgetbridge**.

Tap **Install**. The red "YOU ARE TRYING TO INSTALL A FIRMWARE" text is a generic Gadgetbridge warning shown for every file that is not a watch face; only the app is sent, the firmware is not touched.

KlikBand then appears in the band's app list under **More**.

### Update or remove

- **Update:** install the new `.rpk` the same way. Its `versionCode` in `src/manifest.json` must be higher than the installed one.
- **Remove:** Gadgetbridge → device card → **App Manager** (grid icon) → long-press KlikBand → delete.

### Troubleshooting

| Problem | Fix |
|---|---|
| "No compatible device found" when opening the `.rpk` | Gadgetbridge cannot read the file. Copy it into Gadgetbridge's folder (step 5), and make sure the band shows **Connected**. |
| Device shows up as Bangle.js | You installed Bangle.js Gadgetbridge. Install Gadgetbridge from F-Droid instead. |
| No pairing prompt | Force-stop Mi Fitness, keep the band screen on, and check the phone's notifications. |
| Auth key rejected | Mi Fitness re-paired and made a new key. Read the newest key again (step 2). |
| App icon not updated | Restart the band: **Settings → System → Restart**. |
| KlikBand is under "More" | The band does not let sideloaded apps move to the main list. |

## Project structure

```
src/
├── manifest.json        # app info and page routes
├── common/
│   ├── i18n.js          # UI strings (id, en, zh) and language setting
│   ├── prayer.js        # prayer time calculation
│   ├── hijri.js         # Hijri calendar conversion
│   ├── cities.js        # city list and city setting
│   ├── asmaulhusna.js   # 99 Names data
│   ├── duas.js          # daily duas data
│   ├── dhikr.js         # post-prayer dhikr
│   ├── dhikrmorningevening.js  # morning and evening dhikr
│   ├── fasting.js       # sunnah and forbidden fasting days
│   ├── holidays.js      # Islamic holiday dates
│   ├── calendar.js      # monthly calendar grid
│   ├── countdown.js     # day counter entries and date math
│   ├── text.js          # marquee helpers for long labels
│   └── icons/           # menu icons
└── pages/               # one folder per screen
```

To change the default city, edit the first entry in `src/common/cities.js`.

## Disclaimer

**Use at your own risk.** This software is provided "as is", without warranty of any kind (see [LICENSE](LICENSE)).

- Installing apps through Gadgetbridge is not supported by Xiaomi. Pairing may require resetting or re-pairing the band.
- Prayer times and Hijri dates are calculated. They may differ by a few minutes or ±1 day from official announcements; follow your local mosque or authority.
- Dhikr and dua texts follow the cited sources, but the transliterations and translations may contain mistakes. Corrections are welcome.
- KlikBand is a community project and is not affiliated with or endorsed by Xiaomi.

## License

[MIT](LICENSE)
