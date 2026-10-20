// Cities for prayer times: Indonesian province capitals plus a few other cities.
// tz = hours offset from UTC (WIB 7, WITA 8, WIT 9)
import storage from '@system.storage'

export const CITIES = [
  { name: 'Weleri', lat: -6.9707, lng: 110.0697, tz: 7 },
  { name: 'Kendal', lat: -6.9226, lng: 110.2034, tz: 7 },
  { name: 'Semarang', lat: -6.9667, lng: 110.4167, tz: 7 },
  { name: 'Surakarta', lat: -7.5755, lng: 110.8243, tz: 7 },
  { name: 'Yogyakarta', lat: -7.7956, lng: 110.3695, tz: 7 },
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456, tz: 7 },
  { name: 'Bandung', lat: -6.9175, lng: 107.6191, tz: 7 },
  { name: 'Serang', lat: -6.1104, lng: 106.164, tz: 7 },
  { name: 'Surabaya', lat: -7.2575, lng: 112.7521, tz: 7 },
  { name: 'Malang', lat: -7.9666, lng: 112.6326, tz: 7 },
  { name: 'Banda Aceh', lat: -5.5483, lng: 95.3238, tz: 7 },
  { name: 'Medan', lat: 3.5952, lng: 98.6722, tz: 7 },
  { name: 'Padang', lat: -0.9471, lng: 100.4172, tz: 7 },
  { name: 'Pekanbaru', lat: 0.5071, lng: 101.4478, tz: 7 },
  { name: 'Batam', lat: 1.0456, lng: 104.0305, tz: 7 },
  { name: 'Tanjung Pinang', lat: 0.9186, lng: 104.4554, tz: 7 },
  { name: 'Jambi', lat: -1.6101, lng: 103.6131, tz: 7 },
  { name: 'Bengkulu', lat: -3.8004, lng: 102.2655, tz: 7 },
  { name: 'Palembang', lat: -2.9761, lng: 104.7754, tz: 7 },
  { name: 'Pangkalpinang', lat: -2.1316, lng: 106.1169, tz: 7 },
  { name: 'Bandar Lampung', lat: -5.3971, lng: 105.2668, tz: 7 },
  { name: 'Pontianak', lat: -0.0263, lng: 109.3425, tz: 7 },
  { name: 'Palangka Raya', lat: -2.2161, lng: 113.9135, tz: 7 },
  { name: 'Denpasar', lat: -8.6705, lng: 115.2126, tz: 8 },
  { name: 'Mataram', lat: -8.5833, lng: 116.1167, tz: 8 },
  { name: 'Kupang', lat: -10.1772, lng: 123.607, tz: 8 },
  { name: 'Banjarbaru', lat: -3.4572, lng: 114.81, tz: 8 },
  { name: 'Banjarmasin', lat: -3.3186, lng: 114.5944, tz: 8 },
  { name: 'Samarinda', lat: -0.5022, lng: 117.1536, tz: 8 },
  { name: 'Balikpapan', lat: -1.2379, lng: 116.8529, tz: 8 },
  { name: 'Tanjung Selor', lat: 2.8375, lng: 117.3653, tz: 8 },
  { name: 'Makassar', lat: -5.1477, lng: 119.4327, tz: 8 },
  { name: 'Mamuju', lat: -2.6748, lng: 118.8885, tz: 8 },
  { name: 'Palu', lat: -0.8917, lng: 119.8707, tz: 8 },
  { name: 'Kendari', lat: -3.9985, lng: 122.5129, tz: 8 },
  { name: 'Gorontalo', lat: 0.5435, lng: 123.0568, tz: 8 },
  { name: 'Manado', lat: 1.4748, lng: 124.8421, tz: 8 },
  { name: 'Ambon', lat: -3.6954, lng: 128.1814, tz: 9 },
  { name: 'Ternate', lat: 0.7893, lng: 127.3842, tz: 9 },
  { name: 'Sofifi', lat: 0.7372, lng: 127.5588, tz: 9 },
  { name: 'Manokwari', lat: -0.8615, lng: 134.062, tz: 9 },
  { name: 'Sorong', lat: -0.8762, lng: 131.2558, tz: 9 },
  { name: 'Nabire', lat: -3.3667, lng: 135.4833, tz: 9 },
  { name: 'Jayapura', lat: -2.5337, lng: 140.7181, tz: 9 },
  { name: 'Wamena', lat: -4.0942, lng: 138.9447, tz: 9 },
  { name: 'Merauke', lat: -8.4932, lng: 140.4018, tz: 9 }
]

export const TIME_ZONES = { 7: 'WIB', 8: 'WITA', 9: 'WIT' }

// The selected city is stored by name; defaults to Weleri
export function loadCity(cb) {
  storage.get({
    key: 'city',
    default: CITIES[0].name,
    success: (name) => cb(CITIES.find((c) => c.name === name) || CITIES[0]),
    fail: () => cb(CITIES[0])
  })
}

export function saveCity(name) {
  storage.set({ key: 'city', value: name })
}
