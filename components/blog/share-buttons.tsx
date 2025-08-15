"use client"

import { Button } from "@/components/ui/button"
import { Share2, Twitter, Linkedin } from "lucide-react"
import { useState } from "react"

interface ShareButtonsProps {
  title: string
  url: string
  excerpt?: string | null
  author?: string
}

export default function ShareButtons({ title, url, excerpt, author }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  // Function to truncate text to fit within character limit for Twitter
  const truncateForTwitter = (text: string, maxLength: number = 280) => {
    if (text.length <= maxLength) return text
    
    // Reserve space for URL and basic formatting
    const urlLength = url.length
    const reservedSpace = urlLength + 20 // Extra space for formatting, emojis, etc.
    const availableSpace = maxLength - reservedSpace
    
    if (availableSpace <= 0) {
      // If URL is too long, just return the title
      return title.length > maxLength ? title.substring(0, maxLength - 3) + "..." : title
    }
    
    // Truncate text to fit within available space
    return text.substring(0, availableSpace - 3) + "..."
  }

  // Create share text with proper truncation for Twitter
  const baseText = `📝 ${title}`
  const excerptText = excerpt ? `\n\n${excerpt}` : ""
  const authorText = author ? `\n\nBy ${author}` : ""
  const readMoreText = `\n\nRead more:`
  
  // Combine all text for Twitter (truncated)
  const fullShareText = baseText + excerptText + authorText + readMoreText + url
  const truncatedShareText = truncateForTwitter(fullShareText)

  // Create full share text for LinkedIn (no truncation)
  const linkedinShareText = baseText + excerptText + authorText + readMoreText + url

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncatedShareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}${excerpt ? `&summary=${encodeURIComponent(excerpt)}` : ""}`,
  }

  const copyToClipboard = async () => {
    try {
      // Use Twitter version (truncated) for clipboard copy to ensure compatibility
      await navigator.clipboard.writeText(truncatedShareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="flex items-center gap-3 py-6 border-t border-b border-gray-200 my-8">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Share2 className="h-4 w-4" />
        <span className="font-medium">Share this article:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareUrls.twitter, '_blank', 'width=600,height=400')}
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
        >
          <Twitter className="h-4 w-4" />
          Share on X
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareUrls.linkedin, '_blank', 'width=600,height=400')}
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
        >
          <Linkedin className="h-4 w-4" />
          Share on LinkedIn
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className={`flex items-center gap-2 transition-colors ${
            copied 
              ? 'bg-green-50 border-green-200 text-green-600' 
              : 'hover:bg-gray-50 hover:border-gray-200'
          }`}
        >
          {copied ? (
            <>
              <span className="h-4 w-4">✓</span>
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
      
      {/* Character count indicators */}
      <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
        <span className={truncatedShareText.length > 280 ? 'text-red-500 font-medium' : 'text-gray-500'}>
          X: {truncatedShareText.length}/280
        </span>
        <span className="text-gray-500">
          LinkedIn: {linkedinShareText.length} chars
        </span>
      </div>
    </div>
  )
}
