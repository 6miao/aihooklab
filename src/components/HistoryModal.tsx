"use client"

import { useEffect, useMemo } from "react"
import type { HookResult } from "@/types"
import { PLATFORM_LABELS, CONTENT_TYPE_LABELS } from "@/lib/prompt"
import { formatTimestamp } from "@/lib/utils"

interface HistoryModalProps {
  open: boolean
  onClose: () => void
  history: HookResult[]
  copiedId: string | null
  onCopy: (text: string, id: string) => void
}

export default function HistoryModal({ open, onClose, history, copiedId, onCopy }: HistoryModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const grouped = useMemo(() => {
    const map = new Map<string, HookResult[]>()
    for (const h of history) {
      const existing = map.get(h.batchId) || []
      existing.push(h)
      map.set(h.batchId, existing)
    }
    return Array.from(map.entries())
  }, [history])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-primary border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">历史记录</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl leading-none cursor-pointer">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-12">还没有生成记录</p>
          ) : (
            <div className="space-y-6">
              {grouped.map(([batchId, hooks]) => (
                <div key={batchId}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-text-secondary text-xs">
                      {hooks[0].topic} · {PLATFORM_LABELS[hooks[0].platform]} · {CONTENT_TYPE_LABELS[hooks[0].contentType]}
                    </span>
                    <span className="text-text-secondary/60 text-xs">{formatTimestamp(hooks[0].timestamp)}</span>
                  </div>
                  <div className="space-y-2">
                    {hooks.map((hook) => (
                      <div key={hook.id} className="bg-bg-card border border-border rounded-lg px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="px-1.5 py-0.5 rounded text-xs bg-accent/15 text-accent-cyan border border-accent/30 shrink-0">
                            {hook.style}
                          </span>
                          <p className="text-text-primary text-sm truncate">{hook.text}</p>
                        </div>
                        <button
                          onClick={() => onCopy(hook.text, hook.id)}
                          className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer shrink-0 ml-3
                            ${copiedId === hook.id
                              ? 'bg-success/10 border-success/30 text-success'
                              : 'bg-bg-primary border-border text-text-secondary hover:text-text-primary'
                            }
                          `}
                        >
                          {copiedId === hook.id ? '已复制' : '复制'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
