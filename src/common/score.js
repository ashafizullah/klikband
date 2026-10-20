// Scoreboard rules. A match state is a plain object kept in storage:
// { mode, a: { p, g, s }, b: { p, g, s }, tiebreak, winner, past }
// p = points in the current game, g = games (in the current set), s = sets.
// past = finished badminton games (points) or tennis sets (games), as { a, b }.
//
// Modes:
// - points:    +1 per tap, no limit
// - badminton: games to 21, win by 2, capped at 30; best of 3 games
// - tennis:    tennis/padel scoring (15, 30, 40, deuce, advantage); sets to 6
//              games, win by 2, tiebreak to 7 at 6-6; best of 3 sets

export const MODES = ['points', 'badminton', 'tennis']

const TENNIS_POINTS = ['0', '15', '30', '40']

export function newMatch(mode) {
  return { mode, a: { p: 0, g: 0, s: 0 }, b: { p: 0, g: 0, s: 0 }, tiebreak: false, winner: '', past: [] }
}

function other(side) {
  return side === 'a' ? 'b' : 'a'
}

// Point won by `side`. Returns a new state and what it completed:
// 'point' | 'game' | 'set' | 'match'
export function addPoint(state, side) {
  const s = JSON.parse(JSON.stringify(state))
  if (s.winner) return { state: s, event: 'point' }
  const me = s[side]
  const op = s[other(side)]
  me.p += 1

  if (s.mode === 'points') return { state: s, event: 'point' }

  if (s.mode === 'badminton') {
    if ((me.p >= 21 && me.p - op.p >= 2) || me.p === 30) {
      s.past.push({ a: s.a.p, b: s.b.p })
      me.g += 1
      me.p = 0
      op.p = 0
      if (me.g === 2) {
        s.winner = side
        return { state: s, event: 'match' }
      }
      return { state: s, event: 'game' }
    }
    return { state: s, event: 'point' }
  }

  // Tennis: a game needs 4 points (7 in a tiebreak) and a 2-point lead
  const needed = s.tiebreak ? 7 : 4
  if (me.p < needed || me.p - op.p < 2) {
    // Deuce: keep advantage scoring at 3-3 / 4-3 instead of growing numbers
    if (!s.tiebreak && me.p === 4 && op.p === 4) {
      me.p = 3
      op.p = 3
    }
    return { state: s, event: 'point' }
  }

  me.p = 0
  op.p = 0
  me.g += 1
  const setWon = s.tiebreak || (me.g >= 6 && me.g - op.g >= 2)
  if (!setWon) {
    s.tiebreak = me.g === 6 && op.g === 6
    return { state: s, event: 'game' }
  }

  s.tiebreak = false
  s.past.push({ a: s.a.g, b: s.b.g })
  me.s += 1
  me.g = 0
  op.g = 0
  if (me.s === 2) {
    s.winner = side
    return { state: s, event: 'match' }
  }
  return { state: s, event: 'set' }
}

// Big number on a panel: points, or 0/15/30/40/AD in a tennis game
export function pointsText(state, side) {
  const me = state[side]
  if (state.mode !== 'tennis' || state.tiebreak) return String(me.p)
  const op = state[other(side)]
  if (me.p >= 3 && op.p >= 3) {
    if (me.p > op.p) return 'AD'
    return '40'
  }
  return TENNIS_POINTS[me.p]
}

// Small line under the points: points of finished badminton games, e.g.
// "Gim 21 · 18", or games of every tennis set including the current one,
// e.g. "Gim 6 · 3". Starts with "Menang!" for the winner.
export function detailText(state, side, t) {
  if (state.mode === 'points') return ''
  const scores = state.past.map((x) => x[side])
  if (state.mode === 'tennis' && !state.winner) scores.push(state[side].g)
  const line = scores.length ? t.games + ' ' + scores.join(' · ') : ''
  if (state.winner === side) return t.wins + (scores.length ? ' ' + scores.join(' · ') : '')
  return line
}
