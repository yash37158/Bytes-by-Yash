import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface BlogHeaderProps {
  searchQuery?: string
}

export default function BlogHeader({ searchQuery }: BlogHeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Bytes by Yash 📝
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Stories from my journey</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover my thoughts, experiences, and insights on various topics that matter to me.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <form action="/blog" method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input name="search" placeholder="Search articles..." defaultValue={searchQuery} className="pl-10" />
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
