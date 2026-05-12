"use client"

interface ApiKeyBannerProps {
  missing: boolean
  invalid: boolean
}

export default function ApiKeyBanner({ missing, invalid }: ApiKeyBannerProps) {
  if (!missing && !invalid) return null

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {missing && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          未检测到 API Key，请在项目根目录的 <code className="bg-error/20 px-1.5 py-0.5 rounded text-xs">.env.local</code> 中配置 <code className="bg-error/20 px-1.5 py-0.5 rounded text-xs">DEEPSEEK_API_KEY</code>
        </div>
      )}
      {invalid && !missing && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          API Key 无效或余额不足，请检查 <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="underline">DeepSeek 后台</a>
        </div>
      )}
    </div>
  )
}
