import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import PostEditor from "@/components/editor/post-editor"

interface EditPageProps {
  params: {
    id: string
  }
}

export default async function EditPage({ params }: EditPageProps) {
  const supabase = createClient()

  // Check authentication
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get the post to edit
  const { data: post } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      excerpt,
      category_id,
      status,
      meta_title,
      meta_description
    `)
    .eq("id", params.id)
    .eq("author_id", user.id) // Ensure user owns the post
    .single()

  if (!post) {
    notFound()
  }

  // Get categories for the editor
  const { data: categories } = await supabase.from("categories").select("id, name, slug").order("name")

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Edit post</h1>
          <div className="text-sm text-gray-600">Signed in as {user.email}</div>
        </div>
      </header>

      <main>
        <PostEditor 
          categories={categories || []} 
          mode="edit" 
          post={post}
        />
      </main>
    </div>
  )
}
