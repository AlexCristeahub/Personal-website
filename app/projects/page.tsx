"use client"

import { useState, useEffect } from "react"
import { NotionSidebar } from "@/components/notion-sidebar"
import { ScrollProgress } from "@/components/scroll-progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import Footer from "@/components/footer"
import Link from "next/link"
import { format } from "date-fns"
import type { NotionPage } from "@/lib/notion"

export default function ProjectsPage() {
  const [posts, setPosts] = useState<NotionPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch('/api/blog')
        if (!response.ok) throw new Error('Failed to fetch posts')
        
        const data = await response.json()
        const allPosts: NotionPage[] = Array.isArray(data) ? data : (data.posts || [])
        
        // Filter posts that have the "projects" tag
        const projectPosts = allPosts.filter(post => {
          return post.tags.some(tag => tag.toLowerCase().trim() === 'projects')
        })
        setPosts(projectPosts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <>
        <ScrollProgress />
        <NotionSidebar>
          <div className="relative">
            <div className="group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:max-w-5xl group-data-[state=expanded]/sidebar:ml-0 group-data-[state=expanded]/sidebar:mr-64">
              <div className="container mx-auto px-4 py-8 page-content">
                <div className="text-center">
                  <div className="text-4xl mb-4">📁</div>
                  <h1 className="text-4xl font-bold mb-4">Projects</h1>
                  <p className="text-muted-foreground">Loading projects...</p>
                </div>
              </div>
            </div>
          </div>
        </NotionSidebar>
      </>
    )
  }

  if (error) {
    return (
      <>
        <ScrollProgress />
        <NotionSidebar>
          <div className="relative">
            <div className="group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:max-w-5xl group-data-[state=expanded]/sidebar:ml-0 group-data-[state=expanded]/sidebar:mr-64">
              <div className="container mx-auto px-4 py-8 page-content">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Projects</h1>
                  <p className="text-muted-foreground">{error}</p>
                </div>
                <Footer />
              </div>
            </div>
          </div>
        </NotionSidebar>
      </>
    )
  }

  return (
    <>
      <ScrollProgress />
      <NotionSidebar>
        <div className="relative">
          <div className="group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:max-w-5xl group-data-[state=expanded]/sidebar:ml-0 group-data-[state=expanded]/sidebar:mr-64">
            <div className="container mx-auto px-4 py-8 page-content">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="text-4xl mb-4">📁</div>
                <h1 className="text-4xl font-bold mb-4">Projects</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  A collection of projects I've been working on.
                </p>
                <Badge className="mt-4">{posts.length} {posts.length === 1 ? 'project' : 'projects'}</Badge>
              </div>

              {/* Projects Grid */}
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📁</div>
                  <h2 className="text-2xl font-semibold mb-4">No projects yet</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Posts tagged with "projects" in Notion will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                      <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]">
                        {post.cover && (
                          <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img
                              src={post.cover}
                              alt={post.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                          {post.excerpt && (
                            <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {post.publishedDate ? format(new Date(post.publishedDate), "MMM d, yyyy") : 'No date'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.lastEditedTime ? format(new Date(post.lastEditedTime), "MMM d") : 'N/A'}
                            </div>
                          </div>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {post.tags.length > 3 && (
                                <Badge className="text-xs">
                                  +{post.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
              <Footer />
            </div>
          </div>
        </div>
      </NotionSidebar>
    </>
  )
}
