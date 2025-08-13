import { createClient } from "@/lib/supabase/server"
import BlogHeader from "@/components/blog/blog-header"
import PostCard from "@/components/blog/post-card"
import CategoryFilter from "@/components/blog/category-filter"

interface BlogPageProps {
  searchParams: {
    search?: string
    category?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const supabase = createClient()
  const { search, category } = searchParams

  // Build query for posts
  let query = supabase
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

  // Apply category filter
  if (category) {
    const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", category).single()
    if (categoryData) {
      query = query.eq("category_id", categoryData.id)
    }
  }

  // Apply search filter
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  const { data: posts } = await query

  // Get categories for filter
  const { data: categories } = await supabase.from("categories").select("id, name, slug, color").order("name")

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader searchQuery={search} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <CategoryFilter categories={categories || []} activeCategory={category} />

        {/* Search Results Header */}
        {search && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Search results for "{search}" ({posts?.length || 0} articles)
            </h2>
          </div>
        )}

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              {search ? "Try adjusting your search terms." : "Be the first to publish an article!"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
