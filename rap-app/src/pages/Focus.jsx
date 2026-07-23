import { useEffect, useRef, useState } from 'react'
import { Page, Card, Btn, Note, TextInput } from '../components/ui'
import { playChime } from '../audio/engine'
import { useStored } from '../lib/storage'
import { markToday } from '../lib/tracker'
import { todayKey } from '../lib/dates'

// ADHD / FOCUS MODULE — protect attention with boring, proven techniques:
// time-boxing (a task gets a box; when the box ends, the task ends),
// implementation intentions ("when I sit down, I will X for Y minutes" —
// pre-deciding removes the start-up negotiation), single-tasking, and a
// gentle end (soft chime — the drill just ends, nothing startles you).
// Anti-perfectionism: a SHIPPED log — mark work done and let it go.
// No guilt, no shame, no pressure mechanics anywhere.

function fmt(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function FocusTimer({ intention }) {
  const [minutes, setMinutes] = useState(30)
  const [left, setLeft] = useState(null) // seconds; null = idle
  const [fullscreen, setFullscreen] = useState(false)
  const tick = useRef(null)

  function start() {
    setLeft(minutes * 60)
  }

  function stop() {
    setLeft(null)
    exitFs()
  }

  useEffect(() => {
    if (left === null) return
    if (left <= 0) {
      playChime()
      setLeft(null)
      exitFs()
      return
    }
    tick.current = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(tick.current)
  }, [left])

  async function enterFs() {
    setFullscreen(true)
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      /* fullscreen unsupported — the overlay still covers the app */
    }
  }
  function exitFs() {
    setFullscreen(false)
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  }

  const running = left !== null

  return (
    <>
      <Card>
        <h2 className="font-medium text-body">Single-task timer</h2>
        <Note className="mt-1">
          One drill, one box. It ends with a soft chime — no alarm, no siren.
          When the box ends, the task ends. That&rsquo;s time-boxing.
        </Note>

        {!running ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {[10, 20, 30, 45].map((m) => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  minutes === m
                    ? 'border-amber/50 bg-amber-soft text-amber'
                    : 'border-edge text-dim hover:text-body'
                }`}
              >
                {m} min
              </button>
            ))}
            <Btn primary onClick={start} className="ml-2 px-8">
              begin
            </Btn>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <div className="text-6xl font-semibold tabular-nums text-body">
              {fmt(left)}
            </div>
            <div className="mt-5 flex justify-center gap-3">
              <Btn onClick={enterFs}>go fullscreen</Btn>
              <Btn onClick={stop}>end early — that&rsquo;s fine</Btn>
            </div>
          </div>
        )}
      </Card>

      {/* distraction-free practice mode */}
      {fullscreen && running && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink">
          <div className="text-8xl font-semibold tabular-nums text-body">
            {fmt(left)}
          </div>
          {intention.what && (
            <p className="mt-8 max-w-md text-center text-lg text-dim">
              {intention.what}
            </p>
          )}
          <button
            onClick={exitFs}
            className="mt-16 text-sm text-faint hover:text-dim"
          >
            leave fullscreen
          </button>
        </div>
      )}
    </>
  )
}

function Intention({ intention, setIntention }) {
  return (
    <Card className="mt-6">
      <h2 className="font-medium text-body">Implementation intention</h2>
      <Note className="mt-1">
        Deciding in advance removes the hardest part — the negotiation with
        yourself at the start. Fill it once; it shows up in fullscreen mode.
      </Note>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-body">
        <span className="text-dim">When I sit down, I will</span>
        <TextInput
          className="w-64"
          placeholder="run the L2 pocket drill"
          value={intention.what}
          onChange={(e) =>
            setIntention({ ...intention, what: e.target.value })
          }
        />
        <span className="text-dim">for</span>
        <TextInput
          className="w-16 text-center"
          value={intention.minutes}
          onChange={(e) =>
            setIntention({ ...intention, minutes: e.target.value })
          }
        />
        <span className="text-dim">minutes.</span>
      </div>
    </Card>
  )
}

function ShippedLog() {
  const [shipped, setShipped] = useStored('shipped', [])
  const [text, setText] = useState('')

  function ship() {
    if (!text.trim()) return
    setShipped([{ text: text.trim(), date: todayKey() }, ...shipped])
    setText('')
    markToday('verse')
  }

  return (
    <Card className="mt-6">
      <h2 className="font-medium text-body">Shipped — the anti-perfectionism log</h2>
      <Note className="mt-1">
        Your obsessive streak wants one more polish pass. This list is the
        counterweight: mark it DONE and let it be imperfect in public (even if
        the public is just tomorrow&rsquo;s you). A finished draft teaches more
        than an endless edit.
      </Note>
      <div className="mt-4 flex gap-2">
        <TextInput
          placeholder="what did you finish? (verse, drill, hook…)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ship()}
        />
        <Btn primary onClick={ship} className="shrink-0">
          ship it
        </Btn>
      </div>
      {shipped.length > 0 && (
        <ul className="mt-5 space-y-2">
          {shipped.slice(0, 20).map((s, i) => (
            <li key={i} className="flex items-baseline justify-between gap-4">
              <span className="text-body">
                <span className="mr-2 text-sage">✓</span>
                {s.text}
              </span>
              <span className="shrink-0 text-xs text-faint">{s.date}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default function Focus() {
  const [intention, setIntention] = useStored('intention', {
    what: '',
    minutes: '30',
  })

  return (
    <Page title="Focus" kicker="protect the attention — it's the instrument">
      <FocusTimer intention={intention} />
      <Intention intention={intention} setIntention={setIntention} />
      <ShippedLog />
      <Note className="mt-8 text-center">
        Missed a day? Nothing here will scold you. Sit down, pick one box,
        begin.
      </Note>
    </Page>
  )
}
