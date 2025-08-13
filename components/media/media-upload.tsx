"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, ImageIcon, Video } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaFile {
  id: string
  url: string
  filename: string
  type: string
  size: number
}

interface MediaUploadProps {
  onUpload?: (file: MediaFile) => void
  onSelect?: (file: MediaFile) => void
  className?: string
}

export function MediaUpload({ onUpload, onSelect, className }: MediaUploadProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/media/list")
      const data = await response.json()
      if (data.files) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error("Failed to load files:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        const newFile = { ...data, id: data.id || Date.now().toString() }
        setFiles((prev) => [newFile, ...prev])
        onUpload?.(newFile)
      } else {
        console.error("Upload failed:", data.error)
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async (file: MediaFile) => {
    try {
      const response = await fetch("/api/media/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: file.id, url: file.url }),
      })

      if (response.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== file.id))
      }
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Load files on mount
  React.useEffect(() => {
    loadFiles()
  }, [])

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Media"}
        </Button>
        <Button variant="outline" onClick={loadFiles} disabled={loading}>
          Refresh
        </Button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading media...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.url || "/placeholder.svg"}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                ) : file.type.startsWith("video/") ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {onSelect && (
                    <Button size="sm" onClick={() => onSelect(file)} className="bg-white text-black hover:bg-gray-100">
                      Select
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(file)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-2">
                <p className="text-xs font-medium truncate">{file.filename}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {files.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No media files uploaded yet. Click "Upload Media" to get started.
        </div>
      )}
    </div>
  )
}
