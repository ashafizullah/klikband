// Qibla direction and distance from a city to the Kaaba, on a sphere.
const KAABA = { lat: 21.4225, lng: 39.8262 }
const EARTH_KM = 6371
const rad = (d) => (d * Math.PI) / 180

// Degrees clockwise from true north, 0-359
export function qiblaBearing(lat, lng) {
  const p1 = rad(lat)
  const p2 = rad(KAABA.lat)
  const dl = rad(KAABA.lng - lng)
  const y = Math.sin(dl) * Math.cos(p2)
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)
  return Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360) % 360
}

// Great-circle distance in km (haversine)
export function kaabaDistance(lat, lng) {
  const dp = rad(KAABA.lat - lat)
  const dl = rad(KAABA.lng - lng)
  const a = Math.pow(Math.sin(dp / 2), 2) + Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.pow(Math.sin(dl / 2), 2)
  return Math.round(2 * EARTH_KM * Math.asin(Math.sqrt(a)))
}

// Index into an 8-point compass name list (N, NE, E, ...)
export function compassPoint(bearing) {
  return Math.round(bearing / 45) % 8
}

// Twice a year the sun is right above the Kaaba, so facing the sun is facing
// the Qibla: 28 May 09:18 UTC and 16 July 09:27 UTC (a day earlier in leap years).
export const SUN_OVER_KAABA = [
  { month: 4, day: 28, utcMinutes: 9 * 60 + 18 },
  { month: 6, day: 16, utcMinutes: 9 * 60 + 27 }
]
