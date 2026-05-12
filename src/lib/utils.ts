export function generateId(): string {
  return crypto.randomUUID()
}

export function generateBatchId(): string {
  return `batch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  return d.toLocaleDateString('zh-CN')
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof document === 'undefined' || typeof navigator === 'undefined') return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }
}

export function cleanJsonText(raw: string): string {
  let text = raw.trim()
  text = text.replace(/^```(?:json)?\s*/i, '')
  text = text.replace(/\s*```\s*$/, '')
  text = text.replace(/,\s*}/g, '}')
  text = text.replace(/,\s*\]/g, ']')
  return text.trim()
}

export function scoreColor(score: number): string {
  if (score >= 8.0) return 'text-score-high'
  if (score >= 6.5) return 'text-score-mid'
  return 'text-score-low'
}
