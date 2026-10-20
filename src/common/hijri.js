// Kalender Hijriah tabular (aritmetika). Bisa beda ±1 hari dari
// penetapan Kemenag yang berdasarkan rukyat/hisab per bulan.

export function keHijriah(tanggal) {
  const jd = Math.floor(tanggal.getTime() / 86400000 - tanggal.getTimezoneOffset() / 1440) + 2440588
  let l = jd - 1948440 + 10632
  const n = Math.floor((l - 1) / 10631)
  l = l - 10631 * n + 354
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238)
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29
  const bulan = Math.floor((24 * l) / 709)
  return {
    hari: l - Math.floor((709 * bulan) / 24),
    bulan,
    tahun: 30 * n + j - 30
  }
}
