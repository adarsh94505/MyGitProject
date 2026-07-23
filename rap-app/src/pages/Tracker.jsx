import { useState } from 'react'
import { Page, Card, Note } from '../components/ui'
import { todayKey, prettyDate } from '../lib/dates'
import {
  TASKS,
  loadTracker,
  saveTracker,
  streak,
  history,
  ticksOn,
} from '../lib/tracker'

// Heatmap intensity: 0 ticks → near-invisible, 4 ticks → full sage.
// Never red, never a "broken streak" mark — missed days simply stay quiet.
const LEVELS = [
  'bg-raise',
  'bg-sage/25',
  'bg-sage/45',
  'bg-sage/65',
  'bg-sage/90',
]

function Heatmap({ data }) {
  const days = history(data, 13 * 7) // ~3 months
  // Column-per-week layout, like a calendar heatmap.
  const weeks = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((d) => (
            <div
              key={d.key}
              title={`${d.key} — ${d.ticks} of ${TASKS.length}`}
              className={`h-3.5 w-3.5 rounded-sm ${LEVELS[d.ticks] ?? LEVELS[4]}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Tracker() {
  const [data, setData] = useState(() => loadTracker())
  const key = todayKey()
  const today = data[key] || {}
  const s = streak(data)
  const doneToday = ticksOn(data, key)

  function toggle(taskId) {
    const next = {
      ...data,
      [key]: { ...today, [taskId]: !today[taskId] },
    }
    setData(next)
    saveTracker(next)
  }

  return (
    <Page title="Riyaaz" kicker={prettyDate()}>
      <Card>
        <div className="space-y-1">
          {TASKS.map((t) => (
            <label
              key={t.id}
              className="flex cursor-pointer items-center gap-4 rounded-lg px-3 py-3.5 hover:bg-raise"
            >
              <input
                type="checkbox"
                checked={!!today[t.id]}
                onChange={() => toggle(t.id)}
                className="h-5 w-5"
              />
              <span
                className={today[t.id] ? 'text-sage' : 'text-body'}
              >
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </Card>

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-sm uppercase tracking-wider text-faint">
          Consistency
        </h2>
        <span className="text-sm text-dim">
          {s > 0
            ? `${s} day${s === 1 ? '' : 's'} in a row`
            : 'today can be day one'}
        </span>
      </div>
      <Card className="mt-3">
        <Heatmap data={data} />
        <Note className="mt-2">
          Last three months. Deeper green = more of the day&rsquo;s riyaaz done.
          Quiet squares are just quiet — no debt, no catching up.
        </Note>
      </Card>

      {doneToday === TASKS.length && (
        <p className="mt-8 text-center text-sm text-sage">
          Full riyaaz today. Rest is part of the craft.
        </p>
      )}
    </Page>
  )
}
