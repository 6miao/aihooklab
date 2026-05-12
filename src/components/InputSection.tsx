"use client"

import type { Platform, ContentType, GenerateStatus } from "@/types"
import PlatformSelector from "./PlatformSelector"
import ContentTypeSelector from "./ContentTypeSelector"
import GenerateButton from "./GenerateButton"

interface InputSectionProps {
  topic: string
  onTopicChange: (t: string) => void
  platform: Platform
  onPlatformChange: (p: Platform) => void
  contentType: ContentType
  onContentTypeChange: (c: ContentType) => void
  status: GenerateStatus
  progress: number
  onGenerate: () => void
}

export default function InputSection({
  topic,
  onTopicChange,
  platform,
  onPlatformChange,
  contentType,
  onContentTypeChange,
  status,
  progress,
  onGenerate,
}: InputSectionProps) {
  const isGenerating = status === 'generating'
  const topicTrimmed = topic.trim()
  const topicTooLong = topic.length > 200
  const canGenerate = topicTrimmed.length > 0 && !topicTooLong && !isGenerating

  return (
    <section className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            输入主题
            {topic.length > 0 && (
              <span className={`ml-2 ${topicTooLong ? 'text-error' : 'text-text-secondary'}`}>
                {topic.length}/200
              </span>
            )}
          </label>
          <textarea
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            disabled={isGenerating}
            placeholder="例如：iPhone 隐藏功能、新手健身误区、考研复习方法..."
            rows={3}
            maxLength={200}
            className={`w-full bg-bg-primary border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/50 resize-none outline-none transition-colors
              ${topicTooLong
                ? 'border-error focus:border-error'
                : 'border-border focus:border-accent'
              }
              ${isGenerating ? 'opacity-50' : ''}
            `}
          />
          {topicTooLong && (
            <p className="text-error text-xs mt-1">主题不能超过 200 字</p>
          )}
          {topic.length === 0 && (
            <p className="text-text-secondary text-xs mt-1">请输入主题后再生成</p>
          )}
        </div>

        <PlatformSelector
          value={platform}
          onChange={onPlatformChange}
          disabled={isGenerating}
        />

        <ContentTypeSelector
          value={contentType}
          onChange={onContentTypeChange}
          disabled={isGenerating}
        />

        <GenerateButton
          status={status}
          progress={progress}
          disabled={!canGenerate}
          onClick={onGenerate}
        />
      </div>
    </section>
  )
}
