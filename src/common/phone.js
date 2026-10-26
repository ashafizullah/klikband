// Messages from the KlikBand plugin for AstroBox on the phone, over
// @system.interconnect. Each message is a JSON string with a `type`:
//   getState     -> replies { type: 'state', app, version, place, method, asr,
//                clockOffset } (the band clock's hours from UTC)
//   setLocation  { name, lat, lng, tz, method } -> saves and selects the place,
//                replies { type: 'locationSaved', ok, name }
// The band opens the link itself when the phone sends something and closes
// it about a second later, so replies go out at once, from a copy of the
// selected place kept here rather than from storage. Replies are the only
// confirmation the phone gets, since send() on the band does not report
// success reliably.
import interconnect from '@system.interconnect'
import app from '@system.app'
import vibrator from '@system.vibrator'
import prompt from '@system.prompt'
import { STRINGS, loadLanguage } from './i18n.js'
import { loadCity, savePhoneCity, validPlace, onPlaceChange } from './cities.js'

let link = null
let current = null

function refresh() {
  loadCity((city) => (current = city))
}

// send() takes an object (a JSON string is dropped without an error); the
// phone receives it as JSON text
function reply(data) {
  try {
    link.send({ data, fail: () => {} })
  } catch (e) {}
}

function sendState() {
  let version = ''
  try {
    version = app.getInfo().versionName
  } catch (e) {}
  const place = current ? { name: current.name, lat: current.lat, lng: current.lng, tz: current.tz, custom: !!current.custom } : null
  const clockOffset = -new Date().getTimezoneOffset() / 60
  reply({ type: 'state', app: 'klikband', version, place, method: current && current.method, asr: current && current.asr, clockOffset })
}

function setLocation(msg) {
  const place = { name: msg.name, lat: msg.lat, lng: msg.lng, tz: msg.tz, method: msg.method }
  if (!validPlace(place)) {
    reply({ type: 'locationSaved', ok: false, error: 'invalid place' })
    return
  }
  reply({ type: 'locationSaved', ok: true, name: place.name })
  savePhoneCity(place)
  loadLanguage((lang) => {
    try {
      vibrator.vibrate({ mode: 'short' })
    } catch (e) {}
    try {
      prompt.showToast({ message: STRINGS[lang].locationSet.replace('{name}', place.name), duration: 3000 })
    } catch (e) {}
  })
}

function receive(event) {
  const data = event && event.data !== undefined ? event.data : event
  let msg = data
  if (typeof data === 'string') {
    try {
      msg = JSON.parse(data)
    } catch (e) {
      return
    }
  }
  if (!msg || typeof msg !== 'object') return
  if (msg.type === 'getState') sendState()
  else if (msg.type === 'setLocation') setLocation(msg)
}

// Called once from app.ux; does nothing where interconnect is unavailable
export function listenToPhone() {
  refresh()
  onPlaceChange(refresh)
  try {
    link = interconnect.instance()
    link.onmessage = receive
  } catch (e) {
    link = null
  }
}
