import { useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import Tracker from './pages/Tracker.jsx'
import Freestyle from './pages/Freestyle.jsx'
import Beat from './pages/Beat.jsx'
import Musicality from './pages/Musicality.jsx'
import Signature from './pages/Signature.jsx'
import Wordsmith from './pages/Wordsmith.jsx'
import Feed from './pages/Feed.jsx'
import Focus from './pages/Focus.jsx'

// Hash-based routing — no dependency, works offline from file:// too.
export const ROUTES = {
  '': Home,
  tracker: Tracker,
  freestyle: Freestyle,
  beat: Beat,
  musicality: Musicality,
  signature: Signature,
  wordsmith: Wordsmith,
  feed: Feed,
  focus: Focus,
}

function useHashRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export default function App() {
  const route = useHashRoute()
  const Screen = ROUTES[route] ?? Home
  return (
    <div className="min-h-screen bg-ink">
      <Screen />
    </div>
  )
}
