import { useMemo } from 'react'
import { prettyDate } from '../lib/dates'
import { loadTracker, streak, ticksOn, TASKS } from '../lib/tracker'
import { todayKey } from '../lib/dates'

const LINKS = [
  { href: '#/tracker', name: 'Tracker', hint: 'today’s riyaaz, streak, heatmap' },
  { href: '#/freestyle', name: 'Freestyle Trainer', hint: 'word gen · rhyme bank · lines · drills' },
  { href: '#/beat', name: 'Beat Engine', hint: 'metronome · time signatures · syllable grid' },
  { href: '#/musicality', name: 'Musicality', hint: 'rhythm curriculum L0–L7' },
  { href: '#/signature', name: 'Laid-Back Flow', hint: 'the signature — pocket, stretch, space, tone' },
  { href: '#/wordsmith', name: 'Wordsmith', hint: 'surprise · shapes · imagery · story' },
  { href: '#/feed', name: 'Daily Feed', hint: 'one pick from the masters' },
  { href: '#/focus', name: 'Focus', hint: 'timer · intention · ship it' },
]

export default function Home() {
  const data = useMemo(() => loadTracker(), [])
  const today = data[todayKey()] || {}
  const doneCount = ticksOn(data, todayKey())
  const s = streak(data)

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16">
      {/* Mission — the reason this app exists */}
      <header className="mb-14">
        <div className="text-xs uppercase tracking-[0.3em] text-faint">
          {prettyDate()}
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-body">
          Illahabadi
        </h1>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-dim">
          The Snoop Dogg of Allahabad.
          <br />
          <span className="text-amber">Perform. Be the best ever.</span>
        </p>
      </header>

      {/* Today at a glance — calm, factual, no pressure */}
      <a
        href="#/tracker"
        className="mb-12 block rounded-xl border border-edge bg-surface p-5 hover:border-faint"
      >
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-dim">Today</span>
          <span className="text-sm text-faint">
            {s > 0 ? `${s} day${s === 1 ? '' : 's'} riyaaz streak` : 'a clean slate'}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TASKS.map((t) => (
            <span
              key={t.id}
              className={`rounded-full border px-3 py-1 text-xs ${
                today[t.id]
                  ? 'border-sage/40 bg-sage-soft text-sage'
                  : 'border-edge text-faint'
              }`}
            >
              {today[t.id] ? '✓ ' : ''}
              {t.label}
            </span>
          ))}
        </div>
        {doneCount === 0 && (
          <p className="mt-3 text-sm text-faint">
            Nothing yet — one small drill is enough to start.
          </p>
        )}
      </a>

      {/* Everything one tap away */}
      <nav className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-xl border border-edge bg-surface p-5 hover:border-faint"
          >
            <div className="font-medium text-body">{l.name}</div>
            <div className="mt-1 text-sm text-faint">{l.hint}</div>
          </a>
        ))}
      </nav>
    </div>
  )
}
