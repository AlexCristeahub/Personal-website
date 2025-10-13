"use client"

import { useState, useEffect } from "react"
import { NotionSidebar } from "@/components/notion-sidebar"
import { ScrollProgress } from "@/components/scroll-progress"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import Link from "next/link"
import type { NotionPage } from "@/lib/notion"


// Simple category definitions
const CATEGORIES = [
  {
    id: 'build-in-public',
    title: 'Build in Public',
    description: 'Documenting what you\'re building, transparently',
    slug: 'build-in-public',
    icon: '🏗️',
    tags: ['build-in-public', 'building', 'development', 'progress', 'updates', 'transparency'],
    color: 'blue'
  },
  {
    id: 'founders-journey',
    title: 'Founder\'s Journey',
    description: 'Personal stories, challenges, decisions',
    slug: 'founders-journey',
    icon: '🚀',
    tags: ['founders-journey', 'entrepreneurship', 'startup', 'founder', 'business', 'journey'],
    color: 'purple'
  },
  {
    id: 'growth-hacks',
    title: 'Growth Hacks',
    description: 'Practical marketing/traction tactics',
    slug: 'growth-hacks',
    icon: '📈',
    tags: ['growth-hacks', 'marketing', 'growth', 'traction', 'sales', 'acquisition'],
    color: 'green'
  },
  {
    id: 'tools-stacks',
    title: 'Tools & Stacks',
    description: 'Technical/productivity setups',
    slug: 'tools-stacks',
    icon: '🛠️',
    tags: ['tools-stacks', 'productivity', 'tech-stack', 'tools', 'software', 'technology'],
    color: 'orange'
  },
  {
    id: 'mindset-philosophy',
    title: 'Mindset & Philosophy',
    description: 'Reflections, opinion pieces',
    slug: 'mindset-philosophy',
    icon: '🧠',
    tags: ['mindset-philosophy', 'philosophy', 'mindset', 'reflection', 'thoughts', 'insights'],
    color: 'indigo'
  }
]

export default function BlogPage() {
  const [posts, setPosts] = useState<NotionPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch('/api/blog')
        if (!response.ok) throw new Error('Failed to fetch posts')
        
        const data = await response.json()
        // Handle both old format (array) and new format (object with posts)
        const allPosts: NotionPage[] = Array.isArray(data) ? data : (data.posts || [])
        setPosts(allPosts)
        
        // Calculate category counts
        const counts: Record<string, number> = {}
        CATEGORIES.forEach(category => {
          const matchingPosts = allPosts.filter(post => {
            return post.tags.some(postTag => {
              const normalizedPostTag = postTag.toLowerCase().trim()
              return category.tags.some(categoryTag => {
                const normalizedCategoryTag = categoryTag.toLowerCase().trim()
                return normalizedPostTag.includes(normalizedCategoryTag) || 
                       normalizedCategoryTag.includes(normalizedPostTag)
              })
            })
          })
          counts[category.slug] = matchingPosts.length
        })
        setCategoryCounts(counts)
        
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
              <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">Blog Categories</h1>
                  <p>Loading posts...</p>
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
              <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog</h1>
                  <p className="text-muted-foreground">{error}</p>
                </div>
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
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-4">Blog Categories</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Explore {posts.length} posts organized by topic. From startup insights to technical deep-dives.
                </p>
                

              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {CATEGORIES.map((category) => (
                  <Link key={category.id} href={`/blog/category/${category.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02]">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                            {category.icon}
                          </div>
                          <Badge>
                            {categoryCounts[category.slug] || 0} {(categoryCounts[category.slug] || 0) === 1 ? 'post' : 'posts'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold group-hover:text-opacity-80 transition-colors">
                          {category.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {category.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {category.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                          {category.tags.length > 3 && (
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted text-muted-foreground">
                              +{category.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {posts.length === 0 && (
                <div className="text-center py-12 mt-8">
                  <div className="text-6xl mb-4">📝</div>
                  <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Create your first blog post in Notion and mark it as published to see it organized by categories here.
                  </p>
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