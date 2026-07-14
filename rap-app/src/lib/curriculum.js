// MUSICALITY CURRICULUM — incremental, one concept per level.
// Definitions are deliberately precise (microtiming ≠ swing ≠ syncopation).
// Method: learn the idea in plain words → drill it on the beat engine →
// combine with a wordsmith cue (Harry Mack's stack-one-skill-at-a-time).

export const MUSIC_LEVELS = [
  {
    id: 'L0',
    title: 'Rhythm fundamentals',
    explain:
      'Four words carry everything: BEAT (the steady pulse you nod to), BAR (a group of beats — usually four), TEMPO (how fast the beats come, in BPM), SUBDIVISION (slicing each beat into 2, 3 or 4 smaller pulses). Feel the "1" — the first beat of every bar. It is home. Everything you ever rap is placed relative to it.',
    drill:
      'Play 4/4 at 80 BPM. Count "1-2-3-4" out loud with the clicks, hitting the "1" harder — the engine accents it for you. Then clap the 8th-note subdivision ("1-and-2-and…") while still saying the beat numbers.',
    combine:
      'Keep counting the bar out loud, but replace every "1" with the cue word. Nothing else changes.',
    settings: { sig: '4/4', bpm: 80, subdivision: 8, swing: 0, voice: 'click' },
    preset: 'on',
  },
  {
    id: 'L1',
    title: 'Beat placement',
    explain:
      'Your first syllable is a dart; the target is one specific beat. Starting on beat 1 feels square and confident. Starting on 2, 3, or 4 changes the whole gesture of a line. Control over WHERE you enter is the first real flow skill.',
    drill:
      'Grid shows a dot on beat 1 — start a short line exactly there, four times. Then move the dot to beat 2 (tap the grid) and enter there. Then 3, then 4. Same line, four doorways.',
    combine:
      'Take a rhyme-bank word. Land IT (not just any syllable) on the target beat, with whatever run-up the line needs.',
    settings: { sig: '4/4', bpm: 85, subdivision: 8, swing: 0, voice: 'wood' },
    preset: 'on',
  },
  {
    id: 'L2',
    title: 'Pocket',
    explain:
      'POCKET = locking in slightly behind the kick and snare — felt more than heard. You are not late; you are relaxed. On-beat placement sounds correct; pocket placement sounds comfortable. This tiny lag is the core of laid-back flow (and of your Snoop north star).',
    drill:
      'Use the "behind the beat / pocket" preset — the dots sit a touch late. First rap ON the clicks for a bar, then let every syllable settle into the late dots. Alternate: one bar on, one bar pocket. Hear the difference.',
    combine:
      'Same alternation, but the line must rhyme off a cue word. Keep the pocket even while thinking of rhymes.',
    settings: { sig: '4/4', bpm: 88, subdivision: 8, swing: 0, voice: 'tabla' },
    preset: 'pocket',
  },
  {
    id: 'L3',
    title: 'Density',
    explain:
      'Same tempo, more syllables: 8ths (two per beat) → 16ths (four) → triplets (three, a rolling feel). Density is a dial, not a race. The skill is switching density mid-verse WITHOUT the tempo drifting.',
    drill:
      'At 85 BPM: fill a bar rapping steady 8ths (nonsense syllables are fine — "ta-ka"). Switch the subdivision toggle to 16ths and double up. Then triplets. The tempo never moves; only your syllable rate does.',
    combine:
      'Rhyme off a cue word in 8ths for one bar, then say the SAME line again in 16ths — stretch or chop it to fit.',
    settings: { sig: '4/4', bpm: 85, subdivision: 8, swing: 0, voice: 'click' },
    preset: 'triplet',
  },
  {
    id: 'L4',
    title: 'Syncopation',
    explain:
      'SYNCOPATION = putting rhythmic emphasis on the OFF-beats — the "and"s between the numbers. On-beat rap marches; syncopated rap bounces. It surprises the ear because the stress lands where the click is not.',
    drill:
      'Use the "syncopated (off-beats)" preset — dots on the "and"s only. Whisper the numbers, SPEAK on the dots. Start with one syllable per dot, then whole words.',
    combine:
      'Land the cue word itself on an off-beat, three bars in a row, a different off-beat each bar.',
    settings: { sig: '4/4', bpm: 85, subdivision: 8, swing: 0, voice: 'wood' },
    preset: 'sync',
  },
  {
    id: 'L5',
    title: 'Swing & micro-timing',
    explain:
      'Two different things, often confused. SWING = a CONSISTENT displacement of the off-beat subdivisions — every "and" arrives late by the same amount; it is a grid-wide rule. MICRO-TIMING = individual syllables landing slightly off-grid with a backward bias — wavy, lazy, "Dilla time", behind-the-beat feel; it is expressive and per-note. Swing is a setting; micro-timing is a touch.',
    drill:
      'Set swing to 0% and rap straight 8ths. Slide swing up to ~60% and let your "and"s ride the late clicks — that is swing. Then return swing to 0 and YOU drag only some syllables late on purpose — that is micro-timing.',
    combine:
      'Rhyme off a cue word twice: once straight over swung clicks, once lazy (your own drag) over straight clicks. Feel which one is the engine and which one is you.',
    settings: { sig: '4/4', bpm: 90, subdivision: 8, swing: 0.6, voice: 'click' },
    preset: 'on',
  },
  {
    id: 'L6',
    title: 'Time signatures',
    explain:
      '3/4 = three beats, a waltz sway. 6/8 = six quick pulses felt as TWO big beats of three — lilting. 12/8 = four big beats each split in three — the triplet feel of blues, shuffle, and many tabla thekas. The engine always shows the signature and its feel: read it, then feel it.',
    drill:
      'Cycle: 3/4 at 90, count "1-2-3". Then 6/8 — count "ONE-2-3-FOUR-5-6" feeling two big beats. Then 12/8 — nod on the four big beats while the triplets roll under. Speak one relaxed line in each.',
    combine:
      'Take a cue word and place it on the "1" of every bar in 12/8 — let the triplets carry you between landings.',
    settings: { sig: '12/8', bpm: 70, subdivision: 8, swing: 0, voice: 'tabla' },
    preset: 'on',
  },
  {
    id: 'L7',
    title: 'Displacement & polymeter (advanced)',
    explain:
      'POLYMETER = repeating a phrase whose length does NOT match the bar — say a 3-beat phrase over a 4-beat bar. The phrase starts somewhere new each bar and comes back around after 3 bars. It sounds like the rhyme is drifting across the beat on purpose. Displacement is the simpler cousin: take a phrase and start it one 8th later than before.',
    drill:
      'In 4/4, build a phrase exactly 3 beats long ("teen-ka-phrase-rest"). Loop it against the 4-beat bar and notice where the "1" catches it. Survive the full 3-bar cycle back to alignment.',
    combine:
      'Make the 3-beat phrase rhyme off a cue word, and keep the rhyme landing even as the phrase drifts.',
    settings: { sig: '4/4', bpm: 80, subdivision: 8, swing: 0, voice: 'wood' },
    preset: 'on',
  },
]
