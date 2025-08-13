import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface CategoryFilterProps {
  categories: Category[]
  activeCategory?: string
}

export default function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link href="/blog">
        <Badge variant={!activeCategory ? "default" : "outline"} className="cursor-pointer">
          All
        </Badge>
      </Link>
      {categories.map((category) => (
        <Link key={category.id} href={`/blog?category=${category.slug}`}>
          <Badge
            variant={activeCategory === category.slug ? "default" : "outline"}
            className="cursor-pointer"
            style={{
              backgroundColor: activeCategory === category.slug ? category.color : "transparent",
              borderColor: category.color,
            }}
          >
            {category.name}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
