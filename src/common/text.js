// Rough text width in px: CJK characters are as wide as the font size, Latin ~0.6x
export function textWidth(text, fontSize) {
  let width = 0
  for (let i = 0; i < text.length; i++) {
    width += text.charCodeAt(i) > 255 ? fontSize : fontSize * 0.6
  }
  return width
}

// Start every marquee with id "m0", "m1", ... on the page
export function startMarquees(page, count) {
  for (let i = 0; i < count; i++) {
    const el = page.$element('m' + i)
    if (el && el.start) el.start()
  }
}
