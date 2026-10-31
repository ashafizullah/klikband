# KlikBand Auth Key

A small tool that shows the **auth key** of the bands and watches on your Xiaomi account, for connecting a band to [AstroBox](https://astrobox.online) or [Gadgetbridge](https://gadgetbridge.org/) by hand. It runs on Windows and Mac, needs no phone or cable, and asks for nothing but your Xiaomi login.

🇮🇩 [Baca dalam bahasa Indonesia](README.id.md)

## Download

| | |
|---|---|
| **Windows** | [KlikBand-AuthKey-Windows.zip](https://github.com/ashafizullah/klikband/releases/download/auth-key/KlikBand-AuthKey-Windows.zip) |
| **Mac** | [KlikBand-AuthKey-Mac.zip](https://github.com/ashafizullah/klikband/releases/download/auth-key/KlikBand-AuthKey-Mac.zip) |

Both are always on the [auth-key release](https://github.com/ashafizullah/klikband/releases/tag/auth-key).

## Use

Before you start: the band is paired in **Mi Fitness** with your Xiaomi account, and the computer is online.

**Windows**

1. Right-click the zip › **Extract All**, and open the extracted folder.
2. Double-click **KlikBand Auth Key.bat**. If Windows shows "Windows protected your PC", click **More info** › **Run anyway**.

**Mac**

1. Double-click the zip to extract it, and open the **KlikBand Auth Key** folder.
2. Double-click **KlikBand Auth Key.command**. If macOS says it cannot be opened, click **Done**, open **System Settings › Privacy & Security**, scroll down and click **Open Anyway**, then open it again.

**Then, on both**

3. The first time, the tool downloads Python once (about 10 MB on Windows, 25 MB on Mac) if the computer does not have it.
4. Type **1** and press Enter, then the email or phone number and password of the Xiaomi account used in Mi Fitness. The password is not shown while you type.
5. If Xiaomi sends a verification code by email or SMS, type the code.
6. Each band on the account is listed with its MAC address and **auth key** (32 letters and digits). Copy the key into AstroBox (add device › auth key) or Gadgetbridge.
7. Type **0** to quit.

The tool's messages are in Indonesian.

## Good to know

- **Read-only.** It logs in the way the Mi Fitness app does and reads the list of devices bound to the account. Nothing on the account or the band changes.
- **Your password** is sent only to Xiaomi (`account.xiaomi.com`) and never saved. A random device id is kept in `%APPDATA%\KlikBand` (Windows) or `~/Library/Application Support/KlikBand` (Mac), so Xiaomi does not ask for a code every time.
- **The key changes** every time the band is paired again in Mi Fitness. Run the tool again after re-pairing.
- **Keep the key private.** It works like a password for the band.
- **Unofficial.** Not made, endorsed or supported by Xiaomi or AstroBox. Xiaomi may change its servers at any time and stop the tool working.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Xiaomi meminta captcha" | Log in once at [account.xiaomi.com](https://account.xiaomi.com) in a browser, then try again. |
| "Email/nomor HP atau password salah" | Wrong login. Use the account the band is paired with in Mi Fitness. |
| "Tidak ada perangkat di akun ini" | The band is not bound to this account. Pair it in Mi Fitness first. |
| "Semua server menolak" | Try again in a moment. If it keeps failing, Xiaomi may have changed something: [open an issue](https://github.com/ashafizullah/klikband/issues). |
| Windows: "auth_key.py tidak ditemukan" | The zip was opened without extracting. Extract All first. |

## Run from source

With Python 3.9 or newer, no packages needed:

```
python3 auth_key.py
```

`publish.sh` builds both zips and uploads them to the fixed [auth-key release](https://github.com/ashafizullah/klikband/releases/tag/auth-key), so the download links above never change.
