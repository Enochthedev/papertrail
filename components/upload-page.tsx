"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { FileUp, Upload, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "./markdown-provider"

export function UploadPage() {
  const { addFile } = useMarkdown()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Check if file is markdown
    if (!file.name.endsWith(".md")) {
      setError("Please upload a markdown (.md) file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const fileId = await addFile(file)
      router.push(`/read/${fileId}`)
    } catch (err) {
      setError("Failed to upload file. Please try again.")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChange(e.dataTransfer.files)
  }

  return (
    <div className="container max-w-3xl py-12 paper-texture">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-serif mb-2">Upload Markdown</h1>
        <p className="text-muted-foreground font-serif">Upload a markdown file to start reading</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            {isUploading ? (
              <Upload className="h-10 w-10 text-primary animate-pulse" />
            ) : (
              <FileUp className="h-10 w-10 text-primary" />
            )}
          </div>

          <h3 className="mb-2 text-xl font-medium font-serif">
            {isUploading ? "Uploading..." : "Drag & Drop your markdown file"}
          </h3>

          <p className="mb-4 text-sm text-muted-foreground">or click the button below</p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".md"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />

          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <File className="mr-2 h-4 w-4" />
            Select File
          </Button>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Supported file format: Markdown (.md)</p>
      </div>
    </div>
  )
}
