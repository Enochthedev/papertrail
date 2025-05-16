"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, List, Bookmark, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "./markdown-provider"
import { MarkdownRenderer } from "./markdown-renderer"
import { TableOfContents } from "./table-of-contents"
import { BookmarkButton } from "./bookmark-button"
import { BookmarksList } from "./bookmarks-list"

interface ReaderPageProps {
  slug: string
}

export function ReaderPage({ slug }: ReaderPageProps) {
  const { getFile } = useMarkdown()
  const router = useRouter()
  const [file, setFile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [nextPage, setNextPage] = useState(1)
  const [isFlipping, setIsFlipping] = useState(false)
  const [showToc, setShowToc] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [sections, setSections] = useState<string[]>([])
  const [sectionTitles, setSectionTitles] = useState<string[]>([])
  const pageRef = useRef<HTMLDivElement>(null)
  const [readerMode, setReaderMode] = useState(false)

  // Memoize toggle functions to prevent unnecessary re-renders
  const toggleToc = useCallback(() => {
    setShowToc((prev) => !prev)
    setShowBookmarks(false)
  }, [])

  const toggleBookmarks = useCallback(() => {
    setShowBookmarks((prev) => !prev)
    setShowToc(false)
  }, [])

  const toggleReaderMode = useCallback(() => {
    try {
      const newMode = !readerMode
      setReaderMode(newMode)

      // Safely access document
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("reader-mode", newMode)
      }
    } catch (error) {
      console.error("Error toggling reader mode:", error)
    }
  }, [readerMode])

  // Fix: Remove getFile from the dependency array to prevent infinite loop
  useEffect(() => {
    const markdownFile = getFile(slug)
    if (markdownFile) {
      setFile(markdownFile)

      // Split content into sections (for pagination)
      const content = markdownFile.content
      const sectionRegex = /(?=^#{1,3} .*$)/gm
      const splitSections = content.split(sectionRegex).filter(Boolean)

      // If there are no headings, treat the whole content as one section
      const finalSections = splitSections.length > 0 ? splitSections : [content]
      setSections(finalSections)

      // Extract titles for each section
      const titles = finalSections.map((section) => {
        const titleMatch = section.match(/^#{1,3} (.+)$/m)
        return titleMatch ? titleMatch[1].trim() : "Untitled Section"
      })
      setSectionTitles(titles)
    } else {
      router.push("/upload")
    }
    setLoading(false)
  }, [slug, router]) // Removed getFile from dependencies

  const navigateToSection = useCallback(
    (index: number) => {
      if (index === currentPage) {
        setShowToc(false)
        setShowBookmarks(false)
        return
      }

      if (index < 0 || index >= sections.length || isFlipping) return

      setIsFlipping(true)

      try {
        // Simple fade transition
        const container = typeof document !== "undefined" ? document.querySelector(".reader-container") : null
        if (container) {
          container.classList.add("opacity-0")

          setTimeout(() => {
            setCurrentPage(index)

            setTimeout(() => {
              container.classList.remove("opacity-0")
              setIsFlipping(false)
              setShowToc(false)
              setShowBookmarks(false)
            }, 50)
          }, 200)
        } else {
          // Fallback if container not found
          setCurrentPage(index)
          setIsFlipping(false)
          setShowToc(false)
          setShowBookmarks(false)
        }
      } catch (error) {
        console.error("Error during page navigation:", error)
        // Fallback
        setCurrentPage(index)
        setIsFlipping(false)
        setShowToc(false)
        setShowBookmarks(false)
      }
    },
    [currentPage, isFlipping, sections.length],
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="animate-pulse text-2xl font-serif">Loading...</div>
      </div>
    )
  }

  if (!file) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="text-2xl font-serif">File not found</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] paper-texture">
      {/* Table of Contents Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 sm:w-72 md:w-80 bg-background border-r transform transition-transform duration-300 ease-in-out ${
          showToc ? "translate-x-0" : "-translate-x-full"
        } pt-14`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold">Table of Contents</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleToc}
              className="md:hidden"
              aria-label="Close table of contents"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <TableOfContents
              content={file.content}
              currentSection={currentPage}
              onNavigate={navigateToSection}
              bookmarks={file.bookmarks}
            />
          </div>
        </div>
      </div>

      {/* Bookmarks Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-64 sm:w-72 md:w-80 bg-background border-l transform transition-transform duration-300 ease-in-out ${
          showBookmarks ? "translate-x-0" : "translate-x-full"
        } pt-14`}
      >
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
          <div className="border-b p-4 flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold">Bookmarks</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBookmarks}
              className="md:hidden"
              aria-label="Close bookmarks"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <BookmarksList fileId={file.id} onNavigate={navigateToSection} onClose={() => setShowBookmarks(false)} />
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {(showToc || showBookmarks) && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-20"
          onClick={() => {
            setShowToc(false)
            setShowBookmarks(false)
          }}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="container max-w-4xl py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-8 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-serif font-bold truncate max-w-[60%]">{file.name}</h1>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <BookmarkButton fileId={file.id} sectionIndex={currentPage} sectionTitle={sectionTitles[currentPage]} />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleBookmarks}
                className={showBookmarks ? "bg-accent text-accent-foreground" : ""}
                aria-label="Toggle bookmarks"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleToc}
                className={showToc ? "bg-accent text-accent-foreground" : ""}
                aria-label="Toggle table of contents"
              >
                <List className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleReaderMode}>
                {readerMode ? "Exit Reader Mode" : "Enter Reader Mode"}
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="reader-container flex-1 bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8 h-full overflow-auto">
                <MarkdownRenderer content={sections[currentPage]} />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 sm:mt-6">
              <Button
                variant="outline"
                onClick={() => navigateToSection(currentPage - 1)}
                disabled={currentPage === 0 || isFlipping}
                className="px-2 sm:px-4"
                aria-label="Previous page"
              >
                <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="text-xs sm:text-sm text-muted-foreground font-serif">
                {currentPage + 1} / {sections.length}
              </div>

              <Button
                variant="outline"
                onClick={() => navigateToSection(currentPage + 1)}
                disabled={currentPage === sections.length - 1 || isFlipping}
                className="px-2 sm:px-4"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Floating exit reader mode button */}
      {readerMode && (
        <button
          onClick={toggleReaderMode}
          className="fixed bottom-4 right-4 bg-card/90 backdrop-blur-sm border shadow-sm rounded-full p-2 z-40 hover:bg-accent transition-colors"
          aria-label="Exit reader mode"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
