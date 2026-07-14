// ---------------------------------------------------------------------------
// BEAT ENGINE — Web Audio API only. Every sound is synthesized in code;
// no samples, nothing copyrighted, nothing fetched from the network.
//
// Architecture: the classic lookahead scheduler (setInterval polls every
// 25ms and schedules audio events up to 120ms ahead on the AudioContext
// clock) — jitter-free timing without blocking the UI thread.
// ---------------------------------------------------------------------------

// Meter definitions. Two families:
//  - simple meters: slots = beats × subdivision (user-selectable 8ths/16ths/3s)
//  - compound/odd meters: fixed eighth-note pulse grid with accent groupings —
//    the grouping IS the lesson (e.g. 12/8 = four groups of three).
export const TIME_SIGNATURES = {
  '4/4': {
    label: '4/4',
    kind: 'simple',
    beats: 4,
    feel: 'common time — steady, four even beats. Most rap lives here.',
  },
  '3/4': {
    label: '3/4',
    kind: 'simple',
    beats: 3,
    feel: 'waltz time — three beats, ONE-two-three. Rounder, swaying.',
  },
  '6/8': {
    label: '6/8',
    kind: 'compound',
    groups: [3, 3],
    feel: 'compound duple — six quick pulses felt as TWO big beats of three. Lilting, rolling.',
  },
  '12/8': {
    label: '12/8',
    kind: 'compound',
    groups: [3, 3, 3, 3],
    feel: 'compound — four big beats, each split in three. The triplet feel: blues, shuffle, and many tabla thekas.',
  },
  '7/8': {
    label: '7/8',
    kind: 'compound',
    groups: [2, 2, 3],
    feel: 'odd meter — seven pulses grouped 2+2+3. Limps on purpose; count ONE-two ONE-two ONE-two-three.',
  },
}

export const SUBDIVISIONS = {
  8: { label: '8ths', perBeat: 2 },
  16: { label: '16ths', perBeat: 4 },
  3: { label: 'triplets', perBeat: 3 },
}

export const VOICES = {
  click: 'Click',
  wood: 'Woodblock',
  tabla: 'Tabla-feel',
}

// Build the slot layout for one bar.
// Returns [{ accent: 2|1|0 }] — 2 = downbeat, 1 = beat start, 0 = subdivision.
export function barLayout(sigKey, subdivision) {
  const sig = TIME_SIGNATURES[sigKey]
  if (sig.kind === 'simple') {
    const per = SUBDIVISIONS[subdivision].perBeat
    const slots = []
    for (let b = 0; b < sig.beats; b++) {
      for (let s = 0; s < per; s++) {
        slots.push({ accent: s !== 0 ? 0 : b === 0 ? 2 : 1 })
      }
    }
    return slots
  }
  // compound: one slot per eighth pulse, accents at group starts
  const slots = []
  sig.groups.forEach((len, gi) => {
    for (let p = 0; p < len; p++) {
      slots.push({ accent: p !== 0 ? 0 : gi === 0 ? 2 : 1 })
    }
  })
  return slots
}

// Duration of one bar in seconds. BPM always means quarter-note beats for
// simple meters; for compound meters it means the BIG beat (dotted group).
export function barSeconds(sigKey, bpm) {
  const sig = TIME_SIGNATURES[sigKey]
  const beatSec = 60 / bpm
  if (sig.kind === 'simple') return sig.beats * beatSec
  return sig.groups.length * beatSec
}

/* --- synthesized voices -------------------------------------------------- */

function envGain(ctx, time, peak, decay) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, time)
  g.gain.exponentialRampToValueAtTime(peak, time + 0.002)
  g.gain.exponentialRampToValueAtTime(0.0001, time + decay)
  g.connect(ctx.destination)
  return g
}

function playClick(ctx, time, accent) {
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = accent === 2 ? 1500 : accent === 1 ? 1100 : 880
  const peak = accent === 2 ? 0.5 : accent === 1 ? 0.35 : 0.18
  osc.connect(envGain(ctx, time, peak, 0.035))
  osc.start(time)
  osc.stop(time + 0.05)
}

function playWood(ctx, time, accent) {
  const osc = ctx.createOscillator()
  osc.type = 'square'
  osc.frequency.value = accent >= 1 ? 1300 : 900
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = osc.frequency.value
  bp.Q.value = 8
  const peak = accent === 2 ? 0.9 : accent === 1 ? 0.6 : 0.3
  const g = envGain(ctx, time, peak, 0.06)
  osc.connect(bp)
  bp.connect(g)
  osc.start(time)
  osc.stop(time + 0.08)
}

// Two-tone tabla-feel: low resonant "dha" on strong beats (pitch-dropping
// sine, like the baayan's bass), short high "tin" elsewhere (daayan-ish).
// A gesture at the theka, not a real tabla — synthesized, so it's ours.
function playTabla(ctx, time, accent) {
  if (accent >= 1) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(accent === 2 ? 170 : 140, time)
    osc.frequency.exponentialRampToValueAtTime(75, time + 0.16)
    const g = envGain(ctx, time, accent === 2 ? 0.9 : 0.6, 0.22)
    osc.connect(g)
    osc.start(time)
    osc.stop(time + 0.25)
  } else {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(580, time)
    osc.frequency.exponentialRampToValueAtTime(520, time + 0.05)
    const g = envGain(ctx, time, 0.2, 0.07)
    osc.connect(g)
    osc.start(time)
    osc.stop(time + 0.09)
  }
}

const VOICE_FNS = { click: playClick, wood: playWood, tabla: playTabla }

/* --- the engine ----------------------------------------------------------- */

export class BeatEngine {
  constructor() {
    this.ctx = null
    this.running = false
    this.bpm = 90
    this.sig = '4/4'
    this.subdivision = 8
    this.swing = 0 // 0..1 — consistent late shift of off-beat subdivisions
    this.voice = 'tabla'
    this.onSlot = null // callback({ slotIndex, accent, time })
    this._timer = null
    this._nextSlot = 0
    this._nextTime = 0
    this._barStart = 0
  }

  _ensureCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
  }

  layout() {
    return barLayout(this.sig, this.subdivision)
  }

  barSec() {
    return barSeconds(this.sig, this.bpm)
  }

  // Swing applies to simple meters: every 2nd 8th (or odd 16th) fires late.
  // swing=0 straight; swing=1 full triplet displacement of that pair.
  _swingOffset(slotIndex, slotSec) {
    if (this.swing <= 0) return 0
    const sig = TIME_SIGNATURES[this.sig]
    if (sig.kind !== 'simple') return 0
    if (slotIndex % 2 === 1) return this.swing * (slotSec / 3)
    return 0
  }

  start() {
    this._ensureCtx()
    if (this.running) return
    this.running = true
    this._nextSlot = 0
    this._nextTime = this.ctx.currentTime + 0.08
    this._barStart = this._nextTime
    this._timer = setInterval(() => this._schedule(), 25)
  }

  stop() {
    this.running = false
    if (this._timer) clearInterval(this._timer)
    this._timer = null
  }

  _schedule() {
    const AHEAD = 0.12
    while (this._nextTime < this.ctx.currentTime + AHEAD) {
      const slots = this.layout()
      const slotSec = this.barSec() / slots.length
      const i = this._nextSlot % slots.length
      if (i === 0) this._barStart = this._nextTime
      const t = this._nextTime + this._swingOffset(i, slotSec)
      const accent = slots[i].accent
      VOICE_FNS[this.voice](this.ctx, t, accent)
      if (this.onSlot) {
        this.onSlot({ slotIndex: i, accent, time: t })
      }
      this._nextSlot += 1
      this._nextTime += slotSec
    }
  }

  // 0..1 progress through the current bar — for the grid playhead (rAF).
  barProgress() {
    if (!this.running || !this.ctx) return 0
    const dur = this.barSec()
    const p = (this.ctx.currentTime - this._barStart) / dur
    return Math.max(0, p % 1)
  }
}

/* --- gentle chime (focus timer end — soft, never jarring) ----------------- */

export function playChime(existingCtx = null) {
  const ctx =
    existingCtx || new (window.AudioContext || window.webkitAudioContext)()
  const now = ctx.currentTime
  // two soft sine partials, slow attack, long release — like a singing bowl
  ;[
    { f: 523.25, g: 0.18, d: 2.4 },
    { f: 784.0, g: 0.08, d: 1.8 },
  ].forEach(({ f, g, d }) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = f
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(g, now + 0.15)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + d)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + d + 0.1)
  })
}
