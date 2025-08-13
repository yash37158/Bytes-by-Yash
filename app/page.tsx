import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PostCard from "@/components/blog/post-card"

export default async function HomePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get featured posts (latest 6 published posts)
  const { data: featuredPosts } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      reading_time,
      view_count,
      published_at,
      categories (name, color, slug),
      profiles (full_name, username)
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bytes by Yash 📝</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/write">
                  <Button>Write</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-6">Welcome to my corner of the web</h2>
            <p className="text-xl mb-8 opacity-90">
              Sharing thoughts, experiences, and insights on technology, life, and everything in between.
            </p>
            {!user && (
              <div className="space-x-4">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                    Start reading
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
                  >
                    Browse articles
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts && featuredPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Stories</h2>
                <p className="text-lg text-gray-600">Discover the most recent articles from our community</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link href="/blog">
                  <Button size="lg">View all articles</Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
