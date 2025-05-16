"use client"

import type React from "react"

import { useState } from "react"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function SuggestionsPage() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [suggestionType, setSuggestionType] = useState("font")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Construct the mailto link with the form data
    const subject = `Papertrail Suggestion: ${suggestionType}`
    const body = `
Name: ${name}
Email: ${email}
Suggestion Type: ${suggestionType}
Suggestion: ${suggestion}
    `.trim()

    // Create and click a mailto link
    const mailtoLink = `mailto:hello@wavedidwhat.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink

    // Show success message and reset form
    toast({
      title: "Suggestion sent!",
      description: "Thank you for your suggestion. We'll review it soon.",
    })

    // Reset form and show thank you message
    setName("")
    setEmail("")
    setSuggestion("")
    setSuggestionType("font")
    setIsSubmitting(false)
    setShowForm(false)
  }

  return (
    <div className="container max-w-3xl py-12 paper-texture">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-serif mb-2">Suggestions</h1>
        <p className="text-muted-foreground font-serif">Help us improve Papertrail</p>
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-page dark:shadow-page-dark mb-8 theme-transition">
        {showForm ? (
          <>
            <h2 className="text-2xl font-serif font-bold mb-6">Submit a Suggestion</h2>
            <p className="mb-6 text-muted-foreground">
              We value your input! Please use this form to suggest new fonts, features, or report issues. Your
              suggestions will be sent directly to our team.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="suggestionType" className="text-sm font-medium">
                  Suggestion Type
                </label>
                <select
                  id="suggestionType"
                  value={suggestionType}
                  onChange={(e) => setSuggestionType(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="font">Font</option>
                  <option value="feature">Feature</option>
                  <option value="bug">Bug Report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="suggestion" className="text-sm font-medium">
                  Your Suggestion
                </label>
                <textarea
                  id="suggestion"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background min-h-[120px]"
                  required
                  placeholder={
                    suggestionType === "font"
                      ? "What font would you like to see added to Papertrail?"
                      : suggestionType === "feature"
                        ? "Describe the feature you'd like to see added."
                        : suggestionType === "bug"
                          ? "Please describe the issue you encountered in detail."
                          : "Share your thoughts or ideas with us."
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                <Button type="button" variant="outline" asChild className="w-full sm:w-auto order-2 sm:order-1">
                  <Link href="/settings">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Settings
                  </Link>
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto order-1 sm:order-2">
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Suggestion"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-2xl font-serif font-bold mb-4">Thank You!</h2>
            <p className="mb-6">
              Your suggestion has been sent. We appreciate your input and will consider it for future updates.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button variant="outline" onClick={() => setShowForm(true)} className="w-full sm:w-auto">
                Submit Another Suggestion
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/settings">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Settings
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-page dark:shadow-page-dark theme-transition">
        <h2 className="text-2xl font-serif font-bold mb-6">Other Ways to Reach Us</h2>
        <div className="space-y-4">
          <p>
            You can also reach out to us directly via email at{" "}
            <a href="mailto:hello@wavedidwhat.xyz" className="text-primary hover:underline">
              hello@wavedidwhat.xyz
            </a>{" "}
            or{" "}
            <a href="mailto:wavedidwhat@gmail.com" className="text-primary hover:underline">
              wavedidwhat@gmail.com
            </a>
          </p>
          <p>
            Follow us on{" "}
            <a
              href="https://x.com/wavedidwhat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Twitter/X
            </a>{" "}
            for updates and to share your feedback.
          </p>
        </div>
      </div>
    </div>
  )
}
