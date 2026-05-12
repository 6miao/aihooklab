"use client"

import { useState, useCallback } from "react"
import { copyToClipboard } from "@/lib/utils"

export function useClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = useCallback(async (text: string, id: string) => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
    return ok
  }, [])

  return { copiedId, copy }
}
