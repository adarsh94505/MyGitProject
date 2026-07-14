// All persistent state lives in localStorage under one namespace.
// No other browser storage APIs are used (per spec).

const NS = 'illahabadi.'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — the app keeps working in memory
  }
}

import { useState, useCallback } from 'react'

// React hook over the same store. Single-user, single-tab tool:
// no cross-tab sync needed.
export function useStored(key, fallback) {
  const [value, setValue] = useState(() => load(key, fallback))
  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        save(key, resolved)
        return resolved
      })
    },
    [key],
  )
  return [value, set]
}
