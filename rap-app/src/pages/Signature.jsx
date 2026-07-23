import { useMemo, useState } from 'react'
import { Page, Card, Btn, Seg, Note } from '../components/ui'
import Transport, { useBeatState } from '../components/Transport'
import SyllableGrid from '../components/SyllableGrid'
import BeatLight from '../components/BeatLight'
import { BeatEngine } from '../audio/engine'
import { randomWord } from '../lib/data'
import { markToday } from '../lib/tracker'

// THE signature: laid-back / West Coast flow, adapted to Allahabadi
// Hindustani over a tabla-feel pulse. Four components trained one at a
// time, then combined. Core truth (repeat it): laid-back is about
// PLACEMENT and TONE, not slow speed.

const PARTS = [
  { id: 'A', label: 'A · pocket' },
  { id: 'B', label: 'B · vowel stretch' },
  { id: 'C', label: 'C · space' },
  { id: 'D', label: 'D · tone' },
  { id: 'X', label: 'combine' },
]

function beatStarts(slots) {
  return new Set(
    slots.map((s, i) => ({ ...s, i })).filter((s) => s.accent > 0).map((s) => s.i),
  )
}

function firstHalf(slots) {
  // targets on the first two big beats; the rest of the bar is breath
  const starts = [...beatStarts(slots)]
  return new Set(starts.slice(0, Math.ceil(starts.length / 2)))
}

export default function Signature() {
  const engine = useMemo(() => new BeatEngine(), [])
  const [state, setState] = useBeatState(engine, {
    bpm: 90,
    voice: 'tabla',
    sig: '4/4',
  })
  const [part, setPart] = useState('A')
  const [late, setLate] = useState(0.2) // how far behind (A + combine)
  const [word, setWord] = useState(() => randomWord())
  const slots = engine.layout()
  const onGrid = beatStarts(slots)

  const gridProps = {
    A: { targets: onGrid, ghost: onGrid, lateShift: late },
    B: { targets: new Set([...onGrid].slice(0, 1)), ghost: null, lateShift: 0.15 },
    C: { targets: firstHalf(slots), ghost: null, lateShift: 0.15 },
    D: null,
    X: { targets: onGrid, ghost: onGrid, lateShift: late },
  }[part]

  function done() {
    markToday('musicality')
  }

  return (
    <Page title="Laid-Back Flow" kicker="the signature — smooth, unhurried, yours">
      <Note className="mb-6">
        Snoop&rsquo;s cool, your language, tabla underneath. Four components,
        trained one at a time. And the rule that makes it work:{' '}
        <span className="text-amber">
          laid-back is about placement and tone, not slow speed.
        </span>
      </Note>

      <Seg options={PARTS} value={part} onChange={setPart} className="mb-6" />

      {part === 'A' && (
        <Card>
          <h2 className="font-medium text-body">Behind-the-beat pocket — the core</h2>
          <p className="mt-2 leading-relaxed text-dim">
            The hollow rings are the grid — where a metronome would put you.
            The amber dots sit late. Rap a relaxed line landing every syllable
            on the amber dots, not the rings. Start subtle; drag the slider
            toward heavy lazy only when subtle feels easy.
          </p>
          <div className="mt-5">
            <label className="text-xs uppercase tracking-wider text-faint">
              How far behind · {late < 0.15 ? 'subtle' : late < 0.3 ? 'settled' : 'heavy lazy'}
            </label>
            <input
              type="range"
              min={5}
              max={45}
              value={late * 100}
              onChange={(e) => setLate(Number(e.target.value) / 100)}
              className="mt-2 block w-56"
            />
          </div>
        </Card>
      )}

      {part === 'B' && (
        <Card>
          <h2 className="font-medium text-body">Vowel stretch / legato</h2>
          <p className="mt-2 leading-relaxed text-dim">
            Staccato punches every syllable; legato lets them lean on each
            other. Take the word below and{' '}
            <span className="text-body">stretch its vowel across 2–3 beats</span>{' '}
            — &ldquo;jawaaaa-ni&rdquo;, not &ldquo;ja-wa-ni&rdquo;. Repeating
            vowels (assonance) is where the liquid, rolling Snoop sound comes
            from. Start on the dot, then glide.
          </p>
          {word && (
            <div className="mt-5 text-center">
              <span className="text-4xl font-semibold text-body">{word.word}</span>
              <span className="ml-3 text-sm text-faint">-{word.ending}</span>
              <div className="mt-3">
                <Btn onClick={() => setWord(randomWord())}>another word</Btn>
              </div>
            </div>
          )}
        </Card>
      )}

      {part === 'C' && (
        <Card>
          <h2 className="font-medium text-body">Space &amp; economy</h2>
          <p className="mt-2 leading-relaxed text-dim">
            Dots only on the first half of the bar — the empty cells are{' '}
            <span className="text-body">rests, on purpose</span>. Say a short
            phrase, then breathe for the rest of the bar. Do it four bars in a
            row without filling the gap. Breath and space are what keep even a
            dense verse calm; silence is a flex, not a failure.
          </p>
        </Card>
      )}

      {part === 'D' && (
        <Card>
          <h2 className="font-medium text-body">Relaxed tone</h2>
          <p className="mt-2 leading-relaxed text-dim">
            No grid for this one — it lives in your throat, not on the beat.
            Coaching cues, check them while you rap:
          </p>
          <ul className="mt-4 space-y-2.5 text-body">
            <li>· Keep the voice LOW — near your speaking pitch, not above it.</li>
            <li>· Conversational — like explaining something to a friend on a chhat at dusk.</li>
            <li>· Unforced — if a line needs a push to land, the line is wrong, not your lungs.</li>
            <li>· Don&rsquo;t rise at phrase ends; let them settle downward.</li>
            <li>· Smile slightly. It audibly relaxes the tone. (Snoop is always half-smiling.)</li>
          </ul>
        </Card>
      )}

      {part === 'X' && (
        <Card>
          <h2 className="font-medium text-body">Combine — the magic</h2>
          <p className="mt-2 leading-relaxed text-dim">
            All four at once over the tabla pulse: late pocket + stretched
            vowels + real rests + low easy tone. Start at ~90 BPM (G-funk
            range). When a pass feels smooth, nudge the tempo up and prove the
            feel survives — because{' '}
            <span className="text-amber">
              laid-back is about placement and tone, not slow speed.
            </span>
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Btn onClick={() => setState((s) => ({ ...s, bpm: Math.min(200, s.bpm + 5) }))}>
              +5 BPM
            </Btn>
            <Btn onClick={() => setState((s) => ({ ...s, bpm: 90 }))}>back to 90</Btn>
            <span className="text-sm text-dim">{state.bpm} BPM now</span>
          </div>
        </Card>
      )}

      <Card className="mt-6">
        <Transport
          engine={engine}
          state={state}
          setState={setState}
          lock={{ sig: true }}
        />
        <BeatLight engine={engine} running={state.running} />
        {gridProps && (
          <SyllableGrid
            slots={slots}
            engine={engine}
            running={state.running}
            {...gridProps}
          />
        )}
        <Note className="mt-3">
          Tabla-feel voice is the default bed here — the dha/tin pulse carries
          the same lilt a G-funk bounce does.
        </Note>
      </Card>

      <div className="mt-6 flex justify-center">
        <Btn primary onClick={done} className="px-8 py-3">
          practiced it — count it
        </Btn>
      </div>
    </Page>
  )
}
