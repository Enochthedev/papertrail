import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { MarkdownProvider } from "@/components/markdown-provider"
import { ToastContainer } from "@/components/toast-container"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Papertrail - Retro Book-Themed Markdown Reader",
  description: "A retro book-themed markdown reader with animated page transitions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="papertrail-theme"
          disableTransitionOnChange={false}
        >
          <MarkdownProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <ToastContainer />
            </div>
          </MarkdownProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
