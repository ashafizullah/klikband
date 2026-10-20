// Islamic holidays by Hijri month/day; dates follow the tabular calendar (may be ±1 day).
import { toHijriWithOffset } from './hijri.js'

export const HOLIDAYS = [
  { key: 'islamicNewYear', month: 1, day: 1 },
  { key: 'ashura', month: 1, day: 10 },
  { key: 'mawlid', month: 3, day: 12 },
  { key: 'isra', month: 7, day: 27 },
  { key: 'ramadan', month: 9, day: 1 },
  { key: 'eidFitr', month: 10, day: 1 },
  { key: 'arafah', month: 12, day: 9 },
  { key: 'eidAdha', month: 12, day: 10 }
]

// Next date of every holiday from `today`, nearest first.
// Scans day by day for up to ~one Hijri year (355 days).
export function upcomingHolidays(today, offset) {
  const found = {}
  for (let i = 0; i < 360 && Object.keys(found).length < HOLIDAYS.length; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    const h = toHijriWithOffset(date, offset)
    HOLIDAYS.forEach((hol) => {
      if (!found[hol.key] && h.month === hol.month && h.day === hol.day) {
        found[hol.key] = { key: hol.key, date, hijri: h, days: i }
      }
    })
  }
  return Object.keys(found)
    .map((k) => found[k])
    .sort((a, b) => a.days - b.days)
}
