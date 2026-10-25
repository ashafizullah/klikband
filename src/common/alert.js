// Buzz and show a toast when a prayer time arrives while a page is open
// (a short buzz for Imsak)
import vibrator from '@system.vibrator'
import prompt from '@system.prompt'
import { prayerName } from './prayer.js'

// Timers stop while the screen is off. A prayer time that passed in the
// meantime still alerts on waking, up to this many seconds late
export const LATE_ALERT = 30 * 60

export function prayerAlert(t, key) {
  try {
    vibrator.vibrate({ mode: key === 'imsak' ? 'short' : 'long' })
  } catch (e) {}
  try {
    prompt.showToast({ message: t.prayerTimeNow.replace('{name}', prayerName(t, key, new Date())), duration: 5000 })
  } catch (e) {}
}
