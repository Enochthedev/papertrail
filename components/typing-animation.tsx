"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TypingAnimationProps {
  text: string
  className?: string
  speed?: number
}

export function TypingAnimation({ text, className, speed = 100 }: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <div className={cn("relative", className)}>
      <span>{displayText}</span>
      {!isComplete && <span className="animate-cursor-blink ml-0.5 inline-block h-5 w-0.5 bg-current"></span>}
    </div>
  )
}
