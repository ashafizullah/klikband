// Buzz and show a toast when a prayer time arrives while a page is open
// (a short buzz for Imsak)
import vibrator from '@system.vibrator'
import prompt from '@system.prompt'

export function prayerAlert(t, key) {
  vibrator.vibrate({ mode: key === 'imsak' ? 'short' : 'long' })
  try {
    prompt.showToast({ message: t.prayerTimeNow.replace('{name}', t.prayers[key]), duration: 5000 })
  } catch (e) {}
}
