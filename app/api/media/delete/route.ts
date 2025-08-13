import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, url } = await request.json()

    if (!id || !url) {
      return NextResponse.json({ error: "Missing id or url" }, { status: 400 })
    }

    // Verify ownership
    const { data: media, error: fetchError } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .eq("uploaded_by", user.id)
      .single()

    if (fetchError || !media) {
      return NextResponse.json({ error: "Media not found or unauthorized" }, { status: 404 })
    }

    // Delete from Vercel Blob
    await del(url)

    // Delete from database
    const { error: deleteError } = await supabase.from("media").delete().eq("id", id)

    if (deleteError) {
      console.error("Database delete error:", deleteError)
      return NextResponse.json({ error: "Failed to delete media record" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
