[← 返回 README](../README.zh.md)

# 安装 KlikBand

[English](INSTALL.md) | [Bahasa Indonesia](INSTALL.id.md) | **中文**

本指南面向新手。首次安装大约需要 **30–45 分钟**，而且只需做**一次**。之后更新 KlikBand 只要 1 分钟。

KlikBand **不是固件**：安装它不会改动手环系统。它是一个小应用（`.rpk` 文件），通过 [Gadgetbridge](https://gadgetbridge.org/) 发送到手环。已在小米手环 9（国际版）上用 Gadgetbridge 0.95.1 测试。

## 原理简介

官方应用 **Mi Fitness** 不能安装外部应用。**Gadgetbridge** 可以，但它需要手环的"钥匙"（称为 **auth key**），而这把钥匙只保存在 Mi Fitness 里。所以流程是：

```
Mi Fitness ──(取出钥匙)──▶ Gadgetbridge ──(发送 KlikBand)──▶ 手环
```

> [!NOTE]
> 手环同一时间只能连接**一个**应用。切换到 Gadgetbridge 后，通知和运动数据由 Gadgetbridge 处理，不要再打开 Mi Fitness。它的功能与 Mi Fitness 并不完全相同。

## 准备

- [ ] 一部 **Android** 手机。iPhone 不行，因为 Gadgetbridge 只有 Android 版。
- [ ] 一台 **Windows** 或 **Mac** 电脑，以及能传输数据的手机 USB 线（不是只能充电的线）。
- [ ] 手环已连接 **Mi Fitness** 应用。
- [ ] 从 [Releases](https://github.com/ashafizullah/klikband/releases/latest) 下载到电脑的 **`KlikBand-x.y.z.rpk`** 文件。

## 第 1 步：用 Mi Fitness 配对手环

照常在 Mi Fitness 中配对手环，并等待同步完成。

> [!WARNING]
> 从现在起，**不要**在 Mi Fitness 中删除/解绑手环，否则钥匙会被清除。

## 第 2 步：准备电脑

电脑需要一个叫 **adb** 的谷歌小工具来和手机"对话"。

<details>
<summary><b>Windows</b></summary>

1. 下载 [SDK Platform-Tools for Windows](https://developer.android.com/tools/releases/platform-tools) 并解压（右键 → 全部解压缩），得到 `platform-tools` 文件夹。
2. 打开 `platform-tools` 文件夹，点击上方地址栏，输入 `powershell` 并按回车，会打开一个蓝色窗口。本指南的所有命令都在这里输入。
3. 在 Windows 上，每条命令以 `.\adb` 开头（而不是 `adb`）。

</details>

<details>
<summary><b>Mac</b></summary>

1. 打开 **终端（Terminal）** 应用。
2. 如果装有 [Homebrew](https://brew.sh)，输入 `brew install android-platform-tools`。否则下载 [SDK Platform-Tools for Mac](https://developer.android.com/tools/releases/platform-tools) 并解压，在终端输入 `cd `（带一个空格），把 `platform-tools` 文件夹拖进终端窗口并按回车。这种情况下，每条命令以 `./adb` 开头。

</details>

## 第 3 步：允许手机连接电脑

1. 在手机上打开 **设置 → 关于手机**，连续点击 **版本号** **7 次**，直到提示"您已处于开发者模式"。小米手机请点击 **MIUI / HyperOS 版本**。
2. 回到设置，打开 **开发者选项**（通常在 **系统** 或 **更多设置** 中），开启 **USB 调试**。
3. 用数据线连接手机和电脑。如果手机询问 USB 模式，选择 **传输文件**。
4. 在电脑上输入：

   ```
   adb devices
   ```

5. 手机会弹出 **"允许 USB 调试吗？"**。勾选 **始终允许**，然后点 **允许**。
6. 再次输入 `adb devices`。成功时会看到一行以 **`device`** 结尾的内容。

## 第 4 步：取得手环钥匙（auth key）

1. 把 Mi Fitness 的日志从手机复制到电脑：

   ```
   adb pull /sdcard/Android/data/com.xiaomi.wearable/files/log mifitness-log
   ```

   如果 Mi Fitness 运行在 **Gbox** 中（没有谷歌服务的华为/荣耀手机），请改用此路径：
   `/sdcard/Android/data/com.gbox.android/_root/sdcard/Android/data/com.xiaomi.wearable/files/log`

2. 在日志中查找钥匙。

   **Mac：**

   ```
   grep -rhoaE 'encryptKey": "[0-9a-f]{32}' mifitness-log | tail -1
   ```

   **Windows（PowerShell）：**

   ```
   Get-ChildItem -Recurse mifitness-log -File | Select-String -Pattern 'encryptKey": "[0-9a-f]{32}' -AllMatches | ForEach-Object { $_.Matches.Value } | Select-Object -Last 1
   ```

3. 结果大致如下（示例，不是真实钥匙）：

   ```
   encryptKey": "0123456789abcdef0123456789abcdef
   ```

   钥匙就是**引号后面的 32 个字母/数字**。复制下来，暂时保存在备忘录里。
4. 在手机上**强行停止 Mi Fitness**：长按 Mi Fitness 图标 → **应用信息** → **强行停止**。如使用 Gbox，也同样操作。不要再打开 Mi Fitness，否则它可能重新连接手环并生成新钥匙。
5. 删除电脑上的 `mifitness-log` 文件夹。钥匙相当于手环的密码，请勿分享。

## 第 5 步：安装 Gadgetbridge

1. 在手机上打开 [F-Droid 上的 Gadgetbridge](https://f-droid.org/packages/nodomain.freeyourgadget.gadgetbridge/)，点击 **Download APK**（最上面的版本）。
2. 打开下载的文件。如果手机拒绝安装，请为浏览器开启 **安装未知应用**，再打开一次。
3. 打开 Gadgetbridge，在提示时允许 **蓝牙**、**位置** 和 **通知** 权限。

> [!IMPORTANT]
> 不要使用 Play 商店的 "Bangle.js Gadgetbridge"，那是另一个版本。如果 Mi Fitness 在 Gbox 中，Gadgetbridge 仍要作为普通应用安装（不要装在 Gbox 里）。

## 第 6 步：把手环连接到 Gadgetbridge

1. 确认 Mi Fitness 仍处于强行停止状态，手环屏幕亮着。
2. 在 Gadgetbridge 中点击 **+**，等手环出现后选择 **Xiaomi Smart Band 9**。
3. 粘贴第 4 步的钥匙并继续。
4. 在手机上（有时只以**通知**形式出现）和手环上（点 ✓）接受配对请求。
5. 当 Gadgetbridge 中的手环卡片显示 **Connected（已连接）** 时即成功。

## 第 7 步：安装 KlikBand

**方式 A，使用电脑（最可靠）。** 把文件改名为 `KlikBand.rpk`，并移到命令窗口所在的文件夹：`platform-tools` 文件夹；如果 Mac 上的 adb 是用 Homebrew 安装的，则是你的个人（Home）文件夹。然后逐条输入下面两条命令：

```
adb push KlikBand.rpk /sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk
```

```
adb shell am start -a android.intent.action.VIEW -t application/octet-stream -d file:///sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk -n nodomain.freeyourgadget.gadgetbridge/.activities.install.FileInstallerActivity
```

手机上会打开 Gadgetbridge 的安装界面。

**方式 B，不用电脑。** 在手机上下载 `.rpk`，打开文件管理器，点击该文件，选择 **打开方式 → Gadgetbridge**。如果提示 "No compatible device found"，请改用方式 A。

在安装界面点击 **Install**，等待完成。

> [!NOTE]
> 红色的 "YOU ARE TRYING TO INSTALL A FIRMWARE" 是 Gadgetbridge 对所有非表盘文件显示的通用警告。只会发送应用，不会触碰手环固件。

## 第 8 步：在手环上打开 KlikBand

1. 在手环上打开应用列表，向下滚动，点击 **More（更多）**。
2. 点击 **KlikBand**。
3. 打开 KlikBand 的 **设置**，选择 **城市**（用于礼拜时间）和 **语言**。

完成！🎉

## 更新或卸载

- **更新：** 下载最新的 `.rpk`，只需重复**第 7 步**。
- **卸载：** Gadgetbridge → 手环卡片 → **App Manager**（网格图标）→ 长按 KlikBand → 删除。

## 常见问题

| 问题 | 解决方法 |
|---|---|
| `adb devices` 没有显示任何设备 | 检查数据线（必须能传输数据），在手机上选择 **传输文件**，并确认已开启 **USB 调试**。 |
| `adb devices` 显示 `unauthorized` | 查看手机屏幕，在 USB 调试提示中点 **允许**。 |
| 查找钥匙的命令没有输出 | 短暂打开 Mi Fitness 让手环同步，再强行停止，然后重做第 4 步。 |
| 打开 `.rpk` 时提示 "No compatible device found" | 使用第 7 步的方式 A，并确认手环在 Gadgetbridge 中显示 **Connected**。 |
| 设备被识别为 Bangle.js | 你装的是 Bangle.js Gadgetbridge。卸载它，改装 F-Droid 上的 Gadgetbridge。 |
| 没有配对请求 | 强行停止 Mi Fitness，保持手环屏幕亮着，并查看手机通知。 |
| 提示 "already bonded" 且配对失败 | 在 **Android 设置 → 蓝牙** 中删除手环（不是在 Mi Fitness 中），然后重试。 |
| 钥匙被拒绝 | Mi Fitness 重新连接并生成了新钥匙。重做第 4 步获取最新钥匙。 |
| 更新后应用图标没变 | 重启手环：**设置 → 系统 → 重启**。 |
| KlikBand 只在 "More" 中 | 这是正常的。手环不允许把额外应用移到主列表。 |

## 问答

**支持 iPhone 吗？** 暂不支持，因为 Gadgetbridge 只有 Android 版。

**手环会被 root 或刷机吗？** 不会。KlikBand 只是一个附加应用，不会改动手环系统。

**还能换回 Mi Fitness 吗？** 可以。在 Gadgetbridge 中删除手环，再在 Mi Fitness 中重新配对。以后想再换回 Gadgetbridge，需要从第 4 步重新开始，因为钥匙会改变。

**需要联网吗？** 不需要。KlikBand 的所有功能都在手环上离线运行。
