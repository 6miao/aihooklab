"use client"

interface HeaderProps {
  onOpenFavorites: () => void
  onOpenHistory: () => void
}

export default function Header({ onOpenFavorites, onOpenHistory }: HeaderProps) {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-accent-cyan bg-clip-text text-transparent">
            AIHookLab
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            AI 爆款文案 Hook 生成器
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onOpenFavorites}
            className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors text-sm cursor-pointer"
          >
            收藏
          </button>
          <button
            onClick={onOpenHistory}
            className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors text-sm cursor-pointer"
          >
            历史
          </button>
        </div>
      </div>
    </header>
  )
}
