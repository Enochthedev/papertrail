"use client"

import { useToast } from "@/hooks/use-toast"
import { Toast, ToastProvider, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { useEffect, useState } from "react"

export function ToastContainer() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} onClose={() => dismiss(toast.id)}>
          <div>
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
        </Toast>
      ))}
    </ToastProvider>
  )
}
