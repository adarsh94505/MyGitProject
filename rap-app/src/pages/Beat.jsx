import { useEffect, useMemo, useRef, useState } from 'react'
import { Page, Card, Note } from '../components/ui'
import Transport, { useBeatState } from '../components/Transport'
import SyllableGrid from '../components/SyllableGrid'
import BeatLight from '../components/BeatLight'
import { BeatEngine } from '../audio/engine'

/* --- grid presets --------------------------------------------------------- */

const PRESETS = [
  { id: 'on', label: 'on the beat' },
  { id: 'pocket', label: 'behind the beat / pocket' },
  { id: 'sync', label: 'syncopated (off-beats)' },
  { id: 'triplet', label: 'triplet flow' },
]

function presetTargets(id, slots) {
  const idx = slots.map((s, i) => ({ ...s, i }))
  switch (id) {
    case 'on':
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

/* --- MY LOOPS — real beats dropped into public/beats/ --------------------- */

function MyLoops() {
  const [files, setFiles] = useState(null) // null = loading, [] = none
  const [local, setLocal] = useState([]) // picked via file input this session

  useEffect(() => {
    fetch('/beats/manifest.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setFiles(Array.isArray(list) ? list : []))
      .catch(() => setFiles([]))
  }, [])

  function pickLocal(e) {
    const picked = Array.from(e.target.files || []).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }))
    setLocal((l) => [...l, ...picked])
  }

  const all = [
    ...(files || []).map((name) => ({ name, url: `/beats/${name}` })),
    ...local,
  ]

  return (
    <Card className="mt-10">
      <h2 className="mb-1 font-medium text-body">My loops</h2>
      <Note>
        Real beats you drop into <code className="text-amber">public/beats/</code>{' '}
        (then list the filename in <code className="text-amber">manifest.json</code>{' '}
        there). Where to find free ones: see BEATS_SOURCES.md in the project.
      </Note>
      {all.length === 0 ? (
        <div className="mt-4">
          <Note>Nothing here yet — the synth engine above covers you.</Note>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {all.map((f) => (
            <li key={f.url}>
              <div className="mb-1 text-sm text-body">{f.name}</div>
              <audio controls loop src={f.url} className="w-full" />
            </li>
          ))}
        </ul>
      )}
      <label className="mt-4 inline-block cursor-pointer text-sm text-amber hover:underline">
        …or play a file from disk (this session only)
        <input
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={pickLocal}
        />
      </label>
    </Card>
  )
}

/* --------------------------------------------------------------------------- */

export default function Beat() {
  const engine = useMemo(() => new BeatEngine(), [])
  const [state, setState] = useBeatState(engine)
  const [targets, setTargets] = useState(new Set())
  const [preset, setPreset] = useState(null)
  const slots = engine.layout()
  const lateShift = preset === 'pocket' ? 0.3 : 0

  // re-apply preset when the layout changes shape
  const layoutKey = `${state.sig}/${state.subdivision}`
  const prevLayout = useRef(layoutKey)
  useEffect(() => {
    if (prevLayout.current !== layoutKey) {
      prevLayout.current = layoutKey
      setTargets(preset ? presetTargets(preset, engine.layout()) : new Set())
    }
  }, [layoutKey, preset, engine])

  function applyPreset(id) {
    setPreset(id)
    if (id === 'triplet' && engine.layout()[0] && state.subdivision !== 3) {
      // triplet flow implies triplet subdivision on simple meters
      setState((s) => ({ ...s, subdivision: 3 }))
      setTargets(presetTargets(id, engine.layout()))
      return
    }
    setTargets(presetTargets(id, slots))
  }

  function toggleTarget(i) {
    setPreset(null)
    setTargets((t) => {
      const next = new Set(t)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <Page title="Beat Engine" kicker="web audio · all synthesized">
      <Card>
        <Transport engine={engine} state={state} setState={setState} />
        <BeatLight engine={engine} running={state.running} />
      </Card>

      <h2 className="mb-2 mt-10 text-sm uppercase tracking-wider text-faint">
        Syllable grid — one bar
      </h2>
      <Card>
        <SyllableGrid
          slots={slots}
          targets={targets}
          onToggle={toggleTarget}
          engine={engine}
          running={state.running}
          lateShift={lateShift}
        />
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`rounded-full border px-3.5 py-1.5 text-xs ${
                preset === p.id
                  ? 'border-amber/50 bg-amber-soft text-amber'
                  : 'border-edge text-dim hover:text-body'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => {
              setPreset(null)
              setTargets(new Set())
            }}
            className="rounded-full border border-edge px-3.5 py-1.5 text-xs text-faint hover:text-body"
          >
            clear
          </button>
        </div>
        <Note className="mt-4">
          Amber dots = where your syllables should land. Play, watch the
          playhead sweep, and speak your line so each syllable hits a dot.
          {preset === 'pocket' &&
            ' The dots sit a touch late on purpose — that lag IS the pocket.'}
        </Note>
      </Card>

      <MyLoops />
    </Page>
  )
}
