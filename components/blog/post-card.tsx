import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye } from "lucide-react"

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    reading_time: number
    view_count: number
    published_at: string
    categories: {
      name: string
      color: string
      slug: string
    } | null
    profiles: {
      full_name: string
      username: string
    }
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group cursor-pointer">
      <Link href={`/post/${post.slug}`}>
        <div className="space-y-3 p-6 rounded-lg border border-transparent hover:border-gray-200 hover:shadow-sm transition-all">
          {/* Category Badge */}
          {post.categories && (
            <Badge variant="outline" style={{ backgroundColor: post.categories.color + "20" }}>
              {post.categories.name}
            </Badge>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 line-clamp-2">{post.title}</h2>

          {/* Excerpt */}
          {post.excerpt && <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="font-medium">{post.profiles.full_name}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.published_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.reading_time} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.view_count}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
