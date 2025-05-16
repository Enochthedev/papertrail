"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { BookmarkIcon, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMarkdown } from "./markdown-provider"
import { cn } from "@/lib/utils"

interface BookmarksListProps {
  fileId: string
  onNavigate: (sectionIndex: number) => void
  onClose: () => void
}

type BookmarkType = {
  id: string
  sectionIndex: number
  title: string
  createdAt: Date
}

export function BookmarksList({ fileId, onNavigate, onClose }: BookmarksListProps) {
  const { getBookmarks, removeBookmark } = useMarkdown()
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [sortBy, setSortBy] = useState<"date" | "section">("date")

  useEffect(() => {
    const fetchedBookmarks = getBookmarks(fileId)
    setBookmarks(fetchedBookmarks)
  }, [fileId, getBookmarks])

  const handleRemoveBookmark = (bookmarkId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeBookmark(fileId, bookmarkId)
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId))
  }

  const handleNavigate = (sectionIndex: number) => {
    onNavigate(sectionIndex)
    onClose()
  }

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return a.sectionIndex - b.sectionIndex
    }
  })

  if (bookmarks.length === 0) {
    return (
      <div className="p-4 text-center">
        <BookmarkIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">No bookmarks yet</p>
        <p className="text-sm text-muted-foreground mt-1">Add bookmarks by clicking the bookmark icon while reading</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn("text-xs", sortBy === "date" && "bg-accent text-accent-foreground")}
            onClick={() => setSortBy("date")}
          >
            <Clock className="h-3 w-3 mr-1" />
            By Date
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("text-xs", sortBy === "section" && "bg-accent text-accent-foreground")}
            onClick={() => setSortBy("section")}
          >
            <BookmarkIcon className="h-3 w-3 mr-1" />
            By Section
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 cursor-pointer group"
              onClick={() => handleNavigate(bookmark.sectionIndex)}
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <BookmarkIcon className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{bookmark.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(bookmark.createdAt).toLocaleDateString()} • Section {bookmark.sectionIndex + 1}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleRemoveBookmark(bookmark.id, e)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove bookmark</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
