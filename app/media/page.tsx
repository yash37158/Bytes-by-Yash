import { MediaUpload } from "@/components/media/media-upload"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function MediaPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground mt-2">Manage your uploaded images and videos</p>
      </div>

      <MediaUpload />
    </div>
  )
}
