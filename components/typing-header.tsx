"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TypingHeaderProps {
  children: React.ReactNode
  level: 1 | 2 | 3
  className?: string
  speed?: number
}

export function TypingHeader({ children, level, className, speed = 100 }: TypingHeaderProps) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < String(children).length) {
        setDisplayText((prev) => prev + String(children).charAt(index))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [children, speed])

  const HeaderTag = `h${level}` as keyof React.ReactHTML

  return (
    <HeaderTag className={cn("relative", className)}>
      <span>{displayText}</span>
      {!isComplete && <span className="animate-cursor-blink ml-0.5 inline-block h-5 w-0.5 bg-current"></span>}
    </HeaderTag>
  )
}
