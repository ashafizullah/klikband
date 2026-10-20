[← Back to README](../README.md)

# Installing KlikBand

**English** | [Bahasa Indonesia](INSTALL.id.md) | [中文](INSTALL.zh.md)

This guide is written for beginners. The first install takes about **30–45 minutes** and only needs to be done **once**. After that, updating KlikBand takes a minute.

KlikBand is **not a firmware**: installing it does not change the band's system. It is a small app (a `.rpk` file) sent to the band with [Gadgetbridge](https://gadgetbridge.org/). Tested with Gadgetbridge 0.95.1 on a Xiaomi Smart Band 9 (global).

## How it works

The official **Mi Fitness** app cannot install outside apps. **Gadgetbridge** can, but it needs the band's "key" (called the **auth key**), which only Mi Fitness has. So the flow is:

```
Mi Fitness ──(get the key)──▶ Gadgetbridge ──(send KlikBand)──▶ Band
```

> [!NOTE]
> The band can only be connected to **one** app. After switching to Gadgetbridge, notifications and activity data are handled by Gadgetbridge, and Mi Fitness should stay closed. Its features are not exactly the same as Mi Fitness.

## What you need

- [ ] An **Android** phone. iPhone does not work, because Gadgetbridge is Android-only.
- [ ] A **Windows** or **Mac** computer, and a phone USB cable that can transfer data (not a charge-only cable).
- [ ] The band already connected to the **Mi Fitness** app.
- [ ] The **`KlikBand-x.y.z.rpk`** file from [Releases](https://github.com/ashafizullah/klikband/releases/latest), downloaded to the computer.

## Step 1. Pair the band with Mi Fitness

Pair the band in Mi Fitness as usual and wait until it has synced.

> [!WARNING]
> From now on, **do not** remove/unpair the band in Mi Fitness. That erases the key.

## Step 2. Set up the computer

The computer needs a small Google tool called **adb** to "talk" to the phone.

<details>
<summary><b>Windows</b></summary>

1. Download [SDK Platform-Tools for Windows](https://developer.android.com/tools/releases/platform-tools) and extract it (right-click → Extract All). You get a `platform-tools` folder.
2. Open the `platform-tools` folder, click the address bar at the top, type `powershell` and press Enter. A blue window opens. Type every command in this guide there.
3. On Windows, start every command with `.\adb` (instead of `adb`).

</details>

<details>
<summary><b>Mac</b></summary>

1. Open the **Terminal** app.
2. If you have [Homebrew](https://brew.sh), type `brew install android-platform-tools`. Otherwise download [SDK Platform-Tools for Mac](https://developer.android.com/tools/releases/platform-tools), extract it, type `cd ` (with a space) in Terminal, drag the `platform-tools` folder into the Terminal window and press Enter. In that case, start every command with `./adb`.

</details>

## Step 3. Allow the phone to connect to the computer

1. On the phone, open **Settings → About phone** and tap **Build number** **7 times** until it says "You are now a developer". On Xiaomi phones, tap **MIUI / HyperOS version** instead.
2. Go back to Settings, open **Developer options** (usually under **System** or **Additional settings**) and turn on **USB debugging**.
3. Connect the phone to the computer with the cable. If the phone asks for a USB mode, choose **File transfer**.
4. On the computer, type:

   ```
   adb devices
   ```

5. The phone shows **"Allow USB debugging?"**. Tick **Always allow** and tap **Allow**.
6. Type `adb devices` again. If it worked, you see one line ending in **`device`**.

## Step 4. Get the band's key (auth key)

1. Copy the Mi Fitness logs from the phone to the computer:

   ```
   adb pull /sdcard/Android/data/com.xiaomi.wearable/files/log mifitness-log
   ```

   If Mi Fitness runs inside **Gbox** (Huawei/Honor phones without Google services), use this path instead:
   `/sdcard/Android/data/com.gbox.android/_root/sdcard/Android/data/com.xiaomi.wearable/files/log`

2. Find the key in those logs.

   **Mac:**

   ```
   grep -rhoaE 'encryptKey": "[0-9a-f]{32}' mifitness-log | tail -1
   ```

   **Windows (PowerShell):**

   ```
   Get-ChildItem -Recurse mifitness-log -File | Select-String -Pattern 'encryptKey": "[0-9a-f]{32}' -AllMatches | ForEach-Object { $_.Matches.Value } | Select-Object -Last 1
   ```

3. The result looks like this (an example, not a real key):

   ```
   encryptKey": "0123456789abcdef0123456789abcdef
   ```

   The key is the **32 letters/digits after the quote mark**. Copy it and keep it in a note for now.
4. On the phone, **force-stop Mi Fitness**: long-press the Mi Fitness icon → **App info** → **Force stop**. Do the same for Gbox if you use it. Do not open Mi Fitness again, or it may reconnect to the band and create a new key.
5. Delete the `mifitness-log` folder on the computer. The key works like a password for your band; do not share it.

## Step 5. Install Gadgetbridge

1. On the phone, open [Gadgetbridge on F-Droid](https://f-droid.org/packages/nodomain.freeyourgadget.gadgetbridge/) and tap **Download APK** (the top version).
2. Open the downloaded file. If the phone refuses, allow **Install unknown apps** for your browser and open it again.
3. Open Gadgetbridge and allow **Bluetooth**, **Location** and **Notifications** when asked.

> [!IMPORTANT]
> Do not use "Bangle.js Gadgetbridge" from the Play Store; it is a different build. If Mi Fitness runs inside Gbox, still install Gadgetbridge as a normal app (outside Gbox).

## Step 6. Connect the band to Gadgetbridge

1. Make sure Mi Fitness is still force-stopped and the band screen is on.
2. In Gadgetbridge, tap **+**, wait for the band to appear and choose **Xiaomi Smart Band 9**.
3. Paste the key from step 4 and continue.
4. Accept the pairing request on the phone (sometimes only shown as a **notification**) and on the band (tap ✓).
5. It worked when the band's card in Gadgetbridge says **Connected**.

## Step 7. Install KlikBand

**Option A, with the computer (most reliable).** Rename the file to `KlikBand.rpk` and move it to the folder where the command window is open: the `platform-tools` folder, or your Home folder on a Mac if adb came from Homebrew. Then type these two commands, one at a time:

```
adb push KlikBand.rpk /sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk
```

```
adb shell am start -a android.intent.action.VIEW -t application/octet-stream -d file:///sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk -n nodomain.freeyourgadget.gadgetbridge/.activities.install.FileInstallerActivity
```

Gadgetbridge's install screen opens on the phone.

**Option B, without a computer.** Download the `.rpk` on the phone, open a file manager, tap the file and choose **Open with → Gadgetbridge**. If it says "No compatible device found", use Option A.

On the install screen, tap **Install** and wait until it finishes.

> [!NOTE]
> The red "YOU ARE TRYING TO INSTALL A FIRMWARE" text is a generic Gadgetbridge warning shown for every file that is not a watch face. Only the app is sent; the band's firmware is not touched.

## Step 8. Open KlikBand on the band

1. On the band, open the app list, scroll down and tap **More**.
2. Tap **KlikBand**.
3. Open **Settings** in KlikBand to choose your **City** (for prayer times) and **Language**.

Done! 🎉

## Update or remove

- **Update:** download the newest `.rpk` and repeat **step 7** only.
- **Remove:** Gadgetbridge → band card → **App Manager** (grid icon) → long-press KlikBand → delete.

## Troubleshooting

| Problem | Fix |
|---|---|
| `adb devices` shows nothing | Check the cable (it must be a data cable), choose **File transfer** on the phone, and make sure **USB debugging** is on. |
| `adb devices` shows `unauthorized` | Look at the phone screen and tap **Allow** on the USB debugging prompt. |
| The key search prints nothing | Open Mi Fitness briefly and let the band sync, force-stop it again, then repeat step 4. |
| "No compatible device found" when opening the `.rpk` | Use Option A in step 7, and make sure the band shows **Connected** in Gadgetbridge. |
| Band shows up as Bangle.js | You installed Bangle.js Gadgetbridge. Remove it and install Gadgetbridge from F-Droid. |
| No pairing prompt | Force-stop Mi Fitness, keep the band screen on, and check the phone's notifications. |
| "Already bonded" and pairing fails | Remove the band in **Android Settings → Bluetooth** (not in Mi Fitness) and try again. |
| Key rejected | Mi Fitness reconnected and created a new key. Repeat step 4 to get the newest key. |
| App icon not updated after an update | Restart the band: **Settings → System → Restart**. |
| KlikBand is only under "More" | That is expected. The band does not let extra apps move to the main list. |

## FAQ

**Does it work with an iPhone?** Not yet, because Gadgetbridge is Android-only.

**Is my band rooted or reflashed?** No. KlikBand is just an extra app; the band's system is not changed.

**Can I go back to Mi Fitness?** Yes. Remove the band from Gadgetbridge and pair it again in Mi Fitness. To switch back to Gadgetbridge later, start again from step 4, because the key will have changed.

**Does it need internet?** No. Every KlikBand feature runs offline on the band.
