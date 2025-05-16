"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type SettingsContextType = {
  fontFamily: "serif" | "sans"
  setFontFamily: (value: "serif" | "sans") => void
  fontSize: number
  setFontSize: (value: number) => void
  lineHeight: number
  setLineHeight: (value: number) => void
  resetSettings: () => void
}

const defaultSettings = {
  fontFamily: "serif" as const,
  fontSize: 18,
  lineHeight: 1.6,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">(defaultSettings.fontFamily)
  const [fontSize, setFontSize] = useState(defaultSettings.fontSize)
  const [lineHeight, setLineHeight] = useState(defaultSettings.lineHeight)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("papertrail-settings")
      if (storedSettings) {
        try {
          const parsedSettings = JSON.parse(storedSettings)
          setFontFamily(parsedSettings.fontFamily || defaultSettings.fontFamily)
          setFontSize(parsedSettings.fontSize || defaultSettings.fontSize)
          setLineHeight(parsedSettings.lineHeight || defaultSettings.lineHeight)
        } catch (error) {
          console.error("Failed to parse stored settings:", error)
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      const settings = {
        fontFamily,
        fontSize,
        lineHeight,
      }
      localStorage.setItem("papertrail-settings", JSON.stringify(settings))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }, [fontFamily, fontSize, lineHeight])

  const resetSettings = () => {
    setFontFamily(defaultSettings.fontFamily)
    setFontSize(defaultSettings.fontSize)
    setLineHeight(defaultSettings.lineHeight)
  }

  return (
    <SettingsContext.Provider
      value={{
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        lineHeight,
        setLineHeight,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    return {
      fontFamily: defaultSettings.fontFamily,
      setFontFamily: () => {},
      fontSize: defaultSettings.fontSize,
      setFontSize: () => {},
      lineHeight: defaultSettings.lineHeight,
      setLineHeight: () => {},
      resetSettings: () => {},
    }
  }
  return context
}
