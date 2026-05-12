"use client"

import { useState, useCallback, useEffect } from "react"
import type { HookResult } from "@/types"
import { STORAGE_KEYS, MAX_FAVORITES } from "@/lib/prompt"

function loadFavorites(): HookResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<HookResult[]>([])

  useEffect(() => {
    setFavorites(loadFavorites())
  }, [])

  const persist = useCallback((items: HookResult[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(items))
    } catch {
      // storage full — silently ignore
    }
  }, [])

  const toggle = useCallback(
    (hook: HookResult) => {
      setFavorites((prev) => {
        const exists = prev.find((f) => f.id === hook.id)
        let next: HookResult[]
        if (exists) {
          next = prev.filter((f) => f.id !== hook.id)
        } else {
          if (prev.length >= MAX_FAVORITES) {
            next = [...prev.slice(1), hook]
          } else {
            next = [...prev, hook]
          }
        }
        persist(next)
        return next
      })
    },
    [persist]
  )

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  )

  return { favorites, toggle, isFavorite }
}
