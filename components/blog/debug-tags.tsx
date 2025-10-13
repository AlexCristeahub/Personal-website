"use client"

import { useBlogPosts } from "@/hooks/use-blog"
import { useCategoryCounts } from "@/hooks/use-category-posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BLOG_CATEGORIES } from "@/lib/blog-categories"
import { ApiTest } from "./api-test"

export function DebugTags() {
  const { posts, loading, error, refresh } = useBlogPosts()
  const { counts } = useCategoryCounts()

  const refreshData = () => {
    refresh()
    window.location.reload()
  }

  if (loading) return <div>Loading posts...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Debug: Post Tags & Category Matching</h2>
        <Button onClick={refreshData}>
          Refresh Data
        </Button>
      </div>
      
      <ApiTest />
      
      <Card>
        <CardHeader>
          <CardTitle>Category Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BLOG_CATEGORIES.map((category) => (
              <div key={category.id} className="text-center p-3 border rounded">
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="font-semibold">{category.title}</div>
                <div className="text-lg font-bold text-primary">{counts[category.slug] || 0} posts</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Looking for: {category.tags.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No posts found. Check your Notion integration.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Posts with Tags ({posts.length} total)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => {
                  // Check which categories this post matches
                  const matchingCategories = BLOG_CATEGORIES.filter(category => {
                    return post.tags.some(postTag => {
                      const normalizedPostTag = postTag.toLowerCase().trim()
                      return category.tags.some(categoryTag => {
                        const normalizedCategoryTag = categoryTag.toLowerCase().trim()
                        
                        // Exact match
                        if (normalizedPostTag === normalizedCategoryTag) return true
                        
                        // Partial match (either direction)
                        if (normalizedPostTag.includes(normalizedCategoryTag) || 
                            normalizedCategoryTag.includes(normalizedPostTag)) return true
                        
                        // Handle common variations
                        const postTagWords = normalizedPostTag.split(/[-_\s]+/)
                        const categoryTagWords = normalizedCategoryTag.split(/[-_\s]+/)
                        
                        // Check if any words match
                        return postTagWords.some(postWord => 
                          categoryTagWords.some(categoryWord => 
                            postWord === categoryWord || 
                            postWord.includes(categoryWord) || 
                            categoryWord.includes(postWord)
                          )
                        )
                      })
                    })
                  })

                  return (
                    <div key={post.id} className="border rounded p-4">
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Post Tags: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.length > 0 ? (
                              post.tags.map((tag) => (
                                <Badge key={tag} className="text-xs">
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground italic text-sm">No tags</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Matches Categories: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchingCategories.length > 0 ? (
                              matchingCategories.map((category) => (
                                <Badge key={category.id} className="text-xs">
                                  {category.icon} {category.title}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-red-500 text-sm">No category matches</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>All Unique Tags in Your Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(posts.flatMap(post => post.tags))).sort().map((tag) => (
                  <Badge key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}