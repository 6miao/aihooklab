"use client"

import { useEffect } from "react"
import type { HookResult } from "@/types"
import { PLATFORM_LABELS, CONTENT_TYPE_LABELS } from "@/lib/prompt"
import { formatTimestamp } from "@/lib/utils"

interface FavoritesModalProps {
  open: boolean
  onClose: () => void
  favorites: HookResult[]
  onRemove: (hook: HookResult) => void
  copiedId: string | null
  onCopy: (text: string, id: string) => void
}

export default function FavoritesModal({
  open,
  onClose,
  favorites,
  onRemove,
  copiedId,
  onCopy,
}: FavoritesModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-primary border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">收藏 ({favorites.length})</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl leading-none cursor-pointer">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {favorites.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-12">还没有收藏，去生成几个吧</p>
          ) : (
            <div className="space-y-3">
              {favorites.map((hook) => (
                <div key={hook.id} className="bg-bg-card border border-border rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent-cyan border border-accent/30">
                        {hook.style}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-bg-primary text-text-secondary border border-border">
                        {PLATFORM_LABELS[hook.platform]} · {CONTENT_TYPE_LABELS[hook.contentType]}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemove(hook)}
                      className="text-error/70 hover:text-error text-sm cursor-pointer ml-2 shrink-0"
                    >
                      取消收藏
                    </button>
                  </div>
                  <p className="text-text-primary text-sm mb-2">{hook.text}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-xs">{hook.topic} · {formatTimestamp(hook.timestamp)}</span>
                    <button
                      onClick={() => onCopy(hook.text, hook.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer
                        ${copiedId === hook.id
                          ? 'bg-success/10 border-success/30 text-success'
                          : 'bg-bg-primary border-border text-text-secondary hover:text-text-primary'
                        }
                      `}
                    >
                      {copiedId === hook.id ? '已复制' : '复制'}
                    </button>
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
