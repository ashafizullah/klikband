// Keep the screen on while a reading or counting page is visible
import brightness from '@system.brightness'

export function keepScreenOn(on) {
  brightness.setKeepScreenOn({ keepScreenOn: on })
}
