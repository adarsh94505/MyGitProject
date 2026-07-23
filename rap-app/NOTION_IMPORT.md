# Importing more data (Notion → seed-data.json)

All creative content the app uses lives in **`src/data/seed-data.json`**.
The seed shipped with the app is small; months of Notion pages get appended
here over time. The app hot-reloads the file in dev, so you see changes
immediately.

## The schema (exact)

```json
{
  "rhymeGroups": [
    { "ending": "aani", "words": ["kamani", "kahani"] }
  ],
  "lines": [
    { "type": "line", "text": "..." },
    { "type": "muhavara", "text": "..." },
    { "type": "idea", "text": "..." },
    { "type": "quote", "text": "...", "artist": "Mac Miller" }
  ]
}
```

Rules the loader (`src/lib/data.js`) enforces/tolerates:

- `rhymeGroups[].ending` must be a string; `words` a list of strings.
  Groups are presented **as grouped** — the app never re-infers endings.
- `lines[].type` should be one of `line | muhavara | idea | quote`;
  `artist` is optional and only really shown on quotes.
- Roman, Devanagari (देवनागरी), and Nastaliq (نستعلیق) text all work in
  display and search. Search is tuned for Roman.
- Malformed entries are silently skipped, never crash.

## Manual append (works today)

1. Open your Notion page, copy the words/lines.
2. Open `src/data/seed-data.json`.
3. To grow an existing rhyme family, add words to its `words` array.
   To add a new family, add a new `{ "ending": "...", "words": [...] }`.
4. Add lines/muhavare/ideas/quotes to `lines` with the right `type`.
5. Save. Check the app: Rhyme Bank and Lines counts update.
6. Commit: `git add src/data/seed-data.json && git commit -m "more seed"`

Tip: JSON is picky — trailing commas break it. If the app shows nothing,
run `npx -y jsonlint src/data/seed-data.json` or paste into a validator.

## Automated import (later)

`src/notion.js` is a documented stub: it reads `NOTION_TOKEN` from `.env`
and sketches `fetchNotionPages()`. The intended workflow:

1. Notion integration + token in `rap-app/.env` (gitignored; the app never
   requires it — everything works from seed-data.json alone).
2. Write a small Node script that calls the Notion API, maps blocks into
   the schema above, **merges** into the existing JSON (dedupe words by
   exact string within a group), and writes the file back.
3. Review the diff in git before committing — your writing deserves a
   human eye on every import.
