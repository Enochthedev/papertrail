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
    // Check if user has visited before
    const visited = localStorage.getItem("papertrail-visited")
    setHasVisited(!!visited)

    // Set visited flag
    if (!visited) {
      localStorage.setItem("papertrail-visited", "true")
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] paper-texture">
      <div className="max-w-3xl w-full mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center mb-12">
          <Book className="h-16 w-16 mb-4 text-primary" />
          {hasVisited ? (
            <h1 className="text-4xl font-bold font-serif mb-4">Welcome to Papertrail</h1>
          ) : (
            <TypingAnimation text="Welcome to Papertrail" className="text-4xl font-bold font-serif mb-4" />
          )}
          <p className="text-xl text-muted-foreground font-serif mb-8">
            A retro book-themed markdown reader with animated page transitions
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="font-serif" asChild>
              <Link href="/upload">
                <FileUp className="mr-2 h-5 w-5" />
                Upload Markdown
              </Link>
            </Button>
            {recentFiles.length > 0 && (
              <Button size="lg" variant="secondary" className="font-serif" asChild>
                <Link href={`/read/${recentFiles[0].id}`}>
                  <Book className="mr-2 h-5 w-5" />
                  Continue Reading
                </Link>
              </Button>
            )}
          </div>
        </div>

        {recentFiles.length > 0 && (
          <div className="border rounded-lg p-6 bg-card shadow-page dark:shadow-page-dark">
            <h2 className="text-2xl font-serif font-bold mb-4">Recently Read</h2>
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center p-3 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/read/${file.id}`)}
                >
                  <Book className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium font-serif">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
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
