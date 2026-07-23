import { useEffect, useRef, useState } from 'react'
import { Btn, Seg, Field, Note } from './ui'
import { TIME_SIGNATURES, SUBDIVISIONS, VOICES } from '../audio/engine'

// Shared beat-engine transport: play/stop, BPM, tap tempo, signature,
// voice, subdivision, swing. Used by Beat page, curriculum, signature module.
//
// props: engine (BeatEngine), state + setState from useBeatState(),
//        lock = { sig?, voice?, subdivision?, swing? } to hide controls
//        a lesson wants fixed.
export function useBeatState(engine, initial = {}) {
  const [state, setState] = useState({
    running: false,
    bpm: 90,
    sig: '4/4',
    subdivision: 8,
    swing: 0,
    voice: 'tabla',
    ...initial,
  })
  // push state into the engine whenever it changes
  useEffect(() => {
    engine.bpm = state.bpm
    engine.sig = state.sig
    engine.subdivision = state.subdivision
    engine.swing = state.swing
    engine.voice = state.voice
  }, [engine, state])
  // stop on unmount
  useEffect(() => () => engine.stop(), [engine])
  return [state, setState]
}

export default function Transport({ engine, state, setState, lock = {} }) {
  const taps = useRef([])
  const sig = TIME_SIGNATURES[state.sig]
  const isSimple = sig.kind === 'simple'

  function toggle() {
    if (state.running) {
      engine.stop()
      setState((s) => ({ ...s, running: false }))
    } else {
      engine.start()
      setState((s) => ({ ...s, running: true }))
    }
  }

  function tap() {
    const now = performance.now()
    taps.current = taps.current.filter((t) => now - t < 2500)
    taps.current.push(now)
    if (taps.current.length >= 2) {
      const iv = []
      for (let i = 1; i < taps.current.length; i++) {
        iv.push(taps.current[i] - taps.current[i - 1])
      }
      const avg = iv.reduce((a, b) => a + b, 0) / iv.length
      const bpm = Math.min(200, Math.max(40, Math.round(60000 / avg)))
      setState((s) => ({ ...s, bpm }))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Btn primary onClick={toggle} className="min-w-24 px-6 py-2.5">
          {state.running ? 'stop' : 'play'}
        </Btn>
        <Btn onClick={tap}>tap tempo</Btn>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={40}
            max={200}
            value={state.bpm}
            onChange={(e) =>
              setState((s) => ({ ...s, bpm: Number(e.target.value) }))
            }
            className="w-40"
          />
          <span className="w-20 text-sm text-body">{state.bpm} BPM</span>
        </div>
      </div>

      {!lock.sig && (
        <div>
          <Seg
            options={Object.keys(TIME_SIGNATURES)}
            value={state.sig}
            onChange={(sig) => setState((s) => ({ ...s, sig }))}
          />
          <Note className="mt-2">
            <span className="text-amber">{sig.label}</span> — {sig.feel}
          </Note>
        </div>
      )}
      {lock.sig && (
        <Note>
          <span className="text-amber">{sig.label}</span> — {sig.feel}
        </Note>
      )}

      <div className="flex flex-wrap items-end gap-6">
        {!lock.voice && (
          <Field label="Voice">
            <Seg
              options={Object.entries(VOICES).map(([value, label]) => ({
                value,
                label,
              }))}
              value={state.voice}
              onChange={(voice) => setState((s) => ({ ...s, voice }))}
            />
          </Field>
        )}
        {isSimple && !lock.subdivision && (
          <Field label="Subdivision">
            <Seg
              options={Object.entries(SUBDIVISIONS).map(([value, v]) => ({
                value: Number(value),
                label: v.label,
              }))}
              value={state.subdivision}
              onChange={(subdivision) =>
                setState((s) => ({ ...s, subdivision }))
              }
            />
          </Field>
        )}
        {isSimple && state.subdivision !== 3 && !lock.swing && (
          <Field label={`Swing · ${Math.round(state.swing * 100)}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={state.swing * 100}
              onChange={(e) =>
                setState((s) => ({ ...s, swing: Number(e.target.value) / 100 }))
              }
              className="w-36"
            />
          </Field>
        )}
      </div>
    </div>
  )
}
