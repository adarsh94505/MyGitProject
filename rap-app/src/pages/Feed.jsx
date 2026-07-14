import { Page, Card, Note } from '../components/ui'
import { favorites } from '../lib/data'
import { dayOfYear } from '../lib/dates'

// DAILY FEED — exactly ONE pick per day, alternating rap verse and
// ghazal/nazm day by day so neither ever feels like homework.
// No lyrics are stored or shown — only artist, title, my note, and a link
// OUT (Rekhta / Genius / YouTube). Anti-feed by design: there is nothing
// to scroll and nothing more to load.

function todaysPick() {
  const day = dayOfYear()
  const wantType = day % 2 === 0 ? 'verse' : 'ghazal'
  let pool = favorites.filter((f) => f.type === wantType)
  if (pool.length === 0) {
    // e.g. ghazal slots not filled yet — fall back to the other type
    pool = favorites
  }
  if (pool.length === 0) return null
  return { pick: pool[Math.floor(day / 2) % pool.length], wantType }
}

export default function Feed() {
  const today = todaysPick()

  return (
    <Page title="Daily Feed" kicker="one pick — then go practice">
      {!today ? (
        <Card>
          <Note>
            favorites.json is empty. Add artists you love (see the file in
            src/data) and one pick will appear here each day.
          </Note>
        </Card>
      ) : (
        <Card className="py-10 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-faint">
            today&rsquo;s {today.pick.type === 'ghazal' ? 'ghazal / nazm' : 'verse'}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-body">
            {today.pick.artist || 'add an artist'}
          </h2>
          {today.pick.title && (
            <div className="mt-1 text-dim">{today.pick.title}</div>
          )}
          {today.pick.myNote && (
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-dim">
              &ldquo;{today.pick.myNote}&rdquo;
            </p>
          )}
          {today.pick.link ? (
            <a
              href={today.pick.link}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block text-amber hover:underline"
            >
              listen / read →
            </a>
          ) : (
            <Note className="mt-6">
              No link yet — add one in src/data/favorites.json (Genius, Rekhta,
              YouTube).
            </Note>
          )}
        </Card>
      )}
      <Note className="mt-6 text-center">
        That&rsquo;s the whole feed. One a day. Tomorrow alternates between a
        verse and a ghazal.
      </Note>
    </Page>
  )
}
