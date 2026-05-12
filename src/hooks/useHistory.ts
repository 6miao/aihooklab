"use client"

import { useState, useCallback } from "react"
import type { HookResult } from "@/types"
import { STORAGE_KEYS, MAX_HISTORY } from "@/lib/prompt"

function loadHistory(): HookResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HookResult[]>(() => loadHistory())

  const addBatch = useCallback((hooks: HookResult[]) => {
    setHistory((prev) => {
      const next = [...hooks, ...prev].slice(0, MAX_HISTORY)
      try {
        localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(next))
      } catch {
        // storage full — silently ignore
      }
      return next
    })
  }, [])

  return { history, addBatch }
}
