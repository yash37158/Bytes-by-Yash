"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Code,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Minus,
} from "lucide-react"

type Props = {
  value: string
  onChange: (next: string) => void
  onOpenMedia?: () => void
}

function replaceSelection(
  value: string,
  onChange: (v: string) => void,
  producer: (selected: string) => { text: string; selectStart?: number; selectEnd?: number }
) {
  const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const before = value.slice(0, start)
  const selected = value.slice(start, end)
  const after = value.slice(end)

  const { text, selectStart, selectEnd } = producer(selected)
  const next = before + text + after
  onChange(next)

  requestAnimationFrame(() => {
    const posStart = selectStart !== undefined ? before.length + selectStart : before.length + text.length
    const posEnd = selectEnd !== undefined ? before.length + selectEnd : before.length + text.length
    textarea.focus()
    textarea.setSelectionRange(posStart, posEnd)
  })
}

function wrapInline(prefix: string, suffix?: string, placeholder = "") {
  return (s: string) => {
    const content = s || placeholder
    const finalSuffix = suffix ?? prefix
    return { text: `${prefix}${content}${finalSuffix}`, selectStart: prefix.length, selectEnd: prefix.length + content.length }
  }
}

function bulletList() {
  return (s: string) => {
    const text = s || ""
    const lines = text.split("\n")
    const prefixed = lines.map((line, index) => {
      if (line.trim() === "") return "- "
      if (line.startsWith("- ")) return line
      return `- ${line}`
    }).join("\n")
    return { text: prefixed }
  }
}

function numberedList() {
  return (s: string) => {
    const text = s || ""
    const lines = text.split("\n")
    let counter = 1
    const prefixed = lines.map((line, index) => {
      if (line.trim() === "") return `${counter}. `
      if (/^\d+\.\s/.test(line)) return line
      const result = `${counter}. ${line}`
      counter++
      return result
    }).join("\n")
    return { text: prefixed }
  }
}

function heading(level: 1 | 2) {
  const p = level === 1 ? "# " : "## "
  return (s: string) => {
    const text = s || "Heading"
    const lines = text.split("\n")
    const updated = lines.map((l) => (l.startsWith("#") ? l.replace(/^#+\s*/, p) : `${p}${l}`)).join("\n")
    return { text: updated }
  }
}

function linePrefixAll(prefix: string) {
  return (s: string) => {
    const text = s || ""
    const lines = text.split("\n")
    const prefixed = lines.map((l) => (l.length ? `${prefix}${l}` : prefix.trimEnd())).join("\n")
    return { text: prefixed }
  }
}

export function MarkdownToolbar({ value, onChange, onOpenMedia }: Props) {
  const doAction = useCallback(
    (producer: (selected: string) => { text: string; selectStart?: number; selectEnd?: number }) => {
      replaceSelection(value, onChange, producer)
    },
    [value, onChange]
  )

  const insertLink = () => {
    const url = window.prompt("Enter URL")
    if (!url) return
    doAction((s) => {
      const label = s || "link text"
      return { text: `[${label}](${url})`, selectStart: 1, selectEnd: 1 + label.length }
    })
  }

  const insertImage = () => {
    const url = window.prompt("Enter image URL (or Cancel to open Media tab)")
    if (!url) {
      onOpenMedia?.()
      return
    }
    doAction((s) => {
      const alt = s || "alt text"
      return { text: `![${alt}](${url})` }
    })
  }

  const insertCodeBlock = () => {
    doAction((s) => {
      const body = s || "code here"
      return { text: "```\n" + body + "\n```" }
    })
  }

  const insertHr = () => {
    doAction(() => ({ text: "\n\n---\n\n" }))
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      <Button type="button" size="sm" variant="ghost" aria-label="Bold" onClick={() => doAction(wrapInline("**"))}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Italic" onClick={() => doAction(wrapInline("*"))}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Inline code" onClick={() => doAction(wrapInline("`"))}>
        <Code className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Code block" onClick={insertCodeBlock}>
        <Code className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Heading 1" onClick={() => doAction(heading(1))}>
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Heading 2" onClick={() => doAction(heading(2))}>
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Bulleted list" onClick={() => doAction(bulletList())}>
        <List className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Numbered list" onClick={() => doAction(numberedList())}>
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Quote" onClick={() => doAction(linePrefixAll("> "))}>
        <Quote className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Link" onClick={insertLink}>
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Image" onClick={insertImage}>
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button type="button" size="sm" variant="ghost" aria-label="Horizontal rule" onClick={insertHr}>
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  )
}