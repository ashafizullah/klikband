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
