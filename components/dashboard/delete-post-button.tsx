"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deletePost } from "@/lib/actions/posts"
import { useRouter } from "next/navigation"

interface DeletePostButtonProps {
  postId: string
  postTitle: string
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      setIsDeleting(true)
      try {
        const result = await deletePost(postId)
        if (result.error) {
          alert("Error deleting post: " + result.error)
        } else {
          router.refresh()
        }
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 bg-transparent"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  )
}
