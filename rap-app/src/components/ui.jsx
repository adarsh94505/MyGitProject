// Tiny shared UI kit. Calm by design: one accent, generous spacing,
// no badges, no counters begging for attention.

export function Page({ title, kicker, children }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
      <a
        href="#/"
        className="text-sm text-faint hover:text-dim"
        aria-label="Back home"
      >
        &larr; home
      </a>
      <header className="mb-10 mt-6">
        {kicker && (
          <div className="mb-1 text-xs uppercase tracking-[0.2em] text-faint">
            {kicker}
          </div>
        )}
        <h1 className="text-2xl font-semibold text-body">{title}</h1>
      </header>
      {children}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-edge bg-surface p-6 ${className}`}
    >
      {children}
    </div>
  )
}

export function Btn({ children, primary, className = '', ...props }) {
  const style = primary
    ? 'bg-amber-soft text-amber border-amber/40 hover:border-amber'
    : 'bg-raise text-body border-edge hover:border-faint'
  return (
    <button
      type="button"
      className={`rounded-lg border px-4 py-2 text-sm ${style} disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Seg({ options, value, onChange, className = '' }) {
  return (
    <div className={`inline-flex flex-wrap gap-1 rounded-lg bg-raise p-1 ${className}`}>
      {options.map((opt) => {
        const v = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              value === v
                ? 'bg-surface text-amber'
                : 'text-dim hover:text-body'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs uppercase tracking-wider text-faint">
        {label}
      </div>
      {children}
    </label>
  )
}

export function TextInput({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-edge bg-ink px-3 py-2 text-body placeholder:text-faint focus:border-amber/50 focus:outline-none ${className}`}
      {...props}
    />
  )
}

export function Note({ children, className = '' }) {
  return (
    <p className={`text-sm leading-relaxed text-dim ${className}`}>
      {children}
    </p>
  )
}
