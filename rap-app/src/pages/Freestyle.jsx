import { useEffect, useMemo, useRef, useState } from 'react'
import { Page, Card, Btn, Seg, TextInput, Note, Field } from '../components/ui'
import {
  rhymeGroups,
  allWords,
  randomWord,
  searchWords,
  searchLines,
  lines,
  LINE_TYPES,
  scriptOf,
} from '../lib/data'
import { randomScene } from '../lib/scenes'
import { markToday } from '../lib/tracker'

const FONT_BY_SCRIPT = {
  devanagari: { fontFamily: 'var(--font-deva)' },
  nastaliq: { fontFamily: 'var(--font-nastaliq)', lineHeight: 2 },
  roman: {},
}

export function ScriptText({ text, className = '' }) {
  return (
    <span className={className} style={FONT_BY_SCRIPT[scriptOf(text)]}>
      {text}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* a. RANDOM WORD GENERATOR — one big word, nothing else               */
/* ------------------------------------------------------------------ */

function WordGen() {
  const [ending, setEnding] = useState('') // '' = all groups
  const [current, setCurrent] = useState(() => randomWord())
  const [auto, setAuto] = useState(0) // seconds; 0 = off
  const timer = useRef(null)

  function next(e = ending) {
    setCurrent(randomWord(e || null))
  }

  useEffect(() => {
    if (auto > 0) {
      timer.current = setInterval(() => next(), auto * 1000)
      return () => clearInterval(timer.current)
    }
  }, [auto, ending]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <Field label="Rhyme family">
          <select
            value={ending}
            onChange={(e) => {
              setEnding(e.target.value)
              setCurrent(randomWord(e.target.value || null))
            }}
            className="rounded-lg border border-edge bg-ink px-3 py-2 text-body"
          >
            <option value="">all groups</option>
            {rhymeGroups.map((g) => (
              <option key={g.ending} value={g.ending}>
                -{g.ending} ({g.words.length})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Auto-advance">
          <select
            value={auto}
            onChange={(e) => setAuto(Number(e.target.value))}
            className="rounded-lg border border-edge bg-ink px-3 py-2 text-body"
          >
            <option value={0}>off</option>
            {[4, 6, 8, 10, 15, 20, 30].map((s) => (
              <option key={s} value={s}>
                every {s}s
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Card className="flex min-h-72 flex-col items-center justify-center text-center">
        {current ? (
          <>
            <ScriptText
              text={current.word}
              className="text-4xl font-semibold text-body sm:text-5xl"
            />
            <div className="mt-4 text-sm text-faint">-{current.ending}</div>
          </>
        ) : (
          <Note>No words in the bank yet.</Note>
        )}
      </Card>

      <div className="mt-6 flex justify-center">
        <Btn primary onClick={() => next()} className="px-10 py-3 text-base">
          next word
        </Btn>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* b. RHYME BANK — present what's grouped; search shows the ending     */
/* ------------------------------------------------------------------ */

function RhymeBank() {
  const [selected, setSelected] = useState(rhymeGroups[0]?.ending ?? null)
  const [q, setQ] = useState('')
  const results = useMemo(() => searchWords(q), [q])
  const group = rhymeGroups.find((g) => g.ending === selected)

  return (
    <div>
      <TextInput
        placeholder="search all words (Roman)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {q.trim() ? (
        <Card className="mt-4">
          {results.length === 0 && <Note>Nothing matches.</Note>}
          <ul className="space-y-2">
            {results.map((w, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4">
                <ScriptText text={w.word} className="text-body" />
                <button
                  className="shrink-0 text-xs text-amber hover:underline"
                  onClick={() => {
                    setQ('')
                    setSelected(w.ending)
                  }}
                >
                  -{w.ending}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {rhymeGroups.map((g) => (
              <button
                key={g.ending}
                onClick={() => setSelected(g.ending)}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  selected === g.ending
                    ? 'border-amber/50 bg-amber-soft text-amber'
                    : 'border-edge text-dim hover:text-body'
                }`}
              >
                -{g.ending}
                <span className="ml-1.5 text-xs opacity-60">
                  {g.words.length}
                </span>
              </button>
            ))}
          </div>
          {group && (
            <Card className="mt-4">
              <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                {group.words.map((w, i) => (
                  <ScriptText key={i} text={w} className="text-body" />
                ))}
              </div>
            </Card>
          )}
        </>
      )}
      <Note className="mt-4">
        {allWords.length} words across {rhymeGroups.length} rhyme families —
        all yours, from your own pages.
      </Note>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* c. LINES / PHRASE BANK — my lines, muhavare, ideas, quotes          */
/* ------------------------------------------------------------------ */

function LinesBank() {
  const [type, setType] = useState('all')
  const [q, setQ] = useState('')
  const results = useMemo(
    () => searchLines(q, type === 'all' ? null : type),
    [q, type],
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Seg options={['all', ...LINE_TYPES]} value={type} onChange={setType} />
      </div>
      <TextInput
        placeholder="search your lines (Roman)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="mt-4 space-y-3">
        {results.length === 0 && (
          <Card>
            <Note>Nothing here yet.</Note>
          </Card>
        )}
        {results.map((l, i) => (
          <Card key={i} className="p-4">
            <ScriptText
              text={l.text}
              className="mixed-script leading-relaxed text-body"
            />
            <div className="mt-2 flex gap-3 text-xs text-faint">
              <span className="uppercase tracking-wider">{l.type}</span>
              {l.artist && <span className="text-amber">— {l.artist}</span>}
            </div>
          </Card>
        ))}
      </div>
      <Note className="mt-4">{lines.length} entries in the bank.</Note>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* d. DRILLS — Harry Mack's incremental method: one skill, then stack  */
/* ------------------------------------------------------------------ */

const LEVELS = [
  {
    id: 'L1',
    name: 'L1 · one skill',
    cueCount: 1,
    blurb:
      'Train ONE thing in isolation. Rhyme off one word, or hold a flow, or describe one scene. Repetition over brilliance.',
  },
  {
    id: 'L2',
    name: 'L2 · two combined',
    cueCount: 2,
    blurb:
      'Stack two skills: rhyme the word WHILE describing the scene. Slightly uncomfortable is the right difficulty.',
  },
  {
    id: 'L3',
    name: 'L3 · magic',
    cueCount: 3,
    blurb:
      'Everything at once — word, scene, and the beat. When each piece is drilled alone, combining them feels like magic.',
  },
]

function makeCues(count) {
  // Cue order mirrors the method: word first, then visual, then sound.
  const cues = []
  const w = randomWord()
  if (w)
    cues.push({
      kind: 'word',
      label: 'Word cue',
      value: `${w.word}  (-${w.ending})`,
    })
  cues.push({ kind: 'scene', label: 'Visual cue', value: randomScene() })
  cues.push({
    kind: 'sound',
    label: 'Sound cue',
    value: 'Bring in the beat — keep your flow locked to it',
    link: '#/beat',
  })
  return cues.slice(0, count)
}

function Drills() {
  const [level, setLevel] = useState('L1')
  const [cues, setCues] = useState(null)
  const [step, setStep] = useState(0) // reveal one prompt at a time
  const [done, setDone] = useState(false)
  const lvl = LEVELS.find((l) => l.id === level)

  function start() {
    setCues(makeCues(lvl.cueCount))
    setStep(0)
    setDone(false)
  }

  function finish() {
    markToday('freestyle')
    setDone(true)
  }

  return (
    <div>
      <Seg
        options={LEVELS.map((l) => ({ value: l.id, label: l.name }))}
        value={level}
        onChange={(v) => {
          setLevel(v)
          setCues(null)
          setDone(false)
        }}
      />
      <Note className="mt-3">{lvl.blurb}</Note>

      {!cues && !done && (
        <div className="mt-8 flex justify-center">
          <Btn primary onClick={start} className="px-10 py-3 text-base">
            start drill
          </Btn>
        </div>
      )}

      {cues && !done && (
        <>
          {/* ONE prompt on screen at a time */}
          <Card className="mt-6 flex min-h-64 flex-col items-center justify-center text-center">
            <div className="text-xs uppercase tracking-[0.2em] text-faint">
              {cues[step].label} · {step + 1}/{cues.length}
            </div>
            <div className="mt-5 max-w-md text-2xl leading-relaxed text-body">
              <ScriptText text={cues[step].value} />
            </div>
            {cues[step].link && (
              <a
                href={cues[step].link}
                className="mt-4 text-sm text-amber hover:underline"
              >
                open the beat engine →
              </a>
            )}
          </Card>
          <div className="mt-6 flex justify-center gap-3">
            {step < cues.length - 1 ? (
              <Btn primary onClick={() => setStep(step + 1)}>
                add next cue
              </Btn>
            ) : (
              <Btn primary onClick={finish}>
                done — count it
              </Btn>
            )}
            <Btn onClick={start}>reroll</Btn>
          </div>
        </>
      )}

      {done && (
        <Card className="mt-6 py-10 text-center">
          <p className="text-sage">Freestyle ticked for today.</p>
          <p className="mt-2 text-sm text-dim">
            Done beats perfect. One more only if it feels light.
          </p>
          <div className="mt-5">
            <Btn onClick={start}>one more</Btn>
          </div>
        </Card>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

const TABS = [
  { value: 'word', label: 'Word Gen' },
  { value: 'rhymes', label: 'Rhyme Bank' },
  { value: 'lines', label: 'Lines' },
  { value: 'drills', label: 'Drills' },
]

export default function Freestyle() {
  const [tab, setTab] = useState('word')
  return (
    <Page title="Freestyle Trainer" kicker="wordsmith × musicality">
      <Seg options={TABS} value={tab} onChange={setTab} className="mb-8" />
      {tab === 'word' && <WordGen />}
      {tab === 'rhymes' && <RhymeBank />}
      {tab === 'lines' && <LinesBank />}
      {tab === 'drills' && <Drills />}
    </Page>
  )
}
