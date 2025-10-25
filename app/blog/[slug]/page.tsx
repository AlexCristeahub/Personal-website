"use client"

import { useBlogPost } from "@/hooks/use-blog"
import { NotionRenderer } from "@/components/notion-renderer"
import { ScrollProgress } from "@/components/scroll-progress"
import { TableOfContents } from "@/components/table-of-contents"
import { NotionSidebar } from "@/components/notion-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, CalendarDays, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useParams } from "next/navigation"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { post, loading, error } = useBlogPost(slug)

  if (loading) {
    return (
      <NotionSidebar>
        <ScrollProgress />
        <div className="blog-page-container">
          <main className="blog-main-content">
            <div className="px-6 py-8">
              <div className="mb-6">
                <Skeleton className="h-10 w-32 mb-4" />
              </div>
              <div className="mb-8">
                <Skeleton className="h-16 w-16 mb-4" />
                <Skeleton className="h-12 w-3/4 mb-4" />
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </main>
          <aside className="blog-toc-sidebar">
            <div className="sticky top-20 p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-3">Table of Contents</h3>
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          </aside>
        </div>
      </NotionSidebar>
    )
  }

  if (error || !post) {
    return (
      <NotionSidebar>
        <ScrollProgress />
        <div className="blog-page-container">
          <main className="blog-main-content">
            <div className="px-6 py-8">
              <div className="mb-6">
                <Link href="/blog">
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:opacity-70 rounded-md">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                  </button>
                </Link>
              </div>
              <div className="text-center max-w-md mx-auto">
                <div className="text-6xl mb-4">❌</div>
                <h1 className="text-5xl font-bold text-foreground mb-4">
                  {error === "Post not found" ? "Post Not Found" : "Error Loading Post"}
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  {error === "Post not found"
                    ? "The blog post you're looking for doesn't exist or hasn't been published yet."
                    : error || "Something went wrong while loading the post."}
                </p>
                <Link href="/blog">
                  <button className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    Browse All Posts
                  </button>
                </Link>
              </div>
            </div>
          </main>
          <aside className="blog-toc-sidebar">
            <div className="sticky top-20 p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-3">Table of Contents</h3>
                <p className="text-sm text-muted-foreground">No content available</p>
              </div>
            </div>
          </aside>
        </div>
      </NotionSidebar>
    )
  }

  return (
    <NotionSidebar>
      <ScrollProgress />
      <div className="blog-page-container">
        <main className="blog-main-content">
          <div className="px-6 py-8">
            <div className="mb-6">
              <Link href="/blog">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:opacity-70 rounded-md">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </button>
              </Link>
            </div>

            <div className="mb-8">
              <div className="text-6xl mb-4">📝</div>
              <h1 className="text-5xl font-bold text-foreground mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                {post.publishedDate && (
                  <>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {format(new Date(post.publishedDate), "MMMM d, yyyy")}
                    </div>
                    <span>•</span>
                  </>
                )}
                {post.lastEditedTime && (
                  <>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Updated {format(new Date(post.lastEditedTime), "MMMM d, yyyy")}
                    </div>
                    <span>•</span>
                  </>
                )}
                <span>8 min read</span>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {post.cover && (
                <div className="aspect-video overflow-hidden rounded-lg mb-8">
                  <img src={post.cover || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <article className="prose prose-xl max-w-none">
              <div className="space-y-6">
                {post.content ? (
                  <NotionRenderer recordMap={post.content} rootPageId={post.id} />
                ) : (
                  <div className="p-8 text-center text-muted-foreground border rounded-lg">
                    <p className="text-lg leading-relaxed text-foreground mb-2">Content is temporarily unavailable</p>
                    <p className="leading-relaxed text-muted-foreground">
                      This may be due to a temporary issue with the content provider. Please try refreshing the page.
                    </p>
                  </div>
                )}
              </div>
            </article>

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Related Articles</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <a href="/blog" className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <h4 className="font-medium text-foreground mb-2">Building Effective Remote Teams</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn the strategies that successful remote companies use to build cohesive teams.
                  </p>
                </a>
                <a href="/blog" className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <h4 className="font-medium text-foreground mb-2">The Remote Work Toolkit</h4>
                  <p className="text-sm text-muted-foreground">
                    Essential tools and software for productive remote work in 2024.
                  </p>
                </a>
              </div>
            </div>
          </div>
        </main>
        <aside className="blog-toc-sidebar">
          <TableOfContents recordMap={post?.content} />
        </aside>
      </div>
    </NotionSidebar>
  )
}