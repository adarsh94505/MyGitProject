// ---------------------------------------------------------------------------
// OPTIONAL Notion sync stub — the app NEVER requires this.
//
// Everything runs fully offline from src/data/seed-data.json. This module
// exists so that, later, a small script can pull my Notion pages and append
// them to seed-data.json. See NOTION_IMPORT.md for the manual process and
// the schema; this stub is the starting point for automating it.
//
// Usage (later, from Node — NOT from the browser app):
//   1. Create an internal Notion integration, share your pages with it.
//   2. Put NOTION_TOKEN=secret_... in rap-app/.env (gitignored).
//   3. Extend fetchNotionPages() below to walk your pages and map them
//      into { rhymeGroups, lines } — then merge into seed-data.json.
// ---------------------------------------------------------------------------

export function getNotionToken() {
  // Vite exposes env vars prefixed with VITE_; a plain Node script can read
  // process.env. Support both, tolerate neither existing.
  try {
    if (typeof process !== 'undefined' && process.env?.NOTION_TOKEN) {
      return process.env.NOTION_TOKEN
    }
  } catch {
    /* not in Node */
  }
  try {
    if (import.meta?.env?.VITE_NOTION_TOKEN) {
      return import.meta.env.VITE_NOTION_TOKEN
    }
  } catch {
    /* no Vite env */
  }
  return null
}

export function isNotionConfigured() {
  return getNotionToken() !== null
}

// Stub: returns an empty payload in the seed-data.json shape.
// Real implementation would call https://api.notion.com/v1/... with the token.
export async function fetchNotionPages() {
  const token = getNotionToken()
  if (!token) {
    return { ok: false, reason: 'no-token', rhymeGroups: [], lines: [] }
  }
  // TODO(adarsh): implement page walking + block-to-schema mapping here.
  return { ok: false, reason: 'not-implemented', rhymeGroups: [], lines: [] }
}
