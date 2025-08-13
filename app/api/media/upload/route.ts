import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Create unique filename
    const timestamp = Date.now()
    const filename = `${user.id}/${timestamp}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    // Save media record to database
    const { data: media, error } = await supabase
      .from("media")
      .insert({
        uploaded_by: user.id,
        filename: `${timestamp}-${file.name}`,
        original_filename: file.name,
        file_path: blob.url,
        file_size: file.size,
        mime_type: file.type,
        width: file.type.startsWith("image/") ? null : null, // Could be extracted from image metadata
        height: file.type.startsWith("image/") ? null : null, // Could be extracted from image metadata
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save media record" }, { status: 500 })
    }

    return NextResponse.json({
      id: media.id,
      url: media.file_path,
      filename: media.original_filename,
      size: media.file_size,
      type: media.mime_type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
