import { useEffect, useRef } from 'react'

// VISUAL SYLLABLE GRID — one bar as beats + subdivisions, a playhead sweeping
// in time, and target dots showing where syllables should land.
// Inspired by how Mazbou Q diagrams flow on a grid.
//
// props:
//   slots        [{ accent }] from engine.layout()
//   targets      Set of slot indices where a syllable should land
//   onToggle(i)  click a cell to place/remove a target dot
//   engine       BeatEngine instance (for the playhead)
//   running      whether transport is playing
//   lateShift    0..0.6 — draw target dots this fraction of a slot LATE
//                (the behind-the-beat pocket, made visible)
//   ghost        optional Set — faint "on-grid" reference dots (signature
//                module shows on-grid vs late side by side)
export default function SyllableGrid({
  slots,
  targets,
  onToggle,
  engine,
  running,
  lateShift = 0,
  ghost = null,
}) {
  const playheadRef = useRef(null)
  const raf = useRef(0)

  useEffect(() => {
    function tick() {
      if (playheadRef.current && engine) {
        const p = engine.barProgress()
        playheadRef.current.style.left = `${p * 100}%`
        playheadRef.current.style.opacity = running ? 1 : 0
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [engine, running])

  const n = slots.length

  return (
    <div className="relative select-none">
      {/* playhead */}
      <div
        ref={playheadRef}
        className="pointer-events-none absolute -top-1 bottom-0 w-0.5 bg-amber transition-opacity duration-300"
        style={{ left: 0, opacity: 0 }}
      />
      <div className="flex overflow-hidden rounded-lg border border-edge">
        {slots.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onToggle && onToggle(i)}
            title={`slot ${i + 1}`}
            className={`relative h-20 flex-1 border-edge ${
              i > 0 ? 'border-l' : ''
            } ${s.accent === 2 ? 'bg-raise' : s.accent === 1 ? 'bg-surface' : 'bg-ink'} hover:bg-raise`}
          >
            {/* beat number on accented slots */}
            {s.accent > 0 && (
              <span className="absolute left-1 top-1 text-[10px] text-faint">
                {slots.slice(0, i + 1).filter((x) => x.accent > 0).length}
              </span>
            )}
            {/* ghost reference dot (on-grid) */}
            {ghost && ghost.has(i) && (
              <span
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-faint/60"
                style={{ left: '50%' }}
              />
            )}
            {/* target dot, optionally drawn late */}
            {targets.has(i) && (
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber"
                style={{ left: `${50 + lateShift * 100}%` }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-faint">
        <span>bar starts</span>
        <span>{n} slots · tap a cell to place a syllable</span>
      </div>
    </div>
  )
}
