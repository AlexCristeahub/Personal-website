"use client"

import { useState, useEffect } from "react"
import { NotionSidebar } from "@/components/notion-sidebar"
import { ScrollProgress } from "@/components/scroll-progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import Link from "next/link"

export default function SimpleBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        console.log('🔍 Fetching posts from /api/blog...')
        
        const response = await fetch('/api/blog', {
          cache: 'no-store'
        })
        
        console.log('📡 Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('📊 API Response:', data)
        
        // Handle both old format (array) and new format (object with posts)
        const postsArray = Array.isArray(data) ? data : (data.posts || [])
        setPosts(postsArray)
        setDebugInfo(data.debug || null)
        
        console.log('✅ Posts loaded:', postsArray.length)
        
      } catch (err) {
        console.error('❌ Error fetching posts:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <>
      <ScrollProgress />
      <NotionSidebar>
        <div className="relative">
          <div className="group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:max-w-5xl group-data-[state=expanded]/sidebar:ml-0 group-data-[state=expanded]/sidebar:mr-64">
            <div className="container mx-auto px-4 py-8 page-content">
              <h1 className="text-4xl font-bold mb-6">Blog Debug Page</h1>
              
              {/* Error Display */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <h2 className="font-bold">Error:</h2>
                  <p>{error}</p>
                </div>
              )}

              {/* Debug Info */}
              <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded mb-6">
                <h2 className="text-xl font-semibold mb-3">Debug Info:</h2>
                <div className="space-y-1 text-sm">
                  <p>Posts found: {posts.length}</p>
                  <p>Loading: {loading ? 'Yes' : 'No'}</p>
                  <p>Error: {error || 'None'}</p>
                  {debugInfo && (
                    <>
                      <p>API Debug - Total: {debugInfo.totalPosts}</p>
                      <p>API Debug - All Tags: {debugInfo.allTags?.join(', ') || 'None'}</p>
                      <p>API Debug - Has Token: {debugInfo.hasNotionToken ? 'Yes' : 'No'}</p>
                      <p>API Debug - Has Database: {debugInfo.hasNotionDatabase ? 'Yes' : 'No'}</p>
                    </>
                  )}
                </div>
                
                {posts.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Raw Data (Click to expand)</summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-64 bg-white dark:bg-black p-2 rounded border">
                      {JSON.stringify(posts, null, 2)}
                    </pre>
                  </details>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <p>Loading posts...</p>
                </div>
              )}

              {/* Posts Display */}
              {!loading && posts.length === 0 && !error && (
                <div className="text-center py-8">
                  <p>No posts found. Check console logs and debug info above.</p>
                </div>
              )}

              {posts.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Found {posts.length} Posts:</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                      <Card key={post.id || index} className="h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{post.title || 'No Title'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <p><strong>Published:</strong> {post.published ? 'Yes' : 'No'}</p>
                            <p><strong>Slug:</strong> {post.slug || 'No slug'}</p>
                            <p><strong>Published Date:</strong> {post.publishedDate || 'No date'}</p>
                            <div>
                              <strong>Tags:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {post.tags && post.tags.length > 0 ? (
                                  post.tags.map((tag: string, tagIndex: number) => (
                                    <Badge key={tagIndex} className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-gray-500 italic">No tags</span>
                                )}
                              </div>
                            </div>
                            {post.excerpt && (
                              <p><strong>Excerpt:</strong> {post.excerpt}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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