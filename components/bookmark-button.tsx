"use client"

import { useState, useEffect } from "react"
import { Bookmark, BookmarkX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useMarkdown } from "./markdown-provider"

interface BookmarkButtonProps {
  fileId: string
  sectionIndex: number
  sectionTitle: string
}

export function BookmarkButton({ fileId, sectionIndex, sectionTitle }: BookmarkButtonProps) {
  const { addBookmark, removeBookmark, getBookmarks } = useMarkdown()
  const { toast } = useToast()
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Check if the section is bookmarked when the component mounts or when dependencies change
  useEffect(() => {
    const bookmarks = getBookmarks(fileId)
    const bookmarked = bookmarks.some((b) => b.sectionIndex === sectionIndex)
    setIsBookmarked(bookmarked)
  }, [fileId, sectionIndex, getBookmarks])

  const toggleBookmark = () => {
    if (isBookmarked) {
      // Find the bookmark to remove
      const bookmarks = getBookmarks(fileId)
      const bookmark = bookmarks.find((b) => b.sectionIndex === sectionIndex)

      if (bookmark) {
        removeBookmark(fileId, bookmark.id)
        setIsBookmarked(false)
        toast({
          title: "Bookmark removed",
          description: `Removed bookmark for "${sectionTitle}"`,
        })
      }
    } else {
      addBookmark(fileId, sectionIndex, sectionTitle)
      setIsBookmarked(true)
      toast({
        title: "Bookmark added",
        description: `Added bookmark for "${sectionTitle}"`,
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleBookmark}
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? <BookmarkX className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
      <span className="sr-only">{isBookmarked ? "Remove bookmark" : "Add bookmark"}</span>
    </Button>
  )
}
