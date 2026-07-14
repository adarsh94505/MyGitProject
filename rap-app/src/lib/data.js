// ---------------------------------------------------------------------------
// DATA LOADER
//
// All creative content loads from src/data/seed-data.json (my own writing,
// exported from Notion) and src/data/favorites.json (artists I love — links
// out, never lyrics). The app works fully offline from these two files.
//
// To add more data later: append to the JSON files following the same schema.
// See NOTION_IMPORT.md at the project root for the exact steps and schema.
// ---------------------------------------------------------------------------

import seed from '../data/seed-data.json'
import favoritesRaw from '../data/favorites.json'

// --- normalization -------------------------------------------------------
// Be forgiving about shape so a hand-edited JSON never crashes the app.

function asArray(x) {
  return Array.isArray(x) ? x : []
}

export const rhymeGroups = asArray(seed.rhymeGroups)
  .filter((g) => g && typeof g.ending === 'string')
  .map((g) => ({ ending: g.ending, words: asArray(g.words).filter(Boolean) }))

export const lines = asArray(seed.lines).filter(
  (l) => l && typeof l.text === 'string' && l.text.trim(),
)

export const LINE_TYPES = ['line', 'muhavara', 'idea', 'quote']

export const favorites = asArray(favoritesRaw).filter(
  (f) => f && (f.artist || f.title),
)

// --- helpers -------------------------------------------------------------

// Flat list of { word, ending } across every group.
export const allWords = rhymeGroups.flatMap((g) =>
  g.words.map((word) => ({ word, ending: g.ending })),
)

export function randomWord(ending = null) {
  const pool = ending
    ? allWords.filter((w) => w.ending === ending)
    : allWords
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export function randomLine(type = null) {
  const pool = type ? lines.filter((l) => l.type === type) : lines
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// Roman-first search: case-insensitive substring match. Works on Devanagari
// and Nastaliq strings too (plain substring), but is tuned for Roman text.
export function normalize(s) {
  return (s || '').toLowerCase().normalize('NFC')
}

export function searchWords(query) {
  const q = normalize(query).trim()
  if (!q) return []
  return allWords.filter((w) => normalize(w.word).includes(q))
}

export function searchLines(query, type = null) {
  const q = normalize(query).trim()
  let pool = type ? lines.filter((l) => l.type === type) : lines
  if (!q) return pool
  return pool.filter(
    (l) =>
      normalize(l.text).includes(q) || normalize(l.artist).includes(q),
  )
}

// Rough script detection so the right Noto font can be applied per string.
export function scriptOf(text) {
  if (/[ऀ-ॿ]/.test(text)) return 'devanagari'
  if (/[؀-ۿݐ-ݿ]/.test(text)) return 'nastaliq'
  return 'roman'
}
