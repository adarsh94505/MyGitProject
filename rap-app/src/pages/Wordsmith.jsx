import { useState } from 'react'
import { Page, Card, Btn, Note } from '../components/ui'
import { randomWord, randomLine } from '../lib/data'
import { markToday } from '../lib/tracker'
import { ScriptText } from './Freestyle'

// WORDSMITH CURRICULUM — fundamentals in the spirit of Lupe Fiasco's
// "Rap Theory & Practice". Each lesson: a plain-language idea + one
// writing/freestyle drill that pulls from MY banks. Definitions live in
// WORDSMITH_NOTES.md (project root) for refining later.

const LESSONS = [
  {
    id: 'surprise',
    title: 'Surprise',
    explain:
      'The "aha" — a revelation the listener didn\'t see coming but instantly accepts. A punchline is a SETUP that points one way and a PAYOFF that lands somewhere better. The setup does the real work: it plants the expectation the payoff flips.',
    drill: (cue) =>
      `Write 2 bars: bar one sets up "${cue}" innocently; bar two pays it off with a flip — a second meaning, a reversal, a zoom-out. If the payoff needs explaining, sharpen the setup instead.`,
    cueType: 'word',
  },
  {
    id: 'shapes',
    title: 'Shapes & details',
    explain:
      'Build the SHAPE first — where the rhymes land, how long the phrases are, where the pause sits. Then fill the shape with SPECIFIC detail. "Gaadi" is nothing; "battered blue Santro with one red door" is a world. Structure first, specificity second.',
    drill: (cue) =>
      `Sketch a 4-bar shape: rhyme at the end of bars 1, 2, 4; bar 3 runs long into a pause. Now fill it about "${cue}" using at least three specific details (a name, a number, a texture).`,
    cueType: 'scene',
  },
  {
    id: 'mundane',
    title: 'Decorate the mundane vs didactic',
    explain:
      'Two opposite modes, both essential. DECORATING THE MUNDANE: take everyday nitty-gritty (chai burning your tongue, queue at the ration shop) and render it vivid — the ordinary made luminous. DIDACTIC: teach the listener something true they can carry away. Practice both so you can choose, not default.',
    drill: (cue) =>
      `Two quick verses on "${cue}": first PURELY decorative — no lesson, just vivid life. Then PURELY didactic — teach one thing plainly. Notice which came easier; drill the other one twice as often.`,
    cueType: 'line',
  },
  {
    id: 'story',
    title: 'Storytelling',
    explain:
      'A story is change over time: someone wants something, something resists, something shifts. In 8–16 bars you have room for exactly one want, one obstacle, one turn. Start as close to the turn as possible — bar one should already be moving.',
    drill: (cue) =>
      `Tell an 8-bar story that begins with this line of yours as bar one: "${cue}". One character, one want, one turn. Land the last bar back on an image from bar one.`,
    cueType: 'line',
  },
  {
    id: 'imagery',
    title: 'Imagery',
    explain:
      'Abstractions slide off; images stick. "Mehnat" is a concept; "haath ki gathan" (the callus) is an image. Every abstract claim in a verse should be cashed into something the listener can see, hear, smell, or touch.',
    drill: (cue) =>
      `Take "${cue}". Write 4 bars where every single line contains one concrete sensory image and zero abstract nouns. If a line has "zindagi/mehnat/pyaar" in it, trade the word for what it looks like.`,
    cueType: 'scene',
  },
  {
    id: 'assonance',
    title: 'Internal rhyme & assonance',
    explain:
      "End rhyme is the skeleton; INTERNAL rhyme and ASSONANCE (repeating vowel sounds inside lines) are the muscle. Snoop's liquid, rolling sound is vowel repetition — the aa's and oo's chaining through the middle of the bar, not just the ends. Hindustani is gloriously rich in long vowels; use them.",
    drill: (cue) =>
      `Take the rhyme family of "${cue}" and write 2 bars where its vowel sound appears at least SIX times — inside the lines, not only at the ends. Read them aloud slow; they should pour, not tick.`,
    cueType: 'word',
  },
]

function makeCue(type) {
  if (type === 'word') {
    const w = randomWord()
    return w ? w.word : 'apna shehar'
  }
  if (type === 'line') {
    const l = randomLine('line') || randomLine()
    return l ? l.text : 'apni kahani'
  }
  // scene-ish: reuse an idea or muhavara for texture
  const l = randomLine('idea') || randomLine('muhavara') || randomLine()
  return l ? l.text : 'roz ki zindagi'
}

export default function Wordsmith() {
  const [openId, setOpenId] = useState(null)
  const [cue, setCue] = useState(null)
  const [done, setDone] = useState(false)
  const lesson = LESSONS.find((l) => l.id === openId)

  function open(l) {
    setCue(makeCue(l.cueType))
    setDone(false)
    setOpenId(l.id)
  }

  return (
    <Page title="Wordsmith" kicker="lyric craft — one mode at a time">
      {!lesson && (
        <div className="space-y-3">
          {LESSONS.map((l) => (
            <button
              key={l.id}
              onClick={() => open(l)}
              className="block w-full rounded-xl border border-edge bg-surface p-5 text-left hover:border-faint"
            >
              <span className="font-medium text-body">{l.title}</span>
            </button>
          ))}
          <Note className="pt-3">
            Definitions live in WORDSMITH_NOTES.md — refine them as you learn.
          </Note>
        </div>
      )}

      {lesson && (
        <div>
          <button
            onClick={() => setOpenId(null)}
            className="mb-4 text-sm text-faint hover:text-dim"
          >
            &larr; all lessons
          </button>
          <h2 className="text-xl font-medium text-body">{lesson.title}</h2>
          <Card className="mt-4">
            <p className="leading-relaxed text-dim">{lesson.explain}</p>
          </Card>
          <Card className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-faint">
              Drill · from your banks
            </div>
            <p className="leading-relaxed text-body">
              <ScriptText text={lesson.drill(cue)} className="mixed-script" />
            </p>
            <div className="mt-4 flex gap-3">
              <Btn onClick={() => setCue(makeCue(lesson.cueType))}>
                reroll cue
              </Btn>
            </div>
          </Card>
          <div className="mt-6 flex justify-center">
            {!done ? (
              <Btn
                primary
                className="px-8 py-3"
                onClick={() => {
                  markToday('verse')
                  setDone(true)
                }}
              >
                wrote it — count it
              </Btn>
            ) : (
              <p className="text-sm text-sage">
                Verse drill ticked for today. A finished draft beats a perfect fragment.
              </p>
            )}
          </div>
        </div>
      )}
    </Page>
  )
}
