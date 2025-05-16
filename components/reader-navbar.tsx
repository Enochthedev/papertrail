"use client"

import { useState } from "react"
import Link from "next/link"
import { Book, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function ReaderNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 navbar theme-transition">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Book className="h-6 w-6" />
          <span className="font-serif text-xl font-bold">Papertrail</span>
        </Link>

        {/* Desktop Controls */}
        <div className="hidden md:flex ml-auto items-center space-x-4">
          <ReaderModeToggle />
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Exit Reader</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="ml-auto md:hidden flex items-center">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="flex flex-col p-4 space-y-3 bg-background">
            <ReaderModeToggle isMobile={true} />
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                Exit Reader
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

function ReaderModeToggle({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <Button
      variant="ghost"
      size={isMobile ? "default" : "sm"}
      onClick={() => {
        document.documentElement.classList.toggle("reader-mode")
      }}
      className={isMobile ? "justify-start" : ""}
    >
      Toggle Reader Mode
    </Button>
  )
}
