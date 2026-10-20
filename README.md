# KlikBand

**English** | [Bahasa Indonesia](README.id.md) | [中文](README.zh.md)

A Xiaomi Vela quick app for the **Xiaomi Smart Band 9**. Community project, not affiliated with Xiaomi.

## Features

- **Islam**
  - **Prayer Times**: Indonesian Ministry of Religious Affairs (Kemenag) method, computed offline on the band
  - **Tasbih**: tap counter with a 33/99/100 target and vibration
  - **Hijri Date**: arithmetic Hijri calendar with a ±2 day manual correction
  - **Asmaul Husna**: the 99 Names of Allah with meanings
  - **Daily Duas**: short daily prayers in Latin transliteration with meanings
- **Settings**: city (46 Indonesian cities, WIB/WITA/WIT) and language (Indonesian, English, 中文)

## Limitations

The Smart Band 9 has no GPS, and Xiaomi does not offer the location (`system.geolocation`) or internet (`system.fetch`) APIs on this band. Everything runs offline, and the city is picked manually.

## Build

Requires Node.js.

```
npm install
npm run build      # output: dist/*.rpk
```

## Install on the band

Sideload the `.rpk` file with [Gadgetbridge](https://gadgetbridge.org/) on Android:

1. Pair the band with Mi Fitness, then get the band's auth key ([guide](https://gadgetbridge.org/gadgets/wearables/xiaomi/)). Do not unpair it from Mi Fitness afterwards.
2. Force-stop Mi Fitness, then add the band in Gadgetbridge with the auth key.
3. Open the `.rpk` with Gadgetbridge and tap **Install**.

When installing over USB with `adb`, put the file in Gadgetbridge's own folder so it can read it:

```
adb push dist/*.rpk /sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk
adb shell am start -a android.intent.action.VIEW -t application/octet-stream \
  -d file:///sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk \
  -n nodomain.freeyourgadget.gadgetbridge/.activities.install.FileInstallerActivity
```

The band shows its default icon for apps installed this way.

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
│   ├── text.js          # marquee helpers for long labels
│   └── icons/           # menu icons
└── pages/               # one folder per screen
```

To change the default city, edit the first entry in `src/common/cities.js`.

## License

[MIT](LICENSE)
