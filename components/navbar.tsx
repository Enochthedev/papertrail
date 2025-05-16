"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, FileUp, Home, Settings, Info, MessageSquare, Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
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
          <Link
            href="/suggestions"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === "/suggestions" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>Suggestions</span>
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col p-4 space-y-3 bg-background">
            <Link
              href="/"
              className={cn(
                "flex items-center text-sm font-medium p-2 rounded-md transition-colors hover:bg-accent",
                pathname === "/" ? "bg-accent text-accent-foreground" : "text-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-2" />
              <span>Home</span>
            </Link>
            <Link
              href="/upload"
              className={cn(
                "flex items-center text-sm font-medium p-2 rounded-md transition-colors hover:bg-accent",
                pathname === "/upload" ? "bg-accent text-accent-foreground" : "text-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <FileUp className="h-4 w-4 mr-2" />
              <span>Upload</span>
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center text-sm font-medium p-2 rounded-md transition-colors hover:bg-accent",
                pathname === "/settings" ? "bg-accent text-accent-foreground" : "text-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </Link>
            <Link
              href="/about"
              className={cn(
                "flex items-center text-sm font-medium p-2 rounded-md transition-colors hover:bg-accent",
                pathname === "/about" ? "bg-accent text-accent-foreground" : "text-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="h-4 w-4 mr-2" />
              <span>About</span>
            </Link>
            <Link
              href="/suggestions"
              className={cn(
                "flex items-center text-sm font-medium p-2 rounded-md transition-colors hover:bg-accent",
                pathname === "/suggestions" ? "bg-accent text-accent-foreground" : "text-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Suggestions</span>
            </Link>
          </nav>
        </div>
      )}
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
