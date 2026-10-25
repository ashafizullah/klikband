// Prayer times using the Indonesian Ministry of Religious Affairs (Kemenag) method:
// Fajr 20°, Isha 18°, Shafi'i Asr. Computed on the band, no internet needed.
// Sun position: the US Naval Observatory's "Approximate Solar Coordinates" formulas;
// Julian day: Meeus, Astronomical Algorithms.

const IHTIYAT = 2 // safety margin in minutes, as used by Kemenag
const FAJR_ANGLE = 20
const ISHA_ANGLE = 18

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

// Sun declination and equation of time (hours) for Julian Day jd
function sunPosition(jd) {
  const D = jd - 2451545.0
  const g = rad((357.529 + 0.98560028 * D) % 360)
  const q = (280.459 + 0.98564736 * D) % 360
  const L = rad((q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360)
  const e = rad(23.439 - 0.00000036 * D)
  const ra = deg(Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L))) / 15
  const eqt = q / 15 - ((ra % 24) + 24) % 24
  return {
    decl: Math.asin(Math.sin(e) * Math.sin(L)),
    eqt: ((eqt + 12) % 24 + 24) % 24 - 12
  }
}

// Hours from solar noon until the sun reaches altitude `alt` (degrees)
function hourAngle(alt, lat, decl) {
  const cos = (Math.sin(rad(alt)) - Math.sin(lat) * Math.sin(decl)) / (Math.cos(lat) * Math.cos(decl))
  return deg(Math.acos(Math.min(1, Math.max(-1, cos)))) / 15
}

// Where the sun is now: azimuth in degrees clockwise from true north, and
// altitude in degrees above the horizon
export function sunDirection(date, location) {
  const ms = date.getTime()
  const { decl, eqt } = sunPosition(ms / 86400000 + 2440587.5)
  const solarHours = ((ms / 3600000) % 24) + location.lng / 15 + eqt
  const h = rad((solarHours - 12) * 15)
  const lat = rad(location.lat)
  const alt = Math.asin(Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(h))
  const az = deg(Math.atan2(Math.sin(h), Math.cos(h) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat))) + 180
  return { azimuth: Math.round(((az % 360) + 360) % 360), altitude: deg(alt) }
}

// Returns minutes since local midnight for each prayer time.
// location: { lat, lng, tz } from common/cities.js
export function prayerTimes(date, location) {
  const jd = julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate()) - location.lng / 360
  const { decl, eqt } = sunPosition(jd + 0.5)
  const lat = rad(location.lat)
  const dhuhr = 12 + location.tz - location.lng / 15 - eqt

  const asrAlt = deg(Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl)))))
  const sunset = hourAngle(-0.8333, lat, decl)

  const hours = {
    fajr: dhuhr - hourAngle(-FAJR_ANGLE, lat, decl),
    sunrise: dhuhr - sunset,
    dhuhr: dhuhr,
    asr: dhuhr + hourAngle(asrAlt, lat, decl),
    maghrib: dhuhr + sunset,
    isha: dhuhr + hourAngle(-ISHA_ANGLE, lat, decl)
  }

  const minutes = {}
  Object.keys(hours).forEach((k) => {
    const margin = k === 'sunrise' ? -IHTIYAT : IHTIYAT
    minutes[k] = Math.ceil(hours[k] * 60 + margin)
  })
  minutes.imsak = minutes.fajr - 10
  return minutes
}

export const PRAYER_ORDER = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

// The next prayer from `now`. After Isha it rolls over to tomorrow's schedule,
// so `times` always holds the day that contains the next prayer.
export function nextPrayer(now, location) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  let day = now
  let times = prayerTimes(day, location)
  let key = PRAYER_ORDER.find((k) => k !== 'sunrise' && times[k] > nowMinutes)
  if (!key) {
    day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    times = prayerTimes(day, location)
    key = 'fajr'
  }
  return { key, day, times, nowMinutes, tomorrow: day !== now }
}

// Moment a prayer starts: `minutes` after midnight of `day`
export function prayerDate(day, minutes) {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes)
}

export function formatMinutes(m) {
  const h = Math.floor(m / 60) % 24
  const min = m % 60
  return (h < 10 ? '0' : '') + h + ':' + (min < 10 ? '0' : '') + min
}
