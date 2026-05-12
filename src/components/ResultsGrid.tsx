"use client"

import type { HookResult, GenerateStatus } from "@/types"
import HookCard from "./HookCard"
import SkeletonCard from "./SkeletonCard"

interface ResultsGridProps {
  status: GenerateStatus
  hooks: HookResult[]
  progress: number
  error: string | null
  regeneratingIndex: number | null
  isFavorite: (id: string) => boolean
  onToggleFavorite: (hook: HookResult) => void
  copiedId: string | null
  onCopy: (text: string, id: string) => void
  onRegenerate: (index: number, style: string) => void
  onRetry: () => void
}

export default function ResultsGrid({
  status,
  hooks,
  progress,
  error,
  regeneratingIndex,
  isFavorite,
  onToggleFavorite,
  copiedId,
  onCopy,
  onRegenerate,
  onRetry,
}: ResultsGridProps) {
  if (status === 'idle') return null

  if (status === 'error') {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-error/5 border border-error/20 rounded-xl p-8 text-center">
          <p className="text-error text-sm mb-4">{error || '发生未知错误'}</p>
          <button
            onClick={onRetry}
            className="px-5 py-2 rounded-lg bg-error/10 border border-error/30 text-error text-sm hover:bg-error/20 transition-colors cursor-pointer"
          >
            重试
          </button>
        </div>
      </section>
    )
  }

  const totalSlots = 10
  const loadedCount = status === 'done' ? hooks.length : progress

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {hooks.map((hook, index) => (
          <HookCard
            key={hook.id}
            hook={hook}
            isFavorite={isFavorite(hook.id)}
            isCopied={copiedId === hook.id}
            isRegenerating={regeneratingIndex === index}
            onToggleFavorite={() => onToggleFavorite(hook)}
            onCopy={() => onCopy(hook.text, hook.id)}
            onRegenerate={() => onRegenerate(index, hook.style)}
          />
        ))}
        {Array.from({ length: totalSlots - loadedCount }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </div>
    </section>
  )
}
