import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import ShareButtons from "@/components/blog/share-buttons"

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, meta_title, meta_description")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single()

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
  }
}

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  reading_time: number
  published_at: string
  profiles: {
    full_name: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = createClient()

  // Get the post
  const { data: post } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      excerpt,
      reading_time,
      view_count,
      published_at,
      categories (name, color, slug),
      profiles (full_name, username, bio)
    `)
    .eq("slug", params.slug)
    .eq("status", "published")
    .single()

  if (!post) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("posts")
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq("id", post.id)

  // Get related posts
  const { data: relatedPosts } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      reading_time,
      published_at,
      profiles (full_name)
    `)
    .eq("status", "published")
    .neq("id", post.id)
    .limit(3)

  // Construct the full URL for sharing
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/post/${params.slug}`

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          {post.categories && (
            <Badge className="mb-4" style={{ backgroundColor: post.categories.color }}>
              {post.categories.name}
            </Badge>
          )}

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

          {post.excerpt && <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>}

          {/* Author and Meta */}
          <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold text-gray-900">{post.profiles.full_name}</p>
                {post.profiles.bio && <p className="text-sm text-gray-600">{post.profiles.bio}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.reading_time} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {(post.view_count || 0) + 1} views
              </span>
            </div>
          </div>
        </header>

        {/* Share Buttons */}
        <ShareButtons
          title={post.title}
          url={postUrl}
          excerpt={post.excerpt}
          author={post.profiles.full_name}
        />

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({children}) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>,
              h2: ({children}) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-800">{children}</h2>,
              h3: ({children}) => <h3 className="text-lg font-semibold mt-5 mb-2 text-gray-800">{children}</h3>,
              p: ({children}) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">
                  {children}
                </blockquote>
              ),
              strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
              em: ({children}) => <em className="italic text-gray-800">{children}</em>,
              code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
              pre: ({children}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">{children}</pre>,
              ul: ({children}) => <ul className="list-disc list-outside ml-6 mb-4 space-y-2">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-2">{children}</ol>,
              li: ({children}) => <li className="text-gray-700 leading-relaxed">{children}</li>
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More articles you might like</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(relatedPosts as RelatedPost[]).map((relatedPost) => (
                <Link key={relatedPost.id} href={`/post/${relatedPost.slug}`}>
                  <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedPost.title}</h3>
                    {relatedPost.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{relatedPost.profiles.full_name}</span>
                      <span>{relatedPost.reading_time} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
