# Build notes — blockers & assumptions (2026-07-14 run)

## Blockers

None. Network held for the whole run: npm installs (Vite scaffold,
Tailwind v4, Fontsource Noto fonts) all succeeded on first try. No
feature was skipped or stubbed due to failures.

## Assumptions made (autonomy mode — you were asleep)

1. **seed-data.json / favorites.json**: used the real files you uploaded
   with the request, copied verbatim into `src/data/`. Nothing invented.
2. **App name**: "Illahabadi — Riyaaz" (riyaaz = daily practice). Rename
   in `index.html` + `pages/Home.jsx` if it doesn't sit right.
3. **Visual cues** for freestyle drills are TEXT scenes (Allahabad
   everyday life, in `src/lib/scenes.js`) instead of images — keeps the
   app 100% offline with no asset downloads. Add/edit scenes freely.
4. **Tracker semantics**: a streak day = any day with ≥1 tick. Today
   doesn't break the streak while it's still empty (the day isn't over).
5. **BPM in compound meters** means the big felt beat (dotted group), not
   the eighth pulse.
6. **"Sang / worked today"** is only ticked manually — no drill
   auto-ticks it, since only you know if you actually sang.
7. **Daily feed parity**: even day-of-year = verse, odd = ghazal; while
   your ghazal slots are empty it falls back to the whole pool, so you
   always get exactly one pick.
8. **My Loops** requires listing filenames in
   `public/beats/manifest.json` (browsers can't list folders). Documented
   in BEATS_SOURCES.md and on the Beat page itself.
9. **Fonts**: shipped via @fontsource packages (bundled → offline). If
   `npm install` is ever run offline, the app still works — system fonts
   take over gracefully.
10. Scaffold's default README/App.css/assets inside `rap-app/` were
    replaced — everything OUTSIDE `rap-app/` was left untouched, per your
    instruction.

## Verification done

- `npm run build`: clean.
- Headless Chromium smoke test: all 9 routes render, zero console/page
  errors; tracker tick reflects on Home streak; beat engine schedules and
  stops; musicality "practiced" flow works end-to-end.
- Lint (oxlint): only two cosmetic fast-refresh warnings remain
  (shared exports in App.jsx/Transport.jsx) — harmless by design.
