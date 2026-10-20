// Month grid for the calendar page: Gregorian days with their Hijri date,
// Islamic holidays and fasting days. Weeks start on Sunday.
import { toHijriWithOffset } from './hijri.js'
import { HOLIDAYS } from './holidays.js'
import { fastsFor } from './fasting.js'

// Weekly or month-long fasts that are not marked on the grid (too many)
const UNMARKED_FASTS = ['monday', 'thursday', 'shawwal', 'none']

function holidayFor(hijri) {
  const found = HOLIDAYS.filter((h) => h.month === hijri.month && h.day === hijri.day)
  return found.length ? found[0].key : ''
}

// Everything shown for one date: Hijri date, holiday key and fasting keys
export function dayInfo(date, offset) {
  const hijri = toHijriWithOffset(date, offset)
  return { date, hijri, holiday: holidayFor(hijri), fasts: fastsFor(date, hijri) }
}

// Weeks of `month` (0-11) in `year`; days outside the month are empty cells.
// Each cell: { day, hijriDay, today, sunday, holiday, fast } where `fast` is
// '' | 'fast' | 'forbidden'.
export function monthGrid(year, month, offset, today) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first.getDay(); i++) cells.push({ day: 0 })

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const info = dayInfo(date, offset)
    let fast = ''
    if (info.fasts[0] === 'eid' || info.fasts[0] === 'tashriq') fast = 'forbidden'
    else if (info.fasts.some((f) => UNMARKED_FASTS.indexOf(f) < 0)) fast = 'fast'
    cells.push({
      day: d,
      hijriDay: info.hijri.day,
      today:
        d === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
      sunday: date.getDay() === 0,
      holiday: info.holiday !== '',
      fast
    })
  }

  while (cells.length % 7) cells.push({ day: 0 })
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push({ cells: cells.slice(i, i + 7) })
  return weeks
}

// Hijri months covered by the Gregorian month, e.g. [{month: 4, year: 1448}, {month: 5, year: 1448}]
export function hijriSpan(year, month, offset) {
  const start = toHijriWithOffset(new Date(year, month, 1), offset)
  const end = toHijriWithOffset(new Date(year, month + 1, 0), offset)
  return start.month === end.month ? [start] : [start, end]
}
