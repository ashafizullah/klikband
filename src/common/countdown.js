// User-defined dates for the day counter, kept in storage as JSON.
import storage from '@system.storage'

export const LABELS = ['birthday', 'anniversary', 'payday', 'holiday', 'exam', 'event', 'other']
export const REPEATS = ['none', 'monthly', 'yearly']
export const MAX_ENTRIES = 6

export function loadCountdowns(cb) {
  storage.get({
    key: 'countdowns',
    success: (data) => {
      try {
        cb(data ? JSON.parse(data) : [])
      } catch (e) {
        cb([])
      }
    },
    fail: () => cb([])
  })
}

export function saveCountdowns(list) {
  storage.set({ key: 'countdowns', value: JSON.stringify(list) })
}

export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// Whole days from a to b (local dates, time of day ignored)
function daysBetween(a, b) {
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((ub - ua) / 86400000)
}

// The date to count to: the entry itself, or its next monthly/yearly repeat
export function targetDate(entry, today) {
  const { y, m, d, repeat } = entry
  if (repeat === 'yearly') {
    let year = today.getFullYear()
    let date = new Date(year, m, Math.min(d, daysInMonth(year, m)))
    if (daysBetween(today, date) < 0) {
      year += 1
      date = new Date(year, m, Math.min(d, daysInMonth(year, m)))
    }
    return date
  }
  if (repeat === 'monthly') {
    let year = today.getFullYear()
    let month = today.getMonth()
    let date = new Date(year, month, Math.min(d, daysInMonth(year, month)))
    if (daysBetween(today, date) < 0) {
      month += 1
      if (month > 11) {
        month = 0
        year += 1
      }
      date = new Date(year, month, Math.min(d, daysInMonth(year, month)))
    }
    return date
  }
  return new Date(y, m, d)
}

// Positive: days left; negative: days since; 0: today
export function daysUntil(entry, today) {
  return daysBetween(today, targetDate(entry, today))
}
