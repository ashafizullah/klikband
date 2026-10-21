// General-purpose tally counters, kept in storage as JSON: [{ label, count }]
import storage from '@system.storage'

export const COUNTER_LABELS = ['guests', 'people', 'items', 'laps', 'reps', 'other']
export const MAX_COUNTERS = 6

export function loadCounters(cb) {
  storage.get({
    key: 'counters',
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

export function saveCounters(list) {
  storage.set({ key: 'counters', value: JSON.stringify(list) })
}
