// Calculator arithmetic: tokens alternate numbers (strings) and operators,
// e.g. ['12', '+', '3', '×', '4']. × and ÷ go before + and −.

// Rounds away float noise such as 0.1 + 0.2 = 0.30000000000000004
function clean(n) {
  return parseFloat(n.toPrecision(12))
}

// Returns a number, or null for division by zero
export function evaluate(tokens) {
  const terms = [parseFloat(tokens[0])]
  const ops = []
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i]
    const n = parseFloat(tokens[i + 1])
    if (op === '×') terms[terms.length - 1] *= n
    else if (op === '÷') {
      if (n === 0) return null
      terms[terms.length - 1] /= n
    } else {
      terms.push(n)
      ops.push(op)
    }
  }
  let result = terms[0]
  ops.forEach((op, i) => (result = op === '+' ? result + terms[i + 1] : result - terms[i + 1]))
  return clean(result)
}

// Plain string for a result, kept short enough for the display
export function numberToEntry(n) {
  const abs = Math.abs(n)
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-9)) return String(parseFloat(n.toPrecision(6)))
  return String(n)
}

// "1234567.5" -> "1.234.567,5" (id) or "1,234,567.5" (en, zh)
export function formatEntry(entry, thousands, decimal) {
  if (entry.indexOf('e') >= 0) return entry
  const negative = entry[0] === '-'
  const parts = (negative ? entry.slice(1) : entry).split('.')
  const whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands)
  return (negative ? '-' : '') + whole + (parts.length > 1 ? decimal + parts[1] : '')
}
