"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Add a new Bookmark type
type Bookmark = {
  id: string
  sectionIndex: number
  title: string
  createdAt: Date
}

// Update the MarkdownFile type to include a bookmarks array
type MarkdownFile = {
  id: string
  name: string
  content: string
  lastOpened: Date
  bookmarks: Bookmark[]
}

type MarkdownContextType = {
  files: MarkdownFile[]
  currentFile: MarkdownFile | null
  addFile: (file: File) => Promise<string>
  getFile: (id: string) => MarkdownFile | null
  setCurrentFile: (id: string) => void
  recentFiles: MarkdownFile[]
  addBookmark: (fileId: string, sectionIndex: number, title: string) => void
  removeBookmark: (fileId: string, bookmarkId: string) => void
  getBookmarks: (fileId: string) => Bookmark[]
}

// Define the context within this file instead of importing it
const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined)

export function MarkdownProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<MarkdownFile[]>([])
  const [currentFile, setCurrentFile] = useState<MarkdownFile | null>(null)
  const [recentFiles, setRecentFiles] = useState<MarkdownFile[]>([])

  // Load files from localStorage on mount
  useEffect(() => {
    const storedFiles = localStorage.getItem("papertrail-files")
    if (storedFiles) {
      try {
        const parsedFiles = JSON.parse(storedFiles)
        // Convert string dates back to Date objects
        const filesWithDates = parsedFiles.map((file: any) => ({
          ...file,
          lastOpened: new Date(file.lastOpened),
          bookmarks: Array.isArray(file.bookmarks)
            ? file.bookmarks.map((bookmark: any) => ({
                ...bookmark,
                createdAt: new Date(bookmark.createdAt),
              }))
            : [],
        }))
        setFiles(filesWithDates)

        // Set recent files
        const sorted = [...filesWithDates].sort(
          (a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime(),
        )
        setRecentFiles(sorted.slice(0, 5))
      } catch (error) {
        console.error("Failed to parse stored files:", error)
      }
    }
  }, [])

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem("papertrail-files", JSON.stringify(files))

      // Update recent files
      const sorted = [...files].sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime())
      setRecentFiles(sorted.slice(0, 5))
    }
  }, [files])

  const addFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          const content = event.target.result as string
          const id = generateId()
          const newFile: MarkdownFile = {
            id,
            name: file.name,
            content,
            lastOpened: new Date(),
            bookmarks: [],
          }

          setFiles((prev) => [...prev, newFile])
          setCurrentFile(newFile)
          resolve(id)
        } else {
          reject(new Error("Failed to read file"))
        }
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      reader.readAsText(file)
    })
  }

  const getFile = (id: string): MarkdownFile | null => {
    const file = files.find((f) => f.id === id)
    if (file) {
      // Update last opened time
      const updatedFile = { ...file, lastOpened: new Date() }
      setFiles((prev) => prev.map((f) => (f.id === id ? updatedFile : f)))
      return updatedFile
    }
    return null
  }

  const handleSetCurrentFile = (id: string) => {
    const file = getFile(id)
    if (file) {
      setCurrentFile(file)
    }
  }

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15)
  }

  // Add a new bookmark
  const addBookmark = (fileId: string, sectionIndex: number, title: string) => {
    const newBookmark: Bookmark = {
      id: generateId(),
      sectionIndex,
      title,
      createdAt: new Date(),
    }

    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === fileId) {
          // Check if a bookmark for this section already exists
          const existingBookmarkIndex = file.bookmarks.findIndex((b) => b.sectionIndex === sectionIndex)

          if (existingBookmarkIndex >= 0) {
            // Replace the existing bookmark
            const updatedBookmarks = [...file.bookmarks]
            updatedBookmarks[existingBookmarkIndex] = newBookmark
            return { ...file, bookmarks: updatedBookmarks }
          } else {
            // Add a new bookmark
            return { ...file, bookmarks: [...file.bookmarks, newBookmark] }
          }
        }
        return file
      }),
    )

    // Update current file if it's the one being bookmarked
    if (currentFile && currentFile.id === fileId) {
      setCurrentFile((prev) => {
        if (!prev) return prev

        const existingBookmarkIndex = prev.bookmarks.findIndex((b) => b.sectionIndex === sectionIndex)

        if (existingBookmarkIndex >= 0) {
          const updatedBookmarks = [...prev.bookmarks]
          updatedBookmarks[existingBookmarkIndex] = newBookmark
          return { ...prev, bookmarks: updatedBookmarks }
        } else {
          return { ...prev, bookmarks: [...prev.bookmarks, newBookmark] }
        }
      })
    }
  }

  // Remove a bookmark
  const removeBookmark = (fileId: string, bookmarkId: string) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === fileId) {
          return {
            ...file,
            bookmarks: file.bookmarks.filter((b) => b.id !== bookmarkId),
          }
        }
        return file
      }),
    )

    // Update current file if it's the one being modified
    if (currentFile && currentFile.id === fileId) {
      setCurrentFile((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          bookmarks: prev.bookmarks.filter((b) => b.id !== bookmarkId),
        }
      })
    }
  }

  // Get all bookmarks for a file
  const getBookmarks = (fileId: string): Bookmark[] => {
    const file = files.find((f) => f.id === fileId)
    return file?.bookmarks || []
  }

  return (
    <MarkdownContext.Provider
      value={{
        files,
        currentFile,
        addFile,
        getFile,
        setCurrentFile: handleSetCurrentFile,
        recentFiles,
        addBookmark,
        removeBookmark,
        getBookmarks,
      }}
    >
      {children}
    </MarkdownContext.Provider>
  )
}

export function useMarkdown() {
  const context = useContext(MarkdownContext)
  if (context === undefined) {
    throw new Error("useMarkdown must be used within a MarkdownProvider")
  }
  return context
}
