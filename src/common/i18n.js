// Bahasa aplikasi: id (Indonesia), en (English), zh (中文)
// Pilihan disimpan di storage, default Indonesia.
import storage from '@system.storage'

export const BAHASA = [
  { kode: 'id', label: 'Indonesia' },
  { kode: 'en', label: 'English' },
  { kode: 'zh', label: '中文' }
]

export function muatBahasa(cb) {
  storage.get({
    key: 'bahasa',
    success: (data) => cb(TEKS[data] ? data : 'id'),
    fail: () => cb('id')
  })
}

export function simpanBahasa(kode) {
  storage.set({ key: 'bahasa', value: kode })
}

export const TEKS = {
  id: {
    islam: 'Islam',
    pengaturan: 'Pengaturan',
    bahasa: 'Bahasa',
    sholat: 'Jadwal Sholat',
    tasbih: 'Tasbih',
    hijriah: 'Hijriah',
    asmaul: 'Asmaul Husna',
    doa: 'Doa Harian',
    waktu: {
      imsak: 'Imsak',
      subuh: 'Subuh',
      terbit: 'Terbit',
      dzuhur: 'Dzuhur',
      ashar: 'Ashar',
      maghrib: 'Maghrib',
      isya: 'Isya'
    },
    lokasi: 'Jakarta',
    jam: 'j',
    menit: 'm',
    target: 'Target',
    reset: 'Reset',
    putaran: 'Putaran',
    hari: 'hari',
    koreksiCatatan: 'Koreksi jika beda dengan Kemenag',
    namaHari: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    namaBulan: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    bulanHijriah: [
      'Muharram', 'Safar', "Rabi'ul Awal", "Rabi'ul Akhir", 'Jumadil Awal', 'Jumadil Akhir',
      'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'
    ]
  },
  en: {
    islam: 'Islam',
    pengaturan: 'Settings',
    bahasa: 'Language',
    sholat: 'Prayer Times',
    tasbih: 'Tasbih',
    hijriah: 'Hijri Date',
    asmaul: 'Asmaul Husna',
    doa: 'Daily Duas',
    waktu: {
      imsak: 'Imsak',
      subuh: 'Fajr',
      terbit: 'Sunrise',
      dzuhur: 'Dhuhr',
      ashar: 'Asr',
      maghrib: 'Maghrib',
      isya: 'Isha'
    },
    lokasi: 'Jakarta',
    jam: 'h',
    menit: 'm',
    target: 'Target',
    reset: 'Reset',
    putaran: 'Round',
    hari: 'day',
    koreksiCatatan: 'Adjust if it differs from your local calendar',
    namaHari: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    namaBulan: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    bulanHijriah: [
      'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Ula', 'Jumada al-Akhirah',
      'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'
    ]
  },
  zh: {
    islam: '伊斯兰',
    pengaturan: '设置',
    bahasa: '语言',
    sholat: '礼拜时间',
    tasbih: '赞珠',
    hijriah: '伊斯兰历',
    asmaul: '真主九十九尊名',
    doa: '日常祈祷',
    waktu: {
      imsak: '封斋',
      subuh: '晨礼',
      terbit: '日出',
      dzuhur: '晌礼',
      ashar: '晡礼',
      maghrib: '昏礼',
      isya: '宵礼'
    },
    lokasi: '雅加达',
    jam: '时',
    menit: '分',
    target: '目标',
    reset: '重置',
    putaran: '轮',
    hari: '天',
    koreksiCatatan: '如与当地历法不同请调整',
    namaHari: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    namaBulan: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    bulanHijriah: [
      '穆哈兰姆月', '色法尔月', '赖比尔·敖外鲁月', '赖比尔·阿色尼月', '主马达·敖外鲁月', '主马达·阿色尼月',
      '赖哲卜月', '舍尔邦月', '赖买丹月', '闪瓦鲁月', '都尔喀尔德月', '都尔黑哲月'
    ]
  }
}

// Format tanggal pendek sesuai bahasa, misal "Selasa, 20 Okt" / "10月20日 星期二"
export function formatTanggal(t, tgl) {
  if (t === TEKS.zh) return t.namaBulan[tgl.getMonth()] + tgl.getDate() + '日 ' + t.namaHari[tgl.getDay()]
  return t.namaHari[tgl.getDay()] + ', ' + tgl.getDate() + ' ' + t.namaBulan[tgl.getMonth()]
}
