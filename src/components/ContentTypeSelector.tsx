"use client"

import type { ContentType } from "@/types"
import { CONTENT_TYPE_LABELS } from "@/lib/prompt"

const types: ContentType[] = ['video', 'image-text', 'product-ad', 'tutorial', 'opinion']

interface ContentTypeSelectorProps {
  value: ContentType
  onChange: (t: ContentType) => void
  disabled: boolean
}

export default function ContentTypeSelector({ value, onChange, disabled }: ContentTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">内容类型</label>
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            disabled={disabled}
            onClick={() => onChange(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border
              ${value === t
                ? 'bg-accent/20 border-accent text-accent-cyan shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-bg-card border-border text-text-secondary hover:border-border-hover hover:text-text-primary'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {CONTENT_TYPE_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  )
}
