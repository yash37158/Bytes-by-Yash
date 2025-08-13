import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Eye, Calendar } from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { DeletePostButton } from "@/components/dashboard/delete-post-button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { SignOutButton } from "@/components/dashboard/sign-out-button"

export default async function DashboardPage() {
  const supabase = createClient()

  // Check authentication
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user's posts
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      status,
      view_count,
      reading_time,
      created_at,
      published_at,
      categories (name, color)
    `)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, bio")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name || user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/write">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{posts?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{posts?.filter((p) => p.status === "published").length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Posts</CardTitle>
              <CardDescription>Manage your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              {posts && posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{post.title}</h3>
                          <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                          {post.categories && (
                            <Badge variant="outline" style={{ backgroundColor: post.categories.color + "20" }}>
                              {post.categories.name}
                            </Badge>
                          )}
                        </div>
                        {post.excerpt && <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.view_count || 0} views
                          </span>
                          <span>{post.reading_time} min read</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/edit/${post.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        {post.status === "published" && (
                          <Link href={`/post/${post.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <DeletePostButton postId={post.id} postTitle={post.title} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't written any posts yet.</p>
                  <Link href="/write">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Write your first post
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
