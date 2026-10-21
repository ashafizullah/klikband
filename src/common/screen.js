import brightness from '@system.brightness'
import device from '@system.device'

// Keep the screen on while a reading or counting page is visible
export function keepScreenOn(on) {
  brightness.setKeepScreenOn({ keepScreenOn: on })
}

// Wide screens such as Band 9 Pro (336 x 480) get their own layout. Pages add
// the returned prefix to their classes, e.g. class="card {{w}}card", and style
// `.w-card` for wide screens. px there is scaled 1.75x from the 192 px design
// width, so wide styles use about 0.6x the band sizes.
// Calls back with '' on bands and 'w-' on wide screens.

export function loadLayout(cb) {
  try {
    device.getInfo({ success: (info) => cb(info.screenWidth >= 300 ? 'w-' : '') })
  } catch (e) {}
}
