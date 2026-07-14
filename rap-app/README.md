# Illahabadi — Riyaaz

Personal rap-training app for one user. Focus and motivation first: practice
tracker, freestyle trainer, synthesized beat engine with a visual syllable
grid, musicality + wordsmith curricula, the signature Laid-Back Flow module,
a one-pick daily feed, and an ADHD-friendly focus module.

**Fully offline.** All data local, all audio synthesized with the Web Audio
API, fonts self-hosted (bundled at build time). No accounts, no network
calls at runtime, no tracking. Progress lives in your browser's
localStorage.

## Run it

```bash
cd rap-app
npm install     # first time only
npm run dev     # then open the printed http://localhost:5173
```

`npm run build` + `npm run preview` serves the production build.

## Where things live

| What | Where |
|---|---|
| Your rhyme groups + lines | `src/data/seed-data.json` |
| Artists for the daily feed | `src/data/favorites.json` |
| Real beats you download | `public/beats/` (+ list filenames in `public/beats/manifest.json`) |
| Progress / streaks / shipped log | browser localStorage (keys prefixed `illahabadi.`) |

## Adding more of your writing

Append to `src/data/seed-data.json` following the existing shape — full
instructions in **NOTION_IMPORT.md**. The loader (`src/lib/data.js`)
tolerates partial/malformed entries, so a bad edit won't crash the app.

## Notion token (later, optional)

The app never needs it. When you want to automate imports:

1. Create an internal integration at notion.so/my-integrations and share
   your pages with it.
2. Create `rap-app/.env` (already gitignored) containing
   `NOTION_TOKEN=secret_...`
3. Build out `src/notion.js` — the stub reads the token and documents the
   mapping you need to implement. Run it as a Node script that appends to
   `seed-data.json`; keep the app itself token-free.

## Docs

- `NOTION_IMPORT.md` — how to append months of Notion pages to the seed
- `MUSICALITY_NOTES.md` — definitions behind the curriculum (+ tabla/G-funk note)
- `WORDSMITH_NOTES.md` — lyric-craft definitions to refine over time
- `BEATS_SOURCES.md` — where to legally download free beats
- `KNOWLEDGE_TRANSFER.md` — what was built and why
- `BUILD_NOTES.md` — assumptions and blockers from the build run
