import { prayerTimes } from './prayer.js'

// Fasting days from the Hijri date and weekday.
// Returns keys of STRINGS[lang].fasts for `date`; `hijri` comes from common/hijri.js.
export function fastsFor(date, hijri) {
  const { day, month } = hijri

  if (month === 9) return ['ramadan']
  if ((month === 10 && day === 1) || (month === 12 && day === 10)) return ['eid']
  if (month === 12 && day >= 11 && day <= 13) return ['tashriq']

  const fasts = []
  if (month === 12 && day === 9) fasts.push('arafah')
  if (month === 1 && day === 9) fasts.push('tasua')
  if (month === 1 && day === 10) fasts.push('ashura')
  if (day >= 13 && day <= 15) fasts.push('ayyamulBidh')
  if (month === 10) fasts.push('shawwal')
  if (date.getDay() === 1) fasts.push('monday')
  if (date.getDay() === 4) fasts.push('thursday')
  return fasts.length ? fasts : ['none']
}

// The main fast among keys from fastsFor(), without a note in brackets such
// as "(White Days)", for one-line labels
export function fastName(t, keys) {
  return t.fasts[keys[0]].replace(/\s*[(（].*[)）]/, '')
}

// Whether keys from fastsFor() name a fast to keep
export function isFastDay(keys) {
  return keys[0] !== 'none' && keys[0] !== 'eid' && keys[0] !== 'tashriq'
}

// The moment a fast counts down to: Imsak before it starts, Maghrib (iftar)
// while fasting, and from Maghrib the evening before a fast, the next Imsak.
// Returns { key, day, minutes } with `minutes` since `day`'s midnight, or null.
export function fastMoment(now, location, todayKeys, tomorrowKeys) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const times = prayerTimes(now, location)
  if (isFastDay(todayKeys) && nowMinutes < times.maghrib) {
    if (nowMinutes < times.imsak) return { key: 'imsak', day: now, minutes: times.imsak }
    return { key: 'iftar', day: now, minutes: times.maghrib }
  }
  if (isFastDay(tomorrowKeys) && nowMinutes >= times.maghrib) {
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    return { key: 'imsak', day: tomorrow, minutes: prayerTimes(tomorrow, location).imsak }
  }
  return null
}
