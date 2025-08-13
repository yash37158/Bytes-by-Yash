"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, Send, ImageIcon } from "lucide-react"
import { createPost, updatePost } from "@/lib/actions/posts"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { MediaUpload } from "@/components/media/media-upload"
import { MarkdownToolbar } from "@/components/editor/markdown-toolbar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Category {
  id: string
  name: string
  slug: string
}

interface PostEditorProps {
  categories: Category[]
  mode?: "create" | "edit"
  post?: PostDetails
}

interface PostDetails {
  id: string
  title: string
  content: string
  excerpt: string | null
  category_id: string | null
  status: string
  meta_title: string | null
  meta_description: string | null
}

interface MediaFile {
  id: string
  url: string
  filename: string
  type: string
  size: number
}

interface ActionState {
  success?: boolean
  error?: string
  postId?: string
}

function SubmitButton({ isDraft }: { isDraft: boolean }) {
  const { pending } = useFormStatus()

  return (
    <div className="flex gap-2">
      <Button type="submit" name="status" value="draft" variant="outline" disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save Draft
      </Button>
      <Button type="submit" name="status" value="published" disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Publish
      </Button>
    </div>
  )
}

export default function PostEditor({ categories, mode = "create", post }: PostEditorProps) {
  const router = useRouter()
  const actionHandler =
    mode === "edit" && post
      ? (prevState: any, formData: FormData) => updatePost(post.id, prevState, formData)
      : createPost
  const [state, formAction] = useActionState(actionHandler as any, null as ActionState | null)

  const [title, setTitle] = useState<string>(post?.title ?? "")
  const [content, setContent] = useState<string>(post?.content ?? "")
  const [activeTab, setActiveTab] = useState<string>("write")

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state, router])

  const insertMediaIntoContent = (media: MediaFile) => {
    const cursorPosition =
      (document.querySelector('textarea[name="content"]') as HTMLTextAreaElement)?.selectionStart || content.length

    let mediaMarkdown = ""
    if (media.type.startsWith("image/")) {
      mediaMarkdown = `![${media.filename}](${media.url})\n\n`
    } else if (media.type.startsWith("video/")) {
      mediaMarkdown = `<video controls width="100%">\n  <source src="${media.url}" type="${media.type}">\n  Your browser does not support the video tag.\n</video>\n\n`
    }

    const newContent = content.slice(0, cursorPosition) + mediaMarkdown + content.slice(cursorPosition)
    setContent(newContent)
    setActiveTab("write")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
            {state.error}
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <Input
            name="title"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold border-none px-0 py-4 placeholder:text-gray-400 focus-visible:ring-0"
            required
          />
        </div>

        {/* Content Editor */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="mt-4">
            <div className="mb-2">
              <MarkdownToolbar
                value={content}
                onChange={setContent}
                onOpenMedia={() => setActiveTab("media")}
              />
            </div>
            <Textarea
              name="content"
              placeholder="Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h[400px] text-lg leading-relaxed border-none px-0 resize-none focus-visible:ring-0"
              required
            />
            <p className="text-sm text-muted-foreground mt-2">
              Tip: Use the Media tab to upload and insert images or videos into your post.
            </p>
          </TabsContent>

          <TabsContent value="media" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                <span>Upload and manage media for your post</span>
              </div>
              <MediaUpload onSelect={insertMediaIntoContent} />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <div className="min-h-[400px] p-6 border rounded-lg bg-white shadow-sm">
              <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
                {title || "Your title here..."}
              </h1>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {content ? (
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
                      ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="text-gray-700">{children}</li>
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-500 italic">Your content will appear here...</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Sidebar Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Post Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Excerpt */}
            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="Brief description of your post..."
                className="h-20"
                defaultValue={post?.excerpt ?? ""}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-sm font-medium">
                Category
              </label>
              <Select name="categoryId" defaultValue={post?.category_id ?? undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <Input id="tags" name="tags" placeholder="javascript, react, tutorial (comma separated)" />
            </div>

            {/* SEO Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">SEO Settings</h4>

              <div className="space-y-2">
                <label htmlFor="metaTitle" className="text-sm font-medium">
                  Meta Title
                </label>
                <Input id="metaTitle" name="metaTitle" placeholder="SEO title (optional)" defaultValue={post?.meta_title ?? ""} />
              </div>

              <div className="space-y-2">
                <label htmlFor="metaDescription" className="text-sm font-medium">
                  Meta Description
                </label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  placeholder="SEO description (optional)"
                  className="h-20"
                  defaultValue={post?.meta_description ?? ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <SubmitButton isDraft={false} />
        </div>
      </form>
    </div>
  )
}