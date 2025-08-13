"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPost(prevState: any, formData: FormData) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "You must be logged in to create a post" }
  }

  const title = formData.get("title")?.toString()
  const content = formData.get("content")?.toString()
  const excerpt = formData.get("excerpt")?.toString()
  const categoryId = formData.get("categoryId")?.toString()
  const status = formData.get("status")?.toString() || "draft"
  const metaTitle = formData.get("metaTitle")?.toString()
  const metaDescription = formData.get("metaDescription")?.toString()
  const tags = formData.get("tags")?.toString()

  if (!title || !content) {
    return { error: "Title and content are required" }
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  try {
    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        title,
        slug,
        content,
        excerpt,
        category_id: categoryId || null,
        status,
        author_id: user.id,
        meta_title: metaTitle,
        meta_description: metaDescription,
        reading_time: readingTime,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    // Handle tags if provided
    if (tags && post) {
      const tagNames = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      for (const tagName of tagNames) {
        // Create tag if it doesn't exist
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        const { data: tag } = await supabase.from("tags").upsert({ name: tagName, slug: tagSlug }).select().single()

        // Link post to tag
        if (tag) {
          await supabase.from("post_tags").insert({ post_id: post.id, tag_id: tag.id })
        }
      }
    }

    revalidatePath("/dashboard")
    return { success: true, postId: post.id }
  } catch (error) {
    console.error("Create post error:", error)
    return { error: "Failed to create post" }
  }
}

export async function updatePost(postId: string, prevState: any, formData: FormData) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "You must be logged in to update a post" }
  }

  const title = formData.get("title")?.toString()
  const content = formData.get("content")?.toString()
  const excerpt = formData.get("excerpt")?.toString()
  const categoryId = formData.get("categoryId")?.toString()
  const status = formData.get("status")?.toString() || "draft"
  const metaTitle = formData.get("metaTitle")?.toString()
  const metaDescription = formData.get("metaDescription")?.toString()

  if (!title || !content) {
    return { error: "Title and content are required" }
  }

  // Calculate reading time
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  try {
    const { error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        excerpt,
        category_id: categoryId || null,
        status,
        meta_title: metaTitle,
        meta_description: metaDescription,
        reading_time: readingTime,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .eq("id", postId)
      .eq("author_id", user.id) // Ensure user owns the post

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Update post error:", error)
    return { error: "Failed to update post" }
  }
}

export async function deletePost(postId: string) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "You must be logged in to delete a post" }
  }

  try {
    // First delete related post_tags
    await supabase.from("post_tags").delete().eq("post_id", postId)

    // Then delete the post (ensure user owns the post)
    const { error } = await supabase.from("posts").delete().eq("id", postId).eq("author_id", user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Delete post error:", error)
    return { error: "Failed to delete post" }
  }
}
