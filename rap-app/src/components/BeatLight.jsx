import { useEffect, useRef } from 'react'

// Visual beat indicator: one calm dot that breathes with the pulse.
// Downbeats glow amber and slightly larger; other slots are subtle.
export default function BeatLight({ engine, running }) {
  const dot = useRef(null)

  useEffect(() => {
    if (!engine) return
    engine.onSlot = ({ accent, time }) => {
      if (!dot.current || !engine.ctx) return
      const delay = Math.max(0, (time - engine.ctx.currentTime) * 1000)
      setTimeout(() => {
        const el = dot.current
        if (!el) return
        el.style.transition = 'none'
        if (accent === 2) {
          el.style.background = 'var(--color-amber)'
          el.style.transform = 'scale(1.5)'
        } else if (accent === 1) {
          el.style.background = 'var(--color-amber)'
          el.style.transform = 'scale(1.15)'
          el.style.opacity = 0.7
        } else {
          el.style.background = 'var(--color-dim)'
          el.style.transform = 'scale(1)'
          el.style.opacity = 0.5
        }
        requestAnimationFrame(() => {
          el.style.transition =
            'transform 180ms ease-out, opacity 180ms ease-out'
          el.style.transform = 'scale(1)'
          el.style.opacity = 0.35
        })
      }, delay)
    }
    return () => {
      engine.onSlot = null
    }
  }, [engine])

  return (
    <div className="flex h-10 items-center justify-center">
      <div
        ref={dot}
        className="h-4 w-4 rounded-full bg-edge"
        style={{ opacity: running ? 0.35 : 0.15 }}
      />
    </div>
  )
}
