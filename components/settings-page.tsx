"use client"

import { SettingsProvider, useSettings } from "./settings-provider"
import { ThemeToggle } from "./theme-toggle"

export function SettingsPage() {
  return (
    <SettingsProvider>
      <SettingsContent />
    </SettingsProvider>
  )
}

function SettingsContent() {
  const { fontFamily, setFontFamily, fontSize, setFontSize, lineHeight, setLineHeight, resetSettings } = useSettings()

  return (
    <div className="container max-w-3xl py-12 paper-texture">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-serif mb-2">Settings</h1>
        <p className="text-muted-foreground font-serif">Customize your reading experience</p>
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-page dark:shadow-page-dark mb-8 theme-transition">
        <h2 className="text-2xl font-serif font-bold mb-6">Appearance</h2>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium mb-1">Dark Mode</h3>
            <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-page dark:shadow-page-dark theme-transition">
        <h2 className="text-2xl font-serif font-bold mb-6">Typography</h2>

        <div className="space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Font Family
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                className={`px-4 py-2 rounded-md border flex-1 ${
                  fontFamily === "serif"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setFontFamily("serif")}
              >
                <span className="font-serif">Serif</span>
              </button>
              <button
                className={`px-4 py-2 rounded-md border flex-1 ${
                  fontFamily === "sans"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setFontFamily("sans")}
              >
                <span className="font-sans">Sans-serif</span>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 text-sm text-muted-foreground gap-2">
              <span>More fonts coming soon...</span>
              <a href="/suggestions" className="text-primary hover:underline focus:outline-none">
                Suggest a font
              </a>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Font Size: {fontSize}px
              </label>
            </div>
            <input
              type="range"
              min="14"
              max="24"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Line Height: {lineHeight}
              </label>
            </div>
            <input
              type="range"
              min="1.4"
              max="2.0"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tight</span>
              <span>Spacious</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={resetSettings}>
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 border rounded-lg p-6 bg-card shadow-page dark:shadow-page-dark theme-transition">
        <h2 className="text-2xl font-serif font-bold mb-6">Preview</h2>

        <div
          className={`book-content ${fontFamily === "sans" ? "sans" : ""}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          <h1>The Great Gatsby</h1>
          <p>
            In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind
            ever since.
          </p>
          <p>
            "Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world
            haven't had the advantages that you've had."
          </p>
          <h2>Chapter 1</h2>
          <p>
            He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood
            that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgments, a habit
            that has opened up many curious natures to me and also made me the victim of not a few veteran bores.
          </p>
        </div>
      </div>
    </div>
  )
}
