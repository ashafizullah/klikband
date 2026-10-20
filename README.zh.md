# KlikBand

[English](README.md) | [Bahasa Indonesia](README.id.md) | **中文**

适用于 **小米手环 9** 的 Xiaomi Vela 快应用。社区项目，与小米无关。

## 功能

- **伊斯兰**
  - **今日**：公历和伊斯兰历日期、下一次礼拜，以及今明两天的副功斋
  - **礼拜后记念**：按 [Rumaysho](https://rumaysho.com/1997-dzikir-setelah-shalat.html) 顺序引导计数
  - **早晚记念**：按 [Almanhaj](https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html) 顺序引导计数
  - **礼拜时间**：采用印度尼西亚宗教部（Kemenag）算法，在手环上离线计算
  - **赞珠**：点按计数，可设 33/99/100 目标，并有振动提示
  - **伊斯兰历**：算术伊斯兰历，可手动校正 ±2 天
  - **伊斯兰节日**：8 个伊斯兰节日倒计时，按远近排序
  - **真主九十九尊名**：99 个尊名及其含义
  - **日常祈祷**：常用短祈祷词的拉丁转写及含义
- **通用**
  - **倒数日**：距离或自某个日期的天数，可按月或按年重复
- **设置**：城市（印度尼西亚 46 个城市，WIB/WITA/WIT 时区）和语言（印尼语、英语、中文）

## 限制

小米手环 9 没有 GPS，小米也未在该手环上开放定位（`system.geolocation`）和网络（`system.fetch`）接口。所有功能均离线运行，城市需手动选择。

## 构建

需要 Node.js。

```
npm install
npm run build      # 输出：dist/*.rpk
```

## 安装到手环

KlikBand 不是固件：安装它不会刷写或修改手环系统。它是一个快应用（`.rpk`），通过 Android 上的开源配套应用 [Gadgetbridge](https://gadgetbridge.org/) 侧载安装。已在小米手环 9（国际版）上用 Gadgetbridge 0.95.1 测试。

### 准备

- 一部 **Android** 手机。不支持 iPhone，因为 Gadgetbridge 只有 Android 版。
- **小米运动健康（Mi Fitness）**，仅用于获取手环的 auth key。
- 一台装有 [`adb`](https://developer.android.com/tools/adb) 的电脑和 USB 数据线，用于读取 key 和复制文件。macOS 上：`brew install android-platform-tools`。
- `KlikBand.rpk` 文件：从 [Releases](https://github.com/ashafizullah/klikband/releases/latest) 下载，或自行[构建](#构建)。

### 1. 用 Mi Fitness 配对手环

照常在 Mi Fitness 中配对手环并完成同步。**之后不要在 Mi Fitness 中解除配对**，否则 auth key 会被清除。

### 2. 获取 auth key

1. 在手机上打开 **开发者选项 → USB 调试**，并连接电脑。
2. 复制 Mi Fitness 日志并查找 key：

   ```
   adb pull /sdcard/Android/data/com.xiaomi.wearable/files/log ./mifitness-log
   grep -rhoaE 'encryptKey": "[0-9a-f]{32}' ./mifitness-log | tail -1
   ```

   如果 Mi Fitness 运行在 **Gbox** 中（没有谷歌服务的华为/荣耀手机），日志位于
   `/sdcard/Android/data/com.gbox.android/_root/sdcard/Android/data/com.xiaomi.wearable/files/log`。
3. 使用 **最后一个** 32 位字符的值。Mi Fitness 每次重新配对，key 都会改变，请取最新的。
4. **强制停止 Mi Fitness**（如使用 Gbox，也一并停止）并保持关闭，否则它会重新连接手环并生成新的 key。
5. 删除复制出来的日志；这个 key 相当于手环的密码。

### 3. 安装 Gadgetbridge

从 [F-Droid](https://f-droid.org/packages/nodomain.freeyourgadget.gadgetbridge/) 安装 **Gadgetbridge**，作为普通应用安装（不要装在 Gbox 里）。不要使用 Play 商店的 "Bangle.js Gadgetbridge"，那是另一个版本。按提示授予蓝牙、位置和通知权限。

### 4. 连接手环

1. 在 Gadgetbridge 中点 **+**，选择 **Xiaomi Smart Band 9**，输入 auth key。
2. 在手机上（可能只以**通知**形式出现）和手环上（点 ✓）同意配对请求。
3. 如果 Gadgetbridge 提示设备 "already bonded" 且配对失败，请在 **Android 设置 → 蓝牙** 中删除手环（不是在 Mi Fitness 中），然后重试。仍失败时，请重新获取 key（第 2 步），因为 Mi Fitness 可能已重新连接。

### 5. 安装 KlikBand

Gadgetbridge 无法直接读取"下载"文件夹中的文件，请把 `.rpk` 放到 Gadgetbridge 自己的目录并从那里打开：

```
adb push KlikBand.rpk /sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk
adb shell am start -a android.intent.action.VIEW -t application/octet-stream \
  -d file:///sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk \
  -n nodomain.freeyourgadget.gadgetbridge/.activities.install.FileInstallerActivity
```

没有电脑时，也可以在文件管理器中用 **打开方式 → Gadgetbridge** 打开 `.rpk`。

点 **Install**。红色的 "YOU ARE TRYING TO INSTALL A FIRMWARE" 是 Gadgetbridge 对所有非表盘文件显示的通用警告；发送的只是应用，不会改动固件。

之后 KlikBand 会出现在手环应用列表的 **更多（More）** 中。

### 更新或卸载

- **更新：** 用同样的方法安装新的 `.rpk`。`src/manifest.json` 中的 `versionCode` 必须高于已安装版本。
- **卸载：** Gadgetbridge → 设备卡片 → **App Manager**（方格图标）→ 长按 KlikBand → 删除。

### 常见问题

| 问题 | 解决方法 |
|---|---|
| 打开 `.rpk` 时显示 "No compatible device found" | Gadgetbridge 无法读取该文件。把它复制到 Gadgetbridge 的目录（第 5 步），并确认手环显示 **Connected**。 |
| 设备被识别为 Bangle.js | 你安装的是 Bangle.js Gadgetbridge，请改装 F-Droid 版 Gadgetbridge。 |
| 没有配对提示 | 强制停止 Mi Fitness，保持手环屏幕亮起，并查看手机通知。 |
| auth key 被拒绝 | Mi Fitness 重新配对并生成了新 key，请重新获取最新的 key（第 2 步）。 |
| 应用图标没有更新 | 重启手环：**设置 → 系统 → 重启**。 |
| KlikBand 在"更多"中 | 手环不允许把侧载应用移到主列表。 |

## 项目结构

```
src/
├── manifest.json        # 应用信息和页面路由
├── common/
│   ├── i18n.js          # 界面文字（id、en、zh）和语言设置
│   ├── prayer.js        # 礼拜时间计算
│   ├── hijri.js         # 伊斯兰历换算
│   ├── cities.js        # 城市列表和城市设置
│   ├── asmaulhusna.js   # 九十九尊名数据
│   ├── duas.js          # 日常祈祷数据
│   ├── dhikr.js         # 礼拜后记念
│   ├── dhikrmorningevening.js  # 早晚记念
│   ├── fasting.js       # 副功斋与禁斋日
│   ├── holidays.js      # 伊斯兰节日日期
│   ├── countdown.js     # 倒数日数据与日期计算
│   ├── text.js          # 长标签滚动显示辅助函数
│   └── icons/           # 菜单图标
└── pages/               # 每个页面一个文件夹
```

如需更改默认城市，请修改 `src/common/cities.js` 中的第一项。

## 许可证

[MIT](LICENSE)
