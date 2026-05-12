"use client"

import { useEffect } from "react"

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const bgMap: Record<ToastType, string> = {
    success: 'bg-success/10 border-success/30 text-success',
    error: 'bg-error/10 border-error/30 text-error',
    info: 'bg-accent/10 border-accent/30 text-accent-cyan',
  }

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg border px-5 py-3 text-sm shadow-lg backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] ${bgMap[type]}`}>
      {message}
    </div>
  )
}
