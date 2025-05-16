"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, List, Bookmark } from "lucide-react"
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
  const [isFlipping, setIsFlipping] = useState(false)
  const [showToc, setShowToc] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [sections, setSections] = useState<string[]>([])
  const [sectionTitles, setSectionTitles] = useState<string[]>([])
  const pageRef = useRef<HTMLDivElement>(null)

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
  }, [slug, getFile, router])

  const flipPage = (direction: "next" | "prev") => {
    if (isFlipping) return

    setIsFlipping(true)

    if (pageRef.current) {
      pageRef.current.classList.add("flipping")
    }

    setTimeout(() => {
      if (direction === "next" && currentPage < sections.length - 1) {
        setCurrentPage(currentPage + 1)
      } else if (direction === "prev" && currentPage > 0) {
        setCurrentPage(currentPage - 1)
      }

      if (pageRef.current) {
        pageRef.current.classList.remove("flipping")
      }

      setIsFlipping(false)
    }, 400) // Half the animation time
  }

  const navigateToSection = (index: number) => {
    if (index === currentPage) {
      setShowToc(false)
      setShowBookmarks(false)
      return
    }

    setIsFlipping(true)

    if (pageRef.current) {
      pageRef.current.classList.add("flipping")
    }

    setTimeout(() => {
      setCurrentPage(index)

      if (pageRef.current) {
        pageRef.current.classList.remove("flipping")
      }

      setIsFlipping(false)
      setShowToc(false)
      setShowBookmarks(false)
    }, 400)
  }

  const toggleSidebar = (sidebar: "toc" | "bookmarks") => {
    if (sidebar === "toc") {
      setShowToc(!showToc)
      setShowBookmarks(false)
    } else {
      setShowBookmarks(!showBookmarks)
      setShowToc(false)
    }
  }

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
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${showToc ? "translate-x-0" : "-translate-x-full"} pt-14`}
      >
        <div className="p-4">
          <h2 className="text-xl font-serif font-bold mb-4">Table of Contents</h2>
          <TableOfContents
            content={file.content}
            currentSection={currentPage}
            onNavigate={navigateToSection}
            bookmarks={file.bookmarks}
          />
        </div>
      </div>

      {/* Bookmarks Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-64 bg-background border-l transform transition-transform duration-300 ease-in-out ${showBookmarks ? "translate-x-0" : "translate-x-full"} pt-14`}
      >
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
          <div className="border-b p-4">
            <h2 className="text-xl font-serif font-bold">Bookmarks</h2>
          </div>
          <BookmarksList fileId={file.id} onNavigate={navigateToSection} onClose={() => setShowBookmarks(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="container max-w-4xl py-8 px-4 md:px-8 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-serif font-bold truncate">{file.name}</h1>
            <div className="flex items-center space-x-2">
              <BookmarkButton fileId={file.id} sectionIndex={currentPage} sectionTitle={sectionTitles[currentPage]} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSidebar("bookmarks")}
                className={showBookmarks ? "bg-accent text-accent-foreground" : ""}
              >
                <Bookmark className="h-5 w-5" />
                <span className="sr-only">Toggle Bookmarks</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSidebar("toc")}
                className={showToc ? "bg-accent text-accent-foreground" : ""}
              >
                <List className="h-5 w-5" />
                <span className="sr-only">Toggle Table of Contents</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="page-flip-container flex-1 flex flex-col">
              <div
                ref={pageRef}
                className="page flex-1 flex flex-col bg-card rounded-lg shadow-page dark:shadow-page-dark overflow-hidden page-curl"
              >
                <div className="page-front flex-1 p-6 md:p-8 overflow-y-auto">
                  <MarkdownRenderer content={sections[currentPage]} />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button variant="ghost" onClick={() => flipPage("prev")} disabled={currentPage === 0 || isFlipping}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-muted-foreground font-serif">
                Page {currentPage + 1} of {sections.length}
              </div>

              <Button
                variant="ghost"
                onClick={() => flipPage("next")}
                disabled={currentPage === sections.length - 1 || isFlipping}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
