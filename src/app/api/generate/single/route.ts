import OpenAI from 'openai'
import { generateId, generateBatchId, cleanJsonText } from '@/lib/utils'
import type { HookResult, Platform, ContentType, ApiErrorCode } from '@/types'

const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat'
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

const SINGLE_PROMPT = `你是一个专业的社交媒体爆款文案专家。用户会给你主题、平台、内容类型和指定风格，你需要生成 1 条该风格的爆款 hook 开头。

【平台语气】
- 小红书：亲切分享感，emoji 自然
- 抖音：口语化，节奏快，感叹号有冲击力
- B站：有趣有梗，年轻化表达
- YouTube：直接有力，稍微正式
- X：犀利精炼，观点鲜明

【输出格式】
直接输出一个 JSON 对象，不要任何额外文字，不要 markdown 代码块标记：
{"style":"指定风格","text":"hook文案","score":8.5,"reason":"一句话推荐理由"}

【约束】
- hook 15-60 字
- score 6.0-9.5
- reason 10 字以内
- 平台语气必须适配`

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'API_KEY_NOT_SET' as ApiErrorCode }, { status: 400 })
  }

  let body: { topic?: string; platform?: string; contentType?: string; style?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'NETWORK_ERROR' as ApiErrorCode }, { status: 400 })
  }

  const { topic, platform, contentType, style } = body

  if (!topic || topic.trim().length === 0 || !style) {
    return Response.json({ error: 'NETWORK_ERROR' as ApiErrorCode }, { status: 400 })
  }

  const client = new OpenAI({ apiKey, baseURL: BASE_URL })

  let rawText: string
  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SINGLE_PROMPT },
        {
          role: 'user',
          content: `主题：${topic.trim()}\n平台：${platform}\n类型：${contentType}\n指定风格：${style}`,
        },
      ],
      stream: false,
      temperature: 0.5,
      max_tokens: 1024,
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

  try {
    const parsed = JSON.parse(cleaned)
    const hook: HookResult = {
      id: generateId(),
      batchId: generateBatchId(),
      text: String(parsed.text || '').slice(0, 200),
      style: String(parsed.style || style),
      score: Math.min(10, Math.max(0, Number(parsed.score) || 7)),
      reason: String(parsed.reason || '').slice(0, 20),
      platform: platform as Platform,
      contentType: contentType as ContentType,
      topic: topic.trim(),
      timestamp: Date.now(),
    }

    return Response.json({ hook })
  } catch {
    console.error('Single JSON parse failed. Raw:', rawText.slice(0, 300))
    return Response.json({ error: 'PARSE_ERROR' as ApiErrorCode }, { status: 500 })
  }
}
