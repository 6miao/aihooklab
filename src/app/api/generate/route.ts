import OpenAI from 'openai'
import { SYSTEM_PROMPT } from '@/lib/prompt'
import { generateId, generateBatchId, cleanJsonText } from '@/lib/utils'
import type { HookResult, Platform, ContentType, ApiErrorCode } from '@/types'

const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat'
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'API_KEY_NOT_SET' as ApiErrorCode }, { status: 400 })
  }

  let body: { topic?: string; platform?: string; contentType?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'NETWORK_ERROR' as ApiErrorCode }, { status: 400 })
  }

  const { topic, platform, contentType } = body

  if (!topic || topic.trim().length === 0) {
    return Response.json({ error: 'NETWORK_ERROR' as ApiErrorCode }, { status: 400 })
  }

  const client = new OpenAI({ apiKey, baseURL: BASE_URL })

  let rawText: string
  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `主题：${topic.trim()}\n平台：${platform}\n类型：${contentType}`,
        },
      ],
      stream: false,
      temperature: 0.3,
      max_tokens: 4096,
    })

    rawText = completion.choices[0]?.message?.content || ''
  } catch (err: unknown) {
    const status = (err as { status?: number }).status
    if (status === 401 || status === 403) {
      return Response.json({ error: 'API_KEY_INVALID' as ApiErrorCode }, { status: 401 })
    }
    if (status === 400) {
      return Response.json({ error: 'CONTENT_BLOCKED' as ApiErrorCode }, { status: 422 })
    }
    console.error('DeepSeek API error:', err)
    return Response.json({ error: 'NETWORK_ERROR' as ApiErrorCode }, { status: 500 })
  }

  const cleaned = cleanJsonText(rawText)
  let hooks: HookResult[]

  try {
    const parsed = JSON.parse(cleaned)
    if (!Array.isArray(parsed)) throw new Error('Not an array')

    const batchId = generateBatchId()
    const timestamp = Date.now()

    hooks = parsed.slice(0, 10).map((item: Record<string, unknown>, index: number) => ({
      id: generateId(),
      batchId,
      text: String(item.text || '').slice(0, 200),
      style: String(item.style || `风格${index + 1}`),
      score: Math.min(10, Math.max(0, Number(item.score) || 7)),
      reason: String(item.reason || '').slice(0, 20),
      platform: platform as Platform,
      contentType: contentType as ContentType,
      topic: topic.trim(),
      timestamp,
    }))
  } catch {
    console.error('JSON parse failed. Raw text:', rawText.slice(0, 500))
    console.error('Cleaned text:', cleaned.slice(0, 500))
    return Response.json({ error: 'PARSE_ERROR' as ApiErrorCode }, { status: 500 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < hooks.length; i++) {
        const payload = JSON.stringify({ index: i, hook: hooks[i] })
        controller.enqueue(encoder.encode(`event: hook\ndata: ${payload}\n\n`))
        await new Promise((r) => setTimeout(r, 150))
      }
      controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
