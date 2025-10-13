"use client"

import { useState, useEffect } from "react"
import { NotionSidebar } from "@/components/notion-sidebar"
import { ScrollProgress } from "@/components/scroll-progress"
import { TableOfContents } from "@/components/table-of-contents"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, ArrowLeft } from "lucide-react"
import Footer from "@/components/footer"
import Link from "next/link"
import { format } from "date-fns"
import { useParams } from "next/navigation"
import type { NotionPage } from "@/lib/notion"

// Simple category definitions
const CATEGORIES = {
  'build-in-public': {
    title: 'Build in Public',
    description: 'Documenting what you\'re building, transparently',
    icon: '🏗️',
    tags: ['build-in-public', 'building', 'development', 'progress', 'updates', 'transparency']
  },
  'founders-journey': {
    title: 'Founder\'s Journey', 
    description: 'Personal stories, challenges, decisions',
    icon: '🚀',
    tags: ['founders-journey', 'entrepreneurship', 'startup', 'founder', 'business', 'journey']
  },
  'growth-hacks': {
    title: 'Growth Hacks',
    description: 'Practical marketing/traction tactics', 
    icon: '📈',
    tags: ['growth-hacks', 'marketing', 'growth', 'traction', 'sales', 'acquisition']
  },
  'tools-stacks': {
    title: 'Tools & Stacks',
    description: 'Technical/productivity setups',
    icon: '🛠️', 
    tags: ['tools-stacks', 'productivity', 'tech-stack', 'tools', 'software', 'technology']
  },
  'mindset-philosophy': {
    title: 'Mindset & Philosophy',
    description: 'Reflections, opinion pieces',
    icon: '🧠',
    tags: ['mindset-philosophy', 'philosophy', 'mindset', 'reflection', 'thoughts', 'insights']
  }
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string
  const [posts, setPosts] = useState<NotionPage[]>([])
  const [allPosts, setAllPosts] = useState<NotionPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const category = CATEGORIES[categorySlug as keyof typeof CATEGORIES]

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch('/api/blog')
        if (!response.ok) throw new Error('Failed to fetch posts')
        
        const data = await response.json()
        // Handle both old format (array) and new format (object with posts)
        const allBlogPosts: NotionPage[] = Array.isArray(data) ? data : (data.posts || [])
        setAllPosts(allBlogPosts)
        
        if (category) {
          // Filter posts that match this category's tags
          const filteredPosts = allBlogPosts.filter(post => {
            return post.tags.some(postTag => {
              const normalizedPostTag = postTag.toLowerCase().trim()
              return category.tags.some(categoryTag => {
                const normalizedCategoryTag = categoryTag.toLowerCase().trim()
                return normalizedPostTag.includes(normalizedCategoryTag) || 
                       normalizedCategoryTag.includes(normalizedPostTag)
              })
            })
          })
          setPosts(filteredPosts)
        } else {
          setPosts([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [categorySlug, category])

  if (!category) {
    return (
      <NotionSidebar>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </NotionSidebar>
    )
  }

  if (loading) {
    return (
      <NotionSidebar>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-4xl mb-4">{category.icon}</div>
            <h1 className="text-3xl font-bold mb-4">{category.title}</h1>
            <p>Loading posts...</p>
          </div>
        </div>
      </NotionSidebar>
    )
  }

  if (error) {
    return (
      <NotionSidebar>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="mb-4">{error}</p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </NotionSidebar>
    )
  }

  return (
    <>
      <ScrollProgress />
      <NotionSidebar>
        <div className="relative">
          <div className="group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:max-w-5xl group-data-[state=expanded]/sidebar:ml-0 group-data-[state=expanded]/sidebar:mr-64">
            <div className="container mx-auto px-4 py-8 page-content">
              {/* Breadcrumb */}
              <div className="mb-6">
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                  <span>/</span>
                  <span className="text-foreground">{category.title}</span>
                </nav>
              </div>

              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{category.title}</h1>
                    <p className="text-xl text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</Badge>
                  <Button asChild size="sm">
                    <Link href="/blog">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Categories
                    </Link>
                  </Button>
                </div>
                

              </div>

              {/* Posts */}
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h2 className="text-2xl font-semibold mb-4">No posts in this category yet</h2>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Posts with tags like "{category.tags.slice(0, 3).join('", "')}" will appear here.
                  </p>
                  <Button asChild>
                    <Link href="/blog">Explore Other Categories</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
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
                              {format(new Date(post.publishedDate), "MMM d, yyyy")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(post.lastEditedTime), "MMM d")}
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
          <TableOfContents />
        </div>
      </NotionSidebar>
    </>
  )
}