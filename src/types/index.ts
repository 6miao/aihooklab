export type Platform = 'xiaohongshu' | 'douyin' | 'bilibili' | 'youtube' | 'x'

export type ContentType = 'video' | 'image-text' | 'product-ad' | 'tutorial' | 'opinion'

export type GenerateStatus = 'idle' | 'generating' | 'done' | 'error'

export type ApiErrorCode =
  | 'API_KEY_NOT_SET'
  | 'API_KEY_INVALID'
  | 'CONTENT_BLOCKED'
  | 'PARSE_ERROR'
  | 'NETWORK_ERROR'

export interface HookResult {
  id: string
  batchId: string
  text: string
  style: string
  score: number
  reason: string
  platform: Platform
  contentType: ContentType
  topic: string
  timestamp: number
}

export interface DraftInput {
  topic: string
  platform: Platform
  contentType: ContentType
}
