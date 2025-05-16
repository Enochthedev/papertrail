"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Bookmark } from "lucide-react"

interface TableOfContentsProps {
  content: string
  currentSection: number
  onNavigate: (index: number) => void
  bookmarks?: { id: string; sectionIndex: number; title: string; createdAt: Date }[]
}

interface TocItem {
  text: string
  level: number
  index: number
  isBookmarked?: boolean
}

export function TableOfContents({ content, currentSection, onNavigate, bookmarks = [] }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,3}) (.+)$/gm
    const matches = [...content.matchAll(headingRegex)]

    const items: TocItem[] = []
    let sectionIndex = 0
    let lastMatchIndex = 0

    matches.forEach((match) => {
      const level = match[1].length
      const text = match[2].trim()
      const matchIndex = match.index || 0

      // Calculate section index
      if (matchIndex > lastMatchIndex) {
        const contentBetween = content.substring(lastMatchIndex, matchIndex)
        const sectionMatches = contentBetween.match(/(?=^#{1,3} .*$)/gm)
        if (sectionMatches) {
          sectionIndex += sectionMatches.length
        }
      }

      // Check if this section is bookmarked
      const isBookmarked = bookmarks.some((b) => b.sectionIndex === sectionIndex)

      items.push({
        text,
        level,
        index: sectionIndex,
        isBookmarked,
      })

      lastMatchIndex = matchIndex
    })

    setTocItems(items)
  }, [content, bookmarks])

  if (tocItems.length === 0) {
    return <div className="text-muted-foreground">No headings found</div>
  }

  return (
    <nav className="space-y-1">
      {tocItems.map((item, index) => (
        <button
          key={index}
          className={cn(
            "block w-full text-left px-2 py-1 rounded-md text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            item.index === currentSection && "bg-accent text-accent-foreground font-medium",
            item.level === 1 && "font-medium",
            item.level === 2 && "pl-4",
            item.level === 3 && "pl-6 text-xs",
          )}
          style={{ marginLeft: `${(item.level - 1) * 0.5}rem` }}
          onClick={() => onNavigate(item.index)}
        >
          <div className="flex items-center">
            <span className="truncate">{item.text}</span>
            {item.isBookmarked && <Bookmark className="h-3 w-3 ml-1 flex-shrink-0 text-primary" />}
          </div>
        </button>
      ))}
    </nav>
  )
}
