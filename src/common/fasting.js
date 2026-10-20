// Fasting days from the Hijri date and weekday.
// Returns keys of STRINGS[lang].fasts for `date`; `hijri` comes from common/hijri.js.
export function fastsFor(date, hijri) {
  const { day, month } = hijri

  if (month === 9) return ['ramadan']
  if ((month === 10 && day === 1) || (month === 12 && day === 10)) return ['eid']
  if (month === 12 && day >= 11 && day <= 13) return ['tashriq']

  const fasts = []
  if (month === 12 && day === 9) fasts.push('arafah')
  if (month === 1 && day === 9) fasts.push('tasua')
  if (month === 1 && day === 10) fasts.push('ashura')
  if (day >= 13 && day <= 15) fasts.push('ayyamulBidh')
  if (month === 10) fasts.push('shawwal')
  if (date.getDay() === 1) fasts.push('monday')
  if (date.getDay() === 4) fasts.push('thursday')
  return fasts.length ? fasts : ['none']
}
