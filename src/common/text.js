// Rough text width in px: CJK characters are as wide as the font size, Latin ~0.6x
export function textWidth(text, fontSize) {
  let width = 0
  for (let i = 0; i < text.length; i++) {
    width += text.charCodeAt(i) > 255 ? fontSize : fontSize * 0.6
  }
  return width
}
