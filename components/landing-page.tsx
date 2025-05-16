"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Book, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "./markdown-provider"
import { TypingAnimation } from "./typing-animation"

export function LandingPage() {
  const { recentFiles } = useMarkdown()
  const router = useRouter()
  const [hasVisited, setHasVisited] = useState(false)

  useEffect(() => {
    try {
      // Check if user has visited before
      const visited = localStorage.getItem("papertrail-visited")
      setHasVisited(!!visited)

      // Set visited flag
      if (!visited) {
        localStorage.setItem("papertrail-visited", "true")
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      // Fallback if localStorage is not available
      setHasVisited(false)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] paper-texture">
      <div className="max-w-3xl w-full mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
          <Book className="h-12 w-12 sm:h-16 sm:w-16 mb-4 text-primary" />
          {hasVisited ? (
            <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-3 sm:mb-4">Welcome to Papertrail</h1>
          ) : (
            <TypingAnimation
              key="welcome-animation"
              text="Welcome to Papertrail"
              className="text-3xl sm:text-4xl font-bold font-serif mb-3 sm:mb-4"
            />
          )}
          <p className="text-lg sm:text-xl text-muted-foreground font-serif mb-6 sm:mb-8 px-4">
            A retro book-themed markdown reader with animated page transitions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Button size="lg" className="font-serif w-full sm:w-auto" asChild>
              <Link href="/upload">
                <FileUp className="mr-2 h-5 w-5" />
                Upload Markdown
              </Link>
            </Button>
            {recentFiles.length > 0 && (
              <Button size="lg" variant="secondary" className="font-serif w-full sm:w-auto" asChild>
                <Link href={`/read/${recentFiles[0].id}`}>
                  <Book className="mr-2 h-5 w-5" />
                  Continue Reading
                </Link>
              </Button>
            )}
          </div>
        </div>

        {recentFiles.length > 0 && (
          <div className="border rounded-lg p-4 sm:p-6 bg-card shadow-page dark:shadow-page-dark mx-4 sm:mx-0">
            <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4">Recently Read</h2>
            <div className="space-y-3 sm:space-y-4">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center p-3 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/read/${file.id}`)}
                >
                  <Book className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium font-serif truncate">{file.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Last opened: {new Date(file.lastOpened).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
