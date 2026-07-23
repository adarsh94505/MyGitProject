import { useMemo, useState } from 'react'
import { Page, Card, Btn } from '../components/ui'
import Transport, { useBeatState } from '../components/Transport'
import SyllableGrid from '../components/SyllableGrid'
import BeatLight from '../components/BeatLight'
import { BeatEngine } from '../audio/engine'
import { MUSIC_LEVELS } from '../lib/curriculum'
import { markToday } from '../lib/tracker'
import { useStored } from '../lib/storage'
import { randomWord } from '../lib/data'
import { todayKey } from '../lib/dates'

function presetTargets(id, slots) {
  const idx = slots.map((s, i) => ({ ...s, i }))
  switch (id) {
    case 'on':
      return new Set(idx.filter((s) => s.accent > 0).map((s) => s.i))
    case 'pocket':
      return new Set(idx.filter((s) => s.accent > 0).map((s) => s.i))
    case 'sync': {
      const off = idx.filter((s) => s.accent === 0 && s.i % 2 === 1)
      const pool = off.length ? off : idx.filter((s) => s.accent === 0)
      return new Set(pool.map((s) => s.i))
    }
    case 'triplet':
      return new Set(idx.map((s) => s.i))
    default:
      return new Set()
  }
}

export default function Musicality() {
  const engine = useMemo(() => new BeatEngine(), [])
  const [state, setState] = useBeatState(engine)
  // practiced: { L0: { count, last }, ... }
  const [practiced, setPracticed] = useStored('musicality-levels', {})
  const [openId, setOpenId] = useState(null)
  const [cueWord, setCueWord] = useState(null)

  const level = MUSIC_LEVELS.find((l) => l.id === openId)
  const slots = engine.layout()
  const targets = level ? presetTargets(level.preset, slots) : new Set()
  const lateShift = level?.preset === 'pocket' ? 0.3 : 0

  function open(l) {
    engine.stop()
    setState((s) => ({
      ...s,
      running: false,
      ...l.settings,
    }))
    setCueWord(null)
    setOpenId(l.id)
  }

  function markPracticed(l) {
    setPracticed((p) => ({
      ...p,
      [l.id]: { count: (p[l.id]?.count || 0) + 1, last: todayKey() },
    }))
    markToday('musicality')
  }

  return (
    <Page title="Musicality" kicker="one concept per level — stack slowly">
      {!level && (
        <div className="space-y-3">
          {MUSIC_LEVELS.map((l) => {
            const p = practiced[l.id]
            return (
              <button
                key={l.id}
                onClick={() => open(l)}
                className="block w-full rounded-xl border border-edge bg-surface p-5 text-left hover:border-faint"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-body">
                    <span className="text-amber">{l.id}</span> · {l.title}
                  </span>
                  {p && (
                    <span className="text-xs text-sage">
                      practiced ×{p.count}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {level && (
        <div>
          <button
            onClick={() => {
              engine.stop()
              setState((s) => ({ ...s, running: false }))
              setOpenId(null)
            }}
            className="mb-4 text-sm text-faint hover:text-dim"
          >
            &larr; all levels
          </button>

          <h2 className="text-xl font-medium text-body">
            <span className="text-amber">{level.id}</span> · {level.title}
          </h2>

          <Card className="mt-4">
            <p className="leading-relaxed text-dim">{level.explain}</p>
          </Card>

          <Card className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-faint">
              Drill
            </div>
            <p className="leading-relaxed text-body">{level.drill}</p>
          </Card>

          <Card className="mt-4">
            <Transport engine={engine} state={state} setState={setState} />
            <BeatLight engine={engine} running={state.running} />
            <SyllableGrid
              slots={slots}
              targets={targets}
              engine={engine}
              running={state.running}
              lateShift={lateShift}
            />
          </Card>

          <Card className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-faint">
              Combine — add the wordsmith cue
            </div>
            <p className="leading-relaxed text-body">{level.combine}</p>
            {cueWord ? (
              <div className="mt-4 text-center">
                <span className="text-3xl font-semibold text-body">
                  {cueWord.word}
                </span>
                <span className="ml-3 text-sm text-faint">
                  -{cueWord.ending}
                </span>
              </div>
            ) : (
              <div className="mt-4">
                <Btn onClick={() => setCueWord(randomWord())}>
                  pull a cue word
                </Btn>
              </div>
            )}
            {cueWord && (
              <div className="mt-3 text-center">
                <Btn onClick={() => setCueWord(randomWord())}>reroll</Btn>
              </div>
            )}
          </Card>

          <div className="mt-6 flex justify-center">
            <Btn primary onClick={() => markPracticed(level)} className="px-8 py-3">
              practiced it — count it
            </Btn>
          </div>
          {practiced[level.id] && (
            <p className="mt-3 text-center text-sm text-sage">
              ×{practiced[level.id].count} — musicality ticked for today.
            </p>
          )}
        </div>
      )}
    </Page>
  )
}
