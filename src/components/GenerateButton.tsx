"use client"

import type { GenerateStatus } from "@/types"

interface GenerateButtonProps {
  status: GenerateStatus
  progress: number
  disabled: boolean
  onClick: () => void
}

export default function GenerateButton({ status, progress, disabled, onClick }: GenerateButtonProps) {
  const isGenerating = status === 'generating'

  return (
    <button
      disabled={disabled || isGenerating}
      onClick={onClick}
      className={`w-full py-3.5 px-6 rounded-xl text-base font-semibold transition-all cursor-pointer
        ${disabled || isGenerating
          ? 'bg-bg-card text-text-secondary border border-border cursor-not-allowed'
          : 'bg-gradient-to-r from-accent to-accent-cyan text-white shadow-[0_0_24px_rgba(168,85,247,0.4)] hover:shadow-[0_0_36px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98]'
        }
      `}
    >
      {isGenerating ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          正在生成 {progress}/10...
        </span>
      ) : (
        '生成 10 个 Hook'
      )}
    </button>
  )
}
