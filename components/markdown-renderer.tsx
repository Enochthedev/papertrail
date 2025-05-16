"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useSettings } from "./settings-provider"
import { cn } from "@/lib/utils"
import { TypingHeader } from "./typing-header" // Import TypingHeader component

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { fontFamily, fontSize, lineHeight } = useSettings()
  const [hasVisitedBefore, setHasVisitedBefore] = useState(true)

  useEffect(() => {
    // Check if this is the first time viewing content in this session
    const hasVisited = sessionStorage.getItem("papertrail-content-visited")
    if (!hasVisited) {
      setHasVisitedBefore(false)
      sessionStorage.setItem("papertrail-content-visited", "true")
    }
  }, [])

  return (
    <div
      className={cn("book-content", fontFamily === "sans" && "sans")}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => {
            if (!hasVisitedBefore) {
              return <TypingHeader level={1} {...props} />
            }
            return <h1 {...props} />
          },
          h2: ({ node, ...props }) => {
            if (!hasVisitedBefore) {
              return <TypingHeader level={2} {...props} />
            }
            return <h2 {...props} />
          },
          h3: ({ node, ...props }) => {
            if (!hasVisitedBefore) {
              return <TypingHeader level={3} {...props} />
            }
            return <h3 {...props} />
          },
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          img: ({ node, ...props }) => <img {...props} className="max-w-full rounded-md" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
