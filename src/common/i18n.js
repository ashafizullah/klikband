// App languages: id (Indonesian), en (English), zh (Chinese).
// The choice is kept in storage; Indonesian is the default.
import storage from '@system.storage'

export const LANGUAGES = [
  { code: 'id', label: 'Indonesia' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' }
]

export function loadLanguage(cb) {
  storage.get({
    key: 'language',
    default: 'id',
    success: (data) => cb(STRINGS[data] ? data : 'id'),
    fail: () => cb('id')
  })
}

export function saveLanguage(code) {
  storage.set({ key: 'language', value: code })
}

export const STRINGS = {
  id: {
    islam: 'Islam',
    settings: 'Pengaturan',
    general: 'Umum',
    holidays: 'Hari Besar Islam',
    countdown: 'Hitung Hari',
    calendar: 'Kalender',
    legendHoliday: 'Hari besar Islam',
    legendFast: 'Puasa sunnah / Ramadhan',
    legendForbidden: 'Dilarang puasa',
    weekdaysShort: ['M', 'S', 'S', 'R', 'K', 'J', 'S'],
    add: 'Tambah',
    save: 'Simpan',
    remove: 'Hapus',
    daysLeft: 'hari lagi',
    daysAgo: 'hari lalu',
    isToday: 'Hari ini',
    empty: 'Belum ada tanggal',
    labelField: 'Nama',
    dayField: 'Tanggal',
    monthField: 'Bulan',
    yearField: 'Tahun',
    repeatField: 'Ulang',
    repeats: { none: 'Sekali', monthly: 'Tiap bulan', yearly: 'Tiap tahun' },
    labels: {
      birthday: 'Ulang tahun',
      anniversary: 'Pernikahan',
      payday: 'Gajian',
      holiday: 'Liburan',
      exam: 'Ujian',
      event: 'Acara',
      other: 'Lainnya'
    },
    holidayNames: {
      islamicNewYear: 'Tahun Baru Islam',
      ashura: 'Hari Asyura',
      mawlid: 'Maulid Nabi',
      isra: "Isra Mi'raj",
      ramadan: 'Awal Ramadhan',
      eidFitr: 'Idul Fitri',
      arafah: 'Hari Arafah',
      eidAdha: 'Idul Adha'
    },
    today: 'Hari Ini',
    dhikr: 'Dzikir Sholat',
    morningevening: 'Dzikir Pagi Petang',
    dhikrMorning: 'Dzikir Pagi',
    dhikrEvening: 'Dzikir Petang',
    morning: 'Pagi',
    evening: 'Petang',
    morningTime: 'Subuh – terbit matahari',
    eveningTime: 'Ashar – terbenam matahari',
    todayLabel: 'Hari ini',
    tomorrowLabel: 'Besok',
    fasting: 'Puasa',
    done: 'Selesai',
    repeat: 'Ulangi',
    next: 'Lanjut',
    fasts: {
      ramadan: 'Puasa Ramadhan',
      monday: 'Puasa Senin',
      thursday: 'Puasa Kamis',
      ayyamulBidh: 'Ayyamul Bidh',
      arafah: 'Puasa Arafah',
      tasua: "Puasa Tasu'a",
      ashura: 'Puasa Asyura',
      shawwal: 'Puasa Syawal',
      eid: 'Hari raya, dilarang puasa',
      tashriq: 'Hari Tasyrik, dilarang puasa',
      none: 'Tidak ada puasa sunnah'
    },
    about: 'Tentang',
    version: 'Versi',
    description: 'Aplikasi tambahan untuk Xiaomi Smart Band 9. Proyek komunitas, bukan produk resmi Xiaomi.',
    license: 'Lisensi',
    language: 'Bahasa',
    prayer: 'Jadwal Sholat',
    tasbih: 'Tasbih',
    hijri: 'Hijriah',
    asmaulhusna: 'Asmaul Husna',
    duas: 'Doa Harian',
    prayers: {
      imsak: 'Imsak',
      fajr: 'Subuh',
      sunrise: 'Terbit',
      dhuhr: 'Dzuhur',
      asr: 'Ashar',
      maghrib: 'Maghrib',
      isha: 'Isya'
    },
    in: 'dalam',
    city: 'Kota',
    hourUnit: 'j',
    minuteUnit: 'm',
    target: 'Target',
    reset: 'Reset',
    round: 'Putaran',
    day: 'hari',
    hijriNote: 'Koreksi jika beda dengan Kemenag',
    weekdays: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    hijriMonths: [
      'Muharram', 'Safar', "Rabi'ul Awal", "Rabi'ul Akhir", 'Jumadil Awal', 'Jumadil Akhir',
      'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'
    ]
  },
  en: {
    islam: 'Islam',
    settings: 'Settings',
    general: 'General',
    holidays: 'Islamic Holidays',
    countdown: 'Day Counter',
    calendar: 'Calendar',
    legendHoliday: 'Islamic holiday',
    legendFast: 'Sunnah / Ramadan fast',
    legendForbidden: 'Fasting not allowed',
    weekdaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    add: 'Add',
    save: 'Save',
    remove: 'Delete',
    daysLeft: 'days left',
    daysAgo: 'days ago',
    isToday: 'Today',
    empty: 'No dates yet',
    labelField: 'Label',
    dayField: 'Day',
    monthField: 'Month',
    yearField: 'Year',
    repeatField: 'Repeat',
    repeats: { none: 'Once', monthly: 'Monthly', yearly: 'Yearly' },
    labels: {
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      payday: 'Payday',
      holiday: 'Holiday',
      exam: 'Exam',
      event: 'Event',
      other: 'Other'
    },
    holidayNames: {
      islamicNewYear: 'Islamic New Year',
      ashura: 'Ashura',
      mawlid: 'Mawlid an-Nabi',
      isra: "Isra and Mi'raj",
      ramadan: 'Start of Ramadan',
      eidFitr: 'Eid al-Fitr',
      arafah: 'Day of Arafah',
      eidAdha: 'Eid al-Adha'
    },
    today: 'Today',
    dhikr: 'Post-prayer Dhikr',
    morningevening: 'Morning & Evening Dhikr',
    dhikrMorning: 'Morning Dhikr',
    dhikrEvening: 'Evening Dhikr',
    morning: 'Morning',
    evening: 'Evening',
    morningTime: 'Fajr – sunrise',
    eveningTime: 'Asr – sunset',
    todayLabel: 'Today',
    tomorrowLabel: 'Tomorrow',
    fasting: 'Fasting',
    done: 'Done',
    repeat: 'Repeat',
    next: 'Next',
    fasts: {
      ramadan: 'Ramadan fast',
      monday: 'Monday fast',
      thursday: 'Thursday fast',
      ayyamulBidh: 'Ayyamul Bidh (White Days)',
      arafah: 'Arafah fast',
      tasua: "Tasu'a fast",
      ashura: 'Ashura fast',
      shawwal: 'Shawwal fast',
      eid: 'Eid: fasting not allowed',
      tashriq: 'Tashriq: fasting not allowed',
      none: 'No sunnah fast'
    },
    about: 'About',
    version: 'Version',
    description: 'Extra apps for Xiaomi Smart Band 9. A community project, not an official Xiaomi product.',
    license: 'License',
    language: 'Language',
    prayer: 'Prayer Times',
    tasbih: 'Tasbih',
    hijri: 'Hijri Date',
    asmaulhusna: 'Asmaul Husna',
    duas: 'Daily Duas',
    prayers: {
      imsak: 'Imsak',
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha'
    },
    in: 'in',
    city: 'City',
    hourUnit: 'h',
    minuteUnit: 'm',
    target: 'Target',
    reset: 'Reset',
    round: 'Round',
    day: 'day',
    hijriNote: 'Adjust if it differs from your local calendar',
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    hijriMonths: [
      'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Ula', 'Jumada al-Akhirah',
      'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'
    ]
  },
  zh: {
    islam: '伊斯兰',
    general: '通用',
    holidays: '伊斯兰节日',
    countdown: '倒数日',
    calendar: '日历',
    legendHoliday: '伊斯兰节日',
    legendFast: '副功斋 / 斋月',
    legendForbidden: '禁止封斋',
    weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
    add: '添加',
    save: '保存',
    remove: '删除',
    daysLeft: '天后',
    daysAgo: '天前',
    isToday: '就是今天',
    empty: '暂无日期',
    labelField: '名称',
    dayField: '日',
    monthField: '月',
    yearField: '年',
    repeatField: '重复',
    repeats: { none: '一次', monthly: '每月', yearly: '每年' },
    labels: {
      birthday: '生日',
      anniversary: '纪念日',
      payday: '发薪日',
      holiday: '假期',
      exam: '考试',
      event: '活动',
      other: '其他'
    },
    holidayNames: {
      islamicNewYear: '伊斯兰新年',
      ashura: '阿舒拉日',
      mawlid: '圣纪节',
      isra: '登霄节',
      ramadan: '斋月开始',
      eidFitr: '开斋节',
      arafah: '阿拉法日',
      eidAdha: '古尔邦节'
    },
    today: '今日',
    dhikr: '礼拜后记念',
    morningevening: '早晚记念',
    dhikrMorning: '早晨记念',
    dhikrEvening: '傍晚记念',
    morning: '早晨',
    evening: '傍晚',
    morningTime: '晨礼至日出',
    eveningTime: '晡礼至日落',
    todayLabel: '今天',
    tomorrowLabel: '明天',
    fasting: '斋戒',
    done: '完成',
    repeat: '重来',
    next: '下一步',
    fasts: {
      ramadan: '斋月斋戒',
      monday: '周一副功斋',
      thursday: '周四副功斋',
      ayyamulBidh: '白日斋（13–15日）',
      arafah: '阿拉法日斋',
      tasua: '塔苏阿日斋',
      ashura: '阿舒拉日斋',
      shawwal: '闪瓦鲁月六日斋',
      eid: '节日，禁止封斋',
      tashriq: '晒肉日，禁止封斋',
      none: '无副功斋'
    },
    settings: '设置',
    about: '关于',
    version: '版本',
    description: '小米手环 9 扩展应用。社区项目，非小米官方产品。',
    license: '许可证',
    language: '语言',
    prayer: '礼拜时间',
    tasbih: '赞珠',
    hijri: '伊斯兰历',
    asmaulhusna: '真主九十九尊名',
    duas: '日常祈祷',
    prayers: {
      imsak: '封斋',
      fajr: '晨礼',
      sunrise: '日出',
      dhuhr: '晌礼',
      asr: '晡礼',
      maghrib: '昏礼',
      isha: '宵礼'
    },
    in: '还有',
    city: '城市',
    hourUnit: '时',
    minuteUnit: '分',
    target: '目标',
    reset: '重置',
    round: '轮',
    day: '天',
    hijriNote: '如与当地历法不同请调整',
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    hijriMonths: [
      '穆哈兰姆月', '色法尔月', '赖比尔·敖外鲁月', '赖比尔·阿色尼月', '主马达·敖外鲁月', '主马达·阿色尼月',
      '赖哲卜月', '舍尔邦月', '赖买丹月', '闪瓦鲁月', '都尔喀尔德月', '都尔黑哲月'
    ]
  }
}

// Short localized date, e.g. "Selasa, 20 Okt" / "Tuesday, 20 Oct" / "10月20日 星期二"
export function formatDate(t, date) {
  if (t === STRINGS.zh) return t.months[date.getMonth()] + date.getDate() + '日 ' + t.weekdays[date.getDay()]
  return t.weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + t.months[date.getMonth()]
}

// Countdown text, e.g. "dalam 2j 15m" / "in 2h 15m" / "还有 2时 15分"
export function formatDuration(t, minutes) {
  return t.in + ' ' + Math.floor(minutes / 60) + t.hourUnit + ' ' + (minutes % 60) + t.minuteUnit
}

// "110 hari lagi" / "19 hari lalu" / "Hari ini"
export function formatDays(t, days) {
  if (days === 0) return t.isToday
  return Math.abs(days) + ' ' + (days > 0 ? t.daysLeft : t.daysAgo)
}

// "8 Feb 2027" / "2027年2月8日" style date
export function formatFullDate(t, date) {
  if (t === STRINGS.zh) return date.getFullYear() + '年' + t.months[date.getMonth()] + date.getDate() + '日'
  return date.getDate() + ' ' + t.months[date.getMonth()] + ' ' + date.getFullYear()
}
