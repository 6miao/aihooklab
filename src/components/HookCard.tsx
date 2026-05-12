"use client"

import type { HookResult } from "@/types"
import { scoreColor } from "@/lib/utils"

interface HookCardProps {
  hook: HookResult
  isFavorite: boolean
  isCopied: boolean
  onToggleFavorite: () => void
  onCopy: () => void
}

export default function HookCard({
  hook,
  isFavorite,
  isCopied,
  onToggleFavorite,
  onCopy,
}: HookCardProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-5 transition-all hover:border-border-hover hover:bg-bg-card-hover hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] group">
      <div className="flex justify-between items-start mb-3">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent-cyan border border-accent/30">
          {hook.style}
        </span>
        <button
          onClick={onToggleFavorite}
          className={`text-lg leading-none transition-colors cursor-pointer ${
            isFavorite ? 'text-error' : 'text-text-secondary/40 hover:text-error'
          }`}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <p className="text-text-primary text-sm leading-relaxed mb-4 min-h-[3rem]">
        {hook.text}
      </p>

      <div className="border-t border-border pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${scoreColor(hook.score)}`}>
            {hook.score.toFixed(1)}
          </span>
          <span className="text-text-secondary text-xs">{hook.reason}</span>
        </div>
        <button
          onClick={onCopy}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border
            ${isCopied
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-bg-primary border-border text-text-secondary opacity-0 group-hover:opacity-100 hover:text-text-primary hover:border-border-hover'
            }
          `}
        >
          {isCopied ? '已复制' : '复制'}
        </button>
      </div>
    </div>
  )
}
