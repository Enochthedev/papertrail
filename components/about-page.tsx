"use client"

import { Book, Github, Twitter } from "lucide-react"

export function AboutPage() {
  return (
    <div className="container max-w-3xl py-8 sm:py-12 px-4 sm:px-6 md:px-8 paper-texture">
      <div className="text-center mb-8">
        <Book className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold font-serif mb-2">About Papertrail</h1>
        <p className="text-muted-foreground font-serif">A retro book-themed markdown reader</p>
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-page dark:shadow-page-dark mb-8">
        <h2 className="text-2xl font-serif font-bold mb-4">About the App</h2>
        <div className="space-y-4 font-serif">
          <p>
            Papertrail is a retro book-themed markdown reader that brings a classic reading experience to your digital
            documents. With animated page transitions, customizable typography, and a focus on readability, Papertrail
            makes reading markdown files a pleasure.
          </p>
          <p>
            Built with Next.js and TailwindCSS, Papertrail combines modern web technologies with classic book aesthetics
            to create a unique reading experience.
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-page dark:shadow-page-dark mb-8">
        <h2 className="text-2xl font-serif font-bold mb-4">Features</h2>
        <ul className="space-y-2 font-serif list-disc pl-5">
          <li>Retro book aesthetic with serif fonts and soft textures</li>
          <li>Page curl/flip animation between markdown sections</li>
          <li>Upload and read markdown files</li>
          <li>Remember recently opened files via localStorage</li>
          <li>Dark mode toggle</li>
          <li>Reader mode that hides UI elements for focused reading</li>
          <li>Typing animation on page load (headings only, plays once per session)</li>
          <li>Markdown links open in a new tab</li>
          <li>Support for images in markdown</li>
          <li>Sidebar-based table of contents from markdown headers</li>
          <li>Deep linking support with URLs like /read/:slug</li>
          <li>Customizable typography settings</li>
        </ul>
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-page dark:shadow-page-dark">
        <h2 className="text-2xl font-serif font-bold mb-4">Credits</h2>
        <div className="space-y-4 font-serif">
          <p>Papertrail was created as a demonstration project. It uses the following technologies:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Next.js for the framework</li>
            <li>TailwindCSS for styling</li>
            <li>shadcn/ui for UI components</li>
            <li>react-markdown for markdown rendering</li>
            <li>Lucide React for icons</li>
          </ul>
          <div className="flex items-center justify-center pt-4 border-t mt-6 flex-wrap gap-2">
            <div className="flex items-center text-muted-foreground">
              <span>Made with</span>
              <span className="h-4 w-4 mx-1 text-red-500">❤️</span>
              <span>by</span>
            </div>
            <div className="flex items-center gap-3 ml-1 flex-wrap justify-center">
              <a
                href="https://github.com/Enochthedev/papertrail"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4 mr-1" />
                <span>wave</span>
              </a>
              <a
                href="https://x.com/wavedidwhat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4 mr-1" />
                <span>@wavedidwhat</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
