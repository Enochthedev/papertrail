"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, FileUp, Home, Settings, Info } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const isReaderPage = pathname.startsWith("/read/")

  if (isReaderPage) {
    return <ReaderNavbar />
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 navbar theme-transition">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Book className="h-6 w-6" />
          <span className="font-serif text-xl font-bold">Papertrail</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Home className="h-4 w-4 mr-1" />
            <span>Home</span>
          </Link>
          <Link
            href="/upload"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === "/upload" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <FileUp className="h-4 w-4 mr-1" />
            <span>Upload</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === "/settings" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Settings className="h-4 w-4 mr-1" />
            <span>Settings</span>
          </Link>
          <Link
            href="/about"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === "/about" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Info className="h-4 w-4 mr-1" />
            <span>About</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function ReaderNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 navbar theme-transition">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Book className="h-6 w-6" />
          <span className="font-serif text-xl font-bold">Papertrail</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <ReaderModeToggle />
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Exit Reader</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function ReaderModeToggle() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        document.documentElement.classList.toggle("reader-mode")
      }}
    >
      Toggle Reader Mode
    </Button>
  )
}
