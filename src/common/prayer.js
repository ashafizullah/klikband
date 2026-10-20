// Perhitungan jadwal sholat metode Kemenag RI (Subuh 20°, Isya 18°, Ashar Syafi'i)
// Dihitung lokal di band, tanpa internet.

export const LOKASI = {
  nama: 'Jakarta',
  lat: -6.2088,
  lng: 106.8456,
  tz: 7
}

const IHTIYAT = 2 // menit kehati-hatian, sesuai praktik Kemenag
const SUDUT_SUBUH = 20
const SUDUT_ISYA = 18

const rad = (d) => (d * Math.PI) / 180
const deg = (r) => (r * 180) / Math.PI

function julianDay(y, m, d) {
  if (m <= 2) {
    y -= 1
    m += 12
  }
  const a = Math.floor(y / 100)
  const b = 2 - a + Math.floor(a / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5
}

// Deklinasi matahari dan equation of time (jam) untuk Julian Day jd
function posisiMatahari(jd) {
  const D = jd - 2451545.0
  const g = rad((357.529 + 0.98560028 * D) % 360)
  const q = (280.459 + 0.98564736 * D) % 360
  const L = rad((q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360)
  const e = rad(23.439 - 0.00000036 * D)
  const ra = deg(Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L))) / 15
  const eqt = q / 15 - ((ra % 24) + 24) % 24
  return {
    dekl: Math.asin(Math.sin(e) * Math.sin(L)),
    eqt: ((eqt + 12) % 24 + 24) % 24 - 12
  }
}

// Selisih jam dari tengah hari saat matahari berada di ketinggian `alt` (derajat)
function sudutJam(alt, lat, dekl) {
  const cos = (Math.sin(rad(alt)) - Math.sin(lat) * Math.sin(dekl)) / (Math.cos(lat) * Math.cos(dekl))
  return deg(Math.acos(Math.min(1, Math.max(-1, cos)))) / 15
}

// Mengembalikan menit sejak 00:00 waktu lokal untuk tiap waktu sholat
export function hitungJadwal(tanggal, lokasi = LOKASI) {
  const jd = julianDay(tanggal.getFullYear(), tanggal.getMonth() + 1, tanggal.getDate()) - lokasi.lng / 360
  const { dekl, eqt } = posisiMatahari(jd + 0.5)
  const lat = rad(lokasi.lat)
  const dzuhur = 12 + lokasi.tz - lokasi.lng / 15 - eqt

  const altAshar = deg(Math.atan(1 / (1 + Math.tan(Math.abs(lat - dekl)))))
  const terbenam = sudutJam(-0.8333, lat, dekl)

  const jam = {
    subuh: dzuhur - sudutJam(-SUDUT_SUBUH, lat, dekl),
    terbit: dzuhur - terbenam,
    dzuhur: dzuhur,
    ashar: dzuhur + sudutJam(altAshar, lat, dekl),
    maghrib: dzuhur + terbenam,
    isya: dzuhur + sudutJam(-SUDUT_ISYA, lat, dekl)
  }

  const menit = {}
  Object.keys(jam).forEach((k) => {
    const tambah = k === 'terbit' ? -IHTIYAT : IHTIYAT
    menit[k] = Math.ceil(jam[k] * 60 + tambah)
  })
  menit.imsak = menit.subuh - 10
  return menit
}

export const URUTAN = ['imsak', 'subuh', 'terbit', 'dzuhur', 'ashar', 'maghrib', 'isya']

export function formatMenit(m) {
  const j = Math.floor(m / 60) % 24
  const n = m % 60
  return (j < 10 ? '0' : '') + j + ':' + (n < 10 ? '0' : '') + n
}
