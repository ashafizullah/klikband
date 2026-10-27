// Prayer times, computed on the band with no internet needed. The default is the
// Indonesian Ministry of Religious Affairs (Kemenag) method: Fajr 20°, Isha 18°,
// Shafi'i Asr; locations outside Indonesia can use another method below.
// Sun position: the US Naval Observatory's "Approximate Solar Coordinates" formulas;
// Julian day: Meeus, Astronomical Algorithms.

import { toHijri } from './hijri.js'

// Fajr and Isha sun angles (degrees below the horizon), or Isha as minutes
// after Maghrib (longer in Ramadan for Umm al-Qura), and the safety margin in
// minutes (ihtiyat, used by Kemenag)
export const CALC_METHODS = {
  kemenag: { fajr: 20, isha: 18, margin: 2 },
  mwl: { fajr: 18, isha: 17, margin: 0 },
  ummalqura: { fajr: 18.5, ishaMinutes: 90, ramadanIshaMinutes: 120, margin: 0 },
  isna: { fajr: 15, isha: 15, margin: 0 }
}
export const CALC_METHOD_ORDER = ['kemenag', 'mwl', 'ummalqura', 'isna']

// Methods offered by 1.25.0 and since dropped; a place that used one moves to
// the Muslim World League, the closest general method
export const DROPPED_METHODS = ['egypt', 'karachi', 'dubai']

// Asr starts when a shadow is its object's length (Shafi'i, Maliki, Hanbali)
// or twice that (Hanafi) plus the noon shadow
export const ASR_SHADOWS = { shafii: 1, hanafi: 2 }

// Dhuha starts once the sun is this high (degrees), as in Indonesian schedules
const DHUHA_ALTITUDE = 4.5
// Minutes before Dhuhr counted as the sun standing at its zenith, when prayer is not allowed
const ZENITH_MARGIN = 10

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

// Hours from solar noon until the sun reaches altitude `alt` (degrees). Far from
// the equator the sun may never get that low; then this is NaN when `strict`,
// and the nearest reachable time otherwise.
function hourAngle(alt, lat, decl, strict) {
  const cos = (Math.sin(rad(alt)) - Math.sin(lat) * Math.sin(decl)) / (Math.cos(lat) * Math.cos(decl))
  if (strict && (cos < -1 || cos > 1)) return NaN
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

// UTC offset in hours used for `date`. A location sent from the phone carries
// its offset when it was picked; the band's own clock follows daylight saving
// there, so its offset is used when it is within an hour of that one.
export function locationOffset(date, location) {
  if (!location.custom) return location.tz
  // At noon, since clocks change in the early hours
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
  const own = -noon.getTimezoneOffset() / 60
  return isFinite(own) && Math.abs(own - location.tz) <= 1 ? own : location.tz
}

// A place from the phone may be in another time zone than the band clock (a
// trip being planned). Its schedule is read in the place's own time: placeNow()
// is a Date whose local fields show the time there, and realTime() turns such
// a Date back into the true moment, for countdowns and alerts. Indonesian
// cities keep the band clock, as before.
// Within an hour of the place's offset the band is taken to be there (the hour
// being daylight saving), and its clock is used as is
function elsewhere(location, date) {
  if (!location.custom) return false
  const own = -date.getTimezoneOffset() / 60
  return isFinite(own) && Math.abs(own - location.tz) > 1
}

export function placeNow(location) {
  const now = new Date()
  if (!elsewhere(location, now)) return now
  const there = new Date(now.getTime() + location.tz * 3600000)
  return new Date(there.getUTCFullYear(), there.getUTCMonth(), there.getUTCDate(),
    there.getUTCHours(), there.getUTCMinutes(), there.getUTCSeconds(), there.getUTCMilliseconds())
}

export function realTime(placeDate, location) {
  if (!elsewhere(location, new Date())) return placeDate.getTime()
  return Date.UTC(placeDate.getFullYear(), placeDate.getMonth(), placeDate.getDate(),
    placeDate.getHours(), placeDate.getMinutes(), placeDate.getSeconds()) - location.tz * 3600000
}

// Returns minutes since local midnight for each prayer time.
// location: { lat, lng, tz, method, asr } from common/cities.js
// Pages ask for the same day several times a minute, so the last few days are
// kept; the returned object is shared and must not be changed.
const CACHE_SIZE = 4
const cache = {}
const cacheOrder = []

export function prayerTimes(date, location) {
  const tz = locationOffset(date, location)
  const key = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' +
    location.lat + ',' + location.lng + ',' + tz + ',' + location.method + ',' + location.asr
  if (!cache[key]) {
    if (cacheOrder.length >= CACHE_SIZE) delete cache[cacheOrder.shift()]
    cacheOrder.push(key)
    cache[key] = computeTimes(date, location, tz)
  }
  return cache[key]
}

function computeTimes(date, location, tz) {
  const method = CALC_METHODS[location.method] || CALC_METHODS.kemenag
  const jd = julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate()) - location.lng / 360
  const { decl, eqt } = sunPosition(jd + 0.5)
  const lat = rad(location.lat)
  const dhuhr = 12 + tz - location.lng / 15 - eqt

  const shadow = ASR_SHADOWS[location.asr] || ASR_SHADOWS.shafii
  const asrAlt = deg(Math.atan(1 / (shadow + Math.tan(Math.abs(lat - decl)))))
  const sunset = hourAngle(-0.8333, lat, decl)

  // Far from the equator the sky may not get dark enough for Fajr and Isha by
  // their angles (summer in northern Europe). Then each is kept within its
  // share of the night (angle / 60), the twilight-angle rule. Nearer the
  // equator the angles always fall inside that share, so nothing changes.
  const night = 24 - 2 * sunset
  const fajrAngle = hourAngle(-method.fajr, lat, decl, true)
  const fajrShare = (method.fajr / 60) * night
  const fajr = !(fajrAngle >= sunset) || fajrAngle - sunset > fajrShare ? sunset + fajrShare : fajrAngle
  let isha
  if (method.ishaMinutes) {
    // Ramadan by the arithmetic calendar, without the Hijri correction from Settings
    const ramadan = method.ramadanIshaMinutes && toHijri(date).month === 9
    isha = sunset + (ramadan ? method.ramadanIshaMinutes : method.ishaMinutes) / 60
  } else {
    const ishaAngle = hourAngle(-method.isha, lat, decl, true)
    const ishaShare = (method.isha / 60) * night
    isha = !(ishaAngle >= sunset) || ishaAngle - sunset > ishaShare ? sunset + ishaShare : ishaAngle
  }

  const hours = {
    fajr: dhuhr - fajr,
    sunrise: dhuhr - sunset,
    dhuha: dhuhr - hourAngle(DHUHA_ALTITUDE, lat, decl),
    dhuhr: dhuhr,
    asr: dhuhr + hourAngle(asrAlt, lat, decl),
    maghrib: dhuhr + sunset,
    isha: dhuhr + isha
  }

  const minutes = {}
  Object.keys(hours).forEach((k) => {
    const margin = k === 'sunrise' ? -method.margin : method.margin
    minutes[k] = Math.ceil(hours[k] * 60 + margin)
  })
  minutes.imsak = minutes.fajr - 10
  return minutes
}

export const PRAYER_ORDER = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

// Voluntary prayer windows and the times prayer is not allowed on `date`, in
// minutes since its midnight. Prayer is not allowed after Fajr prayer until the
// sun is up, while the sun stands at its zenith, and after Asr prayer until sunset.
export function sunnahTimes(date, location) {
  const times = prayerTimes(date, location)
  const zenith = times.dhuhr - ZENITH_MARGIN
  return {
    dhuha: [times.dhuha, zenith],
    afterFajr: [times.fajr, times.dhuha],
    zenith: [zenith, times.dhuhr],
    afterAsr: [times.asr, times.maghrib]
  }
}

// The last third of the night under way or coming next, the best time for
// Tahajjud. The night runs from Maghrib to Fajr, so before today's Fajr it is
// the night that began yesterday. Returns that evening and the third's start
// and end in minutes since the evening's midnight (past 1440 after midnight).
export function lastThirdOfNight(now, location) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const shift = nowMinutes < prayerTimes(now, location).fajr ? -1 : 0
  const evening = new Date(now.getFullYear(), now.getMonth(), now.getDate() + shift)
  const morning = new Date(now.getFullYear(), now.getMonth(), now.getDate() + shift + 1)
  const dusk = prayerTimes(evening, location).maghrib
  const dawn = prayerTimes(morning, location).fajr + 1440
  return { evening, range: [dawn - Math.floor((dawn - dusk) / 3), dawn] }
}

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

// A prayer's name on `day`: on Fridays Dhuhr is Jumu'ah, named in full unless
// `short` is set for the places too narrow for it
export function prayerName(t, key, day, short) {
  if (key !== 'dhuhr' || day.getDay() !== 5) return t.prayers[key]
  return short ? t.jumuah : t.jumuahPrayer
}

export function formatMinutes(m, format) {
  const h = Math.floor(m / 60) % 24
  const min = m % 60
  // The 12-hour clock drops the leading zero and leaves AM/PM out: next to
  // a prayer's name the time is clear without it
  const hours = format === '12h' ? String(h % 12 || 12) : (h < 10 ? '0' : '') + h
  return hours + ':' + (min < 10 ? '0' : '') + min
}
