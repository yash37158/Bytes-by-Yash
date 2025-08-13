import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import PostEditor from "@/components/editor/post-editor"

export default async function WritePage() {
  const supabase = createClient()

  // Check authentication
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get categories for the editor
  const { data: categories } = await supabase.from("categories").select("id, name, slug").order("name")

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Write a new post</h1>
          <div className="text-sm text-gray-600">Signed in as {user.email}</div>
        </div>
      </header>

      <main>
        <PostEditor categories={categories || []} />
      </main>
    </div>
  )
}
