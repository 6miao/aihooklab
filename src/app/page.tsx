"use client"

import { useState, useCallback, useEffect } from "react"
import type { Platform, ContentType } from "@/types"
import { STORAGE_KEYS } from "@/lib/prompt"
import { useGenerate } from "@/hooks/useGenerate"
import { useFavorites } from "@/hooks/useFavorites"
import { useHistory } from "@/hooks/useHistory"
import { useClipboard } from "@/hooks/useClipboard"
import Header from "@/components/Header"
import ApiKeyBanner from "@/components/ApiKeyBanner"
import InputSection from "@/components/InputSection"
import ResultsGrid from "@/components/ResultsGrid"
import FavoritesModal from "@/components/FavoritesModal"
import HistoryModal from "@/components/HistoryModal"
import Toast from "@/components/Toast"

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.draft)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveDraft(topic: string, platform: Platform, contentType: ContentType) {
  try {
    localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify({ topic, platform, contentType }))
  } catch {
    // ignore
  }
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState<Platform>('xiaohongshu')
  const [contentType, setContentType] = useState<ContentType>('video')
  const [favModalOpen, setFavModalOpen] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [draftLoaded, setDraftLoaded] = useState(false)

  const { status, hooks, progress, error, errorCode, regeneratingIndex, generate, regenerateSingle } = useGenerate()
  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites()
  const { history, addBatch } = useHistory()
  const { copiedId, copy } = useClipboard()

  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      if (draft.topic) setTopic(draft.topic)
      if (draft.platform) setPlatform(draft.platform)
      if (draft.contentType) setContentType(draft.contentType)
    }
    setDraftLoaded(true)
  }, [])

  useEffect(() => {
    if (draftLoaded) {
      saveDraft(topic, platform, contentType)
    }
  }, [topic, platform, contentType, draftLoaded])

  const handleGenerate = useCallback(async () => {
    const result = await generate(topic, platform, contentType)
    if (result && result.length > 0) {
      addBatch(result)
    }
  }, [topic, platform, contentType, generate, addBatch])

  const handleCopy = useCallback(
    async (text: string, id: string) => {
      const ok = await copy(text, id)
      if (ok) {
        setToast({ message: '已复制到剪贴板', type: 'success' })
      } else {
        setToast({ message: '复制失败，请手动选中复制', type: 'error' })
      }
    },
    [copy]
  )

  const handleRegenerate = useCallback(
    (index: number, style: string) => {
      regenerateSingle(index, style, topic, platform, contentType)
    },
    [regenerateSingle, topic, platform, contentType]
  )

  return (
    <div className="min-h-screen pb-16">
      <Header
        onOpenFavorites={() => setFavModalOpen(true)}
        onOpenHistory={() => setHistoryModalOpen(true)}
      />

      <ApiKeyBanner
        missing={errorCode === 'API_KEY_NOT_SET'}
        invalid={errorCode === 'API_KEY_INVALID'}
      />

      <InputSection
        topic={topic}
        onTopicChange={setTopic}
        platform={platform}
        onPlatformChange={setPlatform}
        contentType={contentType}
        onContentTypeChange={setContentType}
        status={status}
        progress={progress}
        onGenerate={handleGenerate}
      />

      <ResultsGrid
        status={status}
        hooks={hooks}
        progress={progress}
        error={error}
        regeneratingIndex={regeneratingIndex}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        copiedId={copiedId}
        onCopy={handleCopy}
        onRegenerate={handleRegenerate}
        onRetry={handleGenerate}
      />

      <FavoritesModal
        open={favModalOpen}
        onClose={() => setFavModalOpen(false)}
        favorites={favorites}
        onRemove={toggleFavorite}
        copiedId={copiedId}
        onCopy={handleCopy}
      />

      <HistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
        copiedId={copiedId}
        onCopy={handleCopy}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
