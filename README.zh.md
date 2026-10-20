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

在 Android 上通过 [Gadgetbridge](https://gadgetbridge.org/) 侧载 `.rpk` 文件：

1. 先用小米运动健康（Mi Fitness）配对手环，然后获取手环的 auth key（[说明](https://gadgetbridge.org/gadgets/wearables/xiaomi/)）。之后不要在 Mi Fitness 中解除配对。
2. 强制停止 Mi Fitness，然后在 Gadgetbridge 中用该 auth key 添加手环。
3. 用 Gadgetbridge 打开 `.rpk` 文件并点击 **Install**。

通过 USB 用 `adb` 安装时，请将文件放到 Gadgetbridge 自己的目录中，以便其读取：

```
adb push dist/*.rpk /sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk
adb shell am start -a android.intent.action.VIEW -t application/octet-stream \
  -d file:///sdcard/Android/data/nodomain.freeyourgadget.gadgetbridge/files/KlikBand.rpk \
  -n nodomain.freeyourgadget.gadgetbridge/.activities.install.FileInstallerActivity
```

以这种方式安装的应用，手环会显示默认图标。

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
