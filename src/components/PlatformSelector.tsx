"use client"

import type { Platform } from "@/types"
import { PLATFORM_LABELS } from "@/lib/prompt"

const platforms: Platform[] = ['xiaohongshu', 'douyin', 'bilibili', 'youtube', 'x']

interface PlatformSelectorProps {
  value: Platform
  onChange: (p: Platform) => void
  disabled: boolean
}

export default function PlatformSelector({ value, onChange, disabled }: PlatformSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">选择平台</label>
      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <button
            key={p}
            disabled={disabled}
            onClick={() => onChange(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border
              ${value === p
                ? 'bg-accent/20 border-accent text-accent-cyan shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-bg-card border-border text-text-secondary hover:border-border-hover hover:text-text-primary'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {PLATFORM_LABELS[p]}
          </button>
        ))}
      </div>
    </div>
  )
}
