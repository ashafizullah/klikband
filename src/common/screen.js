import brightness from '@system.brightness'
import device from '@system.device'
import storage from '@system.storage'

// Keep the screen on while a reading or counting page is visible
export function keepScreenOn(on) {
  try {
    brightness.setKeepScreenOn({ keepScreenOn: on })
  } catch (e) {}
}

// Whether Clock keeps the screen on: 'auto' (default, turns off as usual)
// or 'on'
export const CLOCK_SCREENS = ['auto', 'on']

export function loadClockScreen(cb) {
  storage.get({
    key: 'clockScreen',
    default: 'auto',
    success: (data) => cb(CLOCK_SCREENS.indexOf(data) >= 0 ? data : 'auto'),
    fail: () => cb('auto')
  })
}

export function saveClockScreen(code) {
  storage.set({ key: 'clockScreen', value: code })
}

// Clock color themes, in the order a long press on Clock cycles through.
// accent colors the colon, progress bars and the next prayer's row (with
// black text, so every accent is light), heroBg and heroTrack the next-prayer
// card, soft its countdown
export const CLOCK_THEME_ORDER = ['green', 'blue', 'gold', 'purple', 'rose', 'mono']

export const CLOCK_THEMES = {
  green: { accent: '#34d399', heroBg: '#0d3b2c', heroTrack: '#145c44', soft: '#8ee6c0' },
  blue: { accent: '#60a5fa', heroBg: '#0f2a4a', heroTrack: '#1e406b', soft: '#b3d4fd' },
  gold: { accent: '#fbbf24', heroBg: '#3d2e08', heroTrack: '#5c460f', soft: '#fde29a' },
  purple: { accent: '#c084fc', heroBg: '#2e1745', heroTrack: '#48246b', soft: '#e2c6fe' },
  rose: { accent: '#fb7185', heroBg: '#45131c', heroTrack: '#6b1f2c', soft: '#fdc0c9' },
  mono: { accent: '#ffffff', heroBg: '#2c2c2e', heroTrack: '#48484a', soft: '#d1d1d6' }
}

export function loadClockTheme(cb) {
  storage.get({
    key: 'clockTheme',
    default: 'green',
    success: (data) => cb(CLOCK_THEMES[data] ? data : 'green'),
    fail: () => cb('green')
  })
}

export function saveClockTheme(code) {
  storage.set({ key: 'clockTheme', value: code })
}

// Wide screens such as Band 9 Pro (336 x 480) get their own layout. Pages add
// the returned prefix to their classes, e.g. class="card {{w}}card", and style
// `.w-card` for wide screens. px there is scaled 1.75x from the 192 px design
// width, so wide styles use about 0.6x the band sizes.
//
// Page heights in the styles fit Band 9 (490) and Band 9 Pro (274). Other
// screens get a frame, an inline style for the page root
// (style="{{frame}}") that sets the real height in design px: Band 10 and
// REDMI Watch 5 are shorter, and round watches get extra room at the top and
// bottom so the first and last items can scroll clear of the curved edge.
//
// Round watches also get 'r-' as a third value. Pages add {{r}}fit to the
// full-width blocks so they narrow to what the circle shows, and can add
// more `.r-` rules where a layout needs it.
//
// Calls back with ('' or 'w-', frame, '' or 'r-').

// screenShape needs API level 3; older firmware leaves it out, and round
// watches are the only square screens
function isRound(info) {
  return info.screenShape === 'circle' || info.screenWidth === info.screenHeight
}

export function loadLayout(cb) {
  try {
    device.getInfo({
      success: (info) => {
        const w = info.screenWidth >= 300 ? 'w-' : ''
        const height = Math.floor((info.screenHeight * 192) / info.screenWidth)
        const round = isRound(info)
        let frame = 'height: ' + height + 'px;'
        if (round) frame += ' padding-top: 24px; padding-bottom: 32px;'
        cb(w, frame, round ? 'r-' : '')
      }
    })
  } catch (e) {}
}
