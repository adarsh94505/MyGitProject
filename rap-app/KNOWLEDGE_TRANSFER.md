# Knowledge transfer — what got built, decisions, what's left

Build run: 2026-07-14, fully autonomous, branch
`claude/illahabadi-rap-trainer-72asqw`, everything inside `rap-app/`
(nothing outside it was touched, per instruction).

## Status: ALL nine features built and smoke-tested

Verified with a headless-browser pass: every route renders with zero
console errors; tracker tick → streak works; beat engine starts/stops;
musicality "practiced" feeds the tracker. `npm run build` is clean.

## What exists

- **Stack**: Vite + React 19 + Tailwind v4 (CSS-first `@theme` in
  `src/index.css`). No router lib — tiny hash router in `App.jsx`
  (`#/tracker`, `#/beat`, …). All state in localStorage (`illahabadi.*`
  keys) via `src/lib/storage.js`.
- **Fonts**: Noto Sans Devanagari + Noto Nastaliq Urdu self-hosted via
  Fontsource packages, bundled at build time → offline. Script detection
  (`scriptOf` in `src/lib/data.js`) picks the right face per string.
- **Home** (`pages/Home.jsx`): mission banner ("Illahabadi — the Snoop
  Dogg of Allahabad. Perform. Be the best ever."), today's ticks +
  streak at a glance, grid of links. One tap to everything.
- **Tracker** (`pages/Tracker.jsx`, `lib/tracker.js`): 4-item daily
  checklist (Freestyle / 30-min verse drill / Musicality drill /
  Sang-worked). Streak + ~3-month calendar heatmap in sage green.
  Anti-distraction on purpose: no badges, no red, missed days stay quiet.
  Drills elsewhere call `markToday(taskId)` so practice auto-ticks.
- **Freestyle Trainer** (`pages/Freestyle.jsx`): word generator (from MY
  rhymeGroups only; lock-to-ending; auto-advance), rhyme bank (grouped as
  given, never re-inferred; Roman search shows the family), lines bank
  (type filter + search, artist tag on quotes), L1→L2→L3 drills (Harry
  Mack incremental stacking; word/visual/sound cues revealed ONE at a
  time; visual cues are Allahabad scene texts in `lib/scenes.js` — no
  image assets, stays offline).
- **Beat engine** (`audio/engine.js`): lookahead scheduler (25ms poll,
  120ms ahead) on the Web Audio clock. BPM 40–200, tap tempo. Signatures
  4/4, 3/4, 6/8, 12/8, 7/8 with feel text always displayed. Three synth
  voices: click, woodblock, two-tone tabla-feel (pitch-dropping low "dha"
  on strong beats, short high "tin" elsewhere). Downbeat always accented.
  Subdivisions 8ths/16ths/triplets (simple meters), swing slider
  (consistent late shift of off-beat subdivisions; disabled where it
  doesn't apply). Compound meters use eighth-pulse grids with accent
  groupings (12/8 = 3+3+3+3, 7/8 = 2+2+3).
- **Syllable grid** (`components/SyllableGrid.jsx`): one bar as cells,
  rAF playhead from `engine.barProgress()`, tap cells to place target
  dots, presets (on-beat / behind-the-beat / syncopated / triplet flow),
  `lateShift` draws dots late (the pocket made visible), `ghost` shows
  on-grid reference dots for comparison.
- **My Loops** (in `pages/Beat.jsx`): plays files from `public/beats/`
  listed in `public/beats/manifest.json` (currently empty; that's fine),
  plus a session-only local-file picker. `BEATS_SOURCES.md` explains
  where to get beats.
- **Musicality curriculum** (`lib/curriculum.js`, `pages/Musicality.jsx`):
  L0–L7, each = precise plain-language explanation + drill (engine
  auto-configures per level: signature, BPM, voice, preset) + combine
  drill pulling a rhyme-bank cue word. "Practiced it" increments a
  per-level count and ticks Musicality in the tracker.
- **Signature module** (`pages/Signature.jsx`): A pocket (ghost on-grid
  dots vs amber late dots, subtle→heavy-lazy slider), B vowel stretch
  (rhyme-bank word, glide 2–3 beats), C space & economy (dots on first
  half of bar, rest = breath), D relaxed tone (coaching cues), Combine
  (start 90 BPM, +5 nudges; states "laid-back is about placement and
  tone, not slow speed"). Tabla voice locked in as the default bed.
- **Wordsmith curriculum** (`pages/Wordsmith.jsx`): Surprise, Shapes &
  Details, Decorate-the-mundane vs Didactic, Storytelling, Imagery,
  Internal rhyme & Assonance — each with a drill templated around a cue
  pulled from MY banks. "Wrote it" ticks the verse drill.
- **Daily feed** (`pages/Feed.jsx`): ONE pick per day from
  `src/data/favorites.json`, alternating verse/ghazal by day parity
  (falls back if ghazal slots are empty), links OUT only — no lyrics
  stored, nothing to scroll.
- **Focus module** (`pages/Focus.jsx`): single-task timer (10/20/30/45)
  ending in a soft two-partial sine chime (`playChime`), time-boxing
  framing, persisted implementation intention shown in the distraction-
  free fullscreen mode, "Shipped" anti-perfectionism log (ships also tick
  the verse task). Copy is non-judgmental throughout; ending early is
  explicitly fine.
- **Data**: real seed from Adarsh's Notion extract in
  `src/data/seed-data.json` (3 rhyme families, 15 lines);
  `favorites.json` seeded with his artists + 2 empty ghazal slots.
  Loader is defensive (skips malformed entries). `src/notion.js` = stub,
  app never needs a token.

## Key decisions (and why)

1. **No router/state libraries** — hash router + localStorage hooks keep
   the bundle small and the app file-protocol-friendly; fewer deps = fewer
   ways to break offline.
2. **Visual cues are text scenes, not images** — keeps the build fully
   offline with zero assets; scenes are Allahabad-flavored on purpose.
3. **BPM = the big felt beat in compound meters** (12/8 at 70 ≈ four
   dotted-quarter beats/min) — matches how you'd tap along.
4. **Swing slider disabled for compound meters and triplet subdivision** —
   swing of triplet grids is musically ill-defined; avoiding it keeps the
   definitions honest.
5. **Heatmap green-only, no streak-loss states** — ADHD-friendly: reward
   presence, never punish absence.
6. **Loops need a manifest** — static sites can't list directories;
   `manifest.json` is one line per file and documented in three places.
7. **Tabla voice is a gesture, not a sample** — synthesized dha/tin
   two-tone; real tabla loops belong in `public/beats/` later.

## What's left / nice-to-haves (none blocking)

- Fill favorites.json links + the two ghazal slots (Rekhta).
- Real Notion import script (stub + docs are in place).
- Possible: per-drill history view; export/import of localStorage state;
  keyboard shortcut (space) for play/stop; a "displacement" grid overlay
  for L7 showing the 3-beat phrase cycling.
- Subdivision toggle order shows triplets first (numeric key order) —
  cosmetic only.
