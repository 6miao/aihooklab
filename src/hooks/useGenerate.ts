"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { HookResult, Platform, ContentType, GenerateStatus, ApiErrorCode } from "@/types"

interface GenerateState {
  status: GenerateStatus
  hooks: HookResult[]
  progress: number
  error: string | null
  errorCode: ApiErrorCode | null
  regeneratingIndex: number | null
}

export function useGenerate() {
  const [state, setState] = useState<GenerateState>({
    status: 'idle',
    hooks: [],
    progress: 0,
    error: null,
    errorCode: null,
    regeneratingIndex: null,
  })
  const abortRef = useRef<AbortController | null>(null)

  const generate = useCallback(
    async (topic: string, platform: Platform, contentType: ContentType) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setState({ status: 'generating', hooks: [], progress: 0, error: null, errorCode: null, regeneratingIndex: null })

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, platform, contentType }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          const code = (body.error as ApiErrorCode) || 'NETWORK_ERROR'
          const messages: Record<ApiErrorCode, string> = {
            API_KEY_NOT_SET: '请在 .env.local 中配置 DEEPSEEK_API_KEY',
            API_KEY_INVALID: 'API Key 无效或余额不足，请检查 DeepSeek 后台',
            CONTENT_BLOCKED: '该主题暂不支持生成，请换个方向试试',
            PARSE_ERROR: 'AI 返回格式异常，请重试',
            NETWORK_ERROR: '请求超时，请检查网络后重试',
          }
          setState({
            status: 'error',
            hooks: [],
            progress: 0,
            error: messages[code],
            errorCode: code,
            regeneratingIndex: null,
          })
          return
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        const hooks: HookResult[] = []
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6))
                if (parsed.hook) {
                  hooks.push(parsed.hook)
                  setState({
                    status: 'generating',
                    hooks: [...hooks],
                    progress: hooks.length,
                    error: null,
                    errorCode: null,
                    regeneratingIndex: null,
                  })
                }
              } catch {
                // skip unparseable lines in SSE stream
              }
            }
          }
        }

        setState({
          status: 'done',
          hooks,
          progress: 10,
          error: null,
          errorCode: null,
          regeneratingIndex: null,
        })

        return hooks
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setState((prev) => ({
          status: 'error',
          hooks: prev.hooks,
          progress: prev.progress,
          error: `连接中断，已生成 ${prev.progress}/10 条，点击重试`,
          errorCode: 'NETWORK_ERROR',
          regeneratingIndex: null,
        }))
      }
    },
    []
  )

  const regenerateSingle = useCallback(
    async (index: number, style: string, topic: string, platform: Platform, contentType: ContentType) => {
      setState((prev) => ({ ...prev, regeneratingIndex: index }))

      try {
        const response = await fetch('/api/generate/single', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, platform, contentType, style }),
        })

        if (!response.ok) return

        const data = await response.json()
        if (!data.hook) return

        setState((prev) => {
          const next = [...prev.hooks]
          next[index] = data.hook
          return { ...prev, hooks: next, regeneratingIndex: null }
        })
      } catch {
        setState((prev) => ({ ...prev, regeneratingIndex: null }))
      }
    },
    []
  )

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ status: 'idle', hooks: [], progress: 0, error: null, errorCode: null, regeneratingIndex: null })
  }, [])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  return { ...state, generate, regenerateSingle, reset }
}
