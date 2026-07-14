// Practice tracker model. localStorage key: illahabadi.tracker
// Shape: { "2026-07-14": { freestyle: true, verse: true, ... }, ... }

import { load, save } from './storage'
import { dateKey, daysAgo, todayKey } from './dates'

export const TASKS = [
  { id: 'freestyle', label: 'Freestyle' },
  { id: 'verse', label: '30-min verse-writing drill' },
  { id: 'musicality', label: 'Musicality drill' },
  { id: 'sang', label: 'Sang / worked today' },
]

export function loadTracker() {
  return load('tracker', {})
}

export function saveTracker(data) {
  save('tracker', data)
}

export function ticksOn(data, key) {
  const day = data[key]
  if (!day) return 0
  return TASKS.filter((t) => day[t.id]).length
}

// Mark a task done for today from anywhere in the app (drills feed this).
export function markToday(taskId, value = true) {
  const data = loadTracker()
  const key = todayKey()
  data[key] = { ...data[key], [taskId]: value }
  saveTracker(data)
  return data
}

// Streak = consecutive days with at least one tick, counting back from
// today. An untouched *today* doesn't break the streak (the day isn't over) —
// it just doesn't count yet.
export function streak(data) {
  let count = 0
  let i = 0
  if (ticksOn(data, todayKey()) > 0) {
    count = 1
  }
  i = 1
  while (ticksOn(data, dateKey(daysAgo(i))) > 0) {
    count += 1
    i += 1
  }
  return count
}

// Last N days as [{ key, date, ticks }], oldest first — for the heatmap.
export function history(data, days = 91) {
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i)
    const key = dateKey(d)
    out.push({ key, date: d, ticks: ticksOn(data, key) })
  }
  return out
}
