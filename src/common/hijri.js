import storage from '@system.storage'

// Tabular (arithmetic) Hijri calendar. May differ by ±1 day from official
// dates, which are set month by month from moon sighting or local reckoning.

export function toHijri(date) {
  const jd = Math.floor(date.getTime() / 86400000 - date.getTimezoneOffset() / 1440) + 2440588
  let l = jd - 1948440 + 10632
  const n = Math.floor((l - 1) / 10631)
  l = l - 10631 * n + 354
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238)
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29
  const month = Math.floor((24 * l) / 709)
  return {
    day: l - Math.floor((709 * month) / 24),
    month,
    year: 30 * n + j - 30
  }
}

// Hijri date for `date` with the user's manual correction (days) applied
export function toHijriWithOffset(date, offset) {
  return toHijri(new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset))
}

// Manual correction of ±2 days to match the official calendar
export function loadHijriOffset(cb) {
  storage.get({
    key: 'hijriOffset',
    success: (data) => cb(parseInt(data, 10) || 0),
    fail: () => cb(0)
  })
}

export function saveHijriOffset(offset) {
  storage.set({ key: 'hijriOffset', value: String(offset) })
}
