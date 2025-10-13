import { NextResponse } from "next/server"
import { getBlogPosts } from "@/lib/notion"

export async function GET() {
  try {
    console.log('🔍 API called with:', {
      token: process.env.NOTION_TOKEN ? 'EXISTS' : 'MISSING',
      dbId: process.env.NOTION_DATABASE_ID ? 'EXISTS' : 'MISSING',
      dbIdValue: process.env.NOTION_DATABASE_ID
    })
    
    console.log("📝 Blog API: Starting fetch...")
    const posts = await getBlogPosts()
    console.log("📝 Blog API: Fetched", posts.length, "posts")
    
    // Log first post details for debugging
    if (posts.length > 0) {
      console.log("📊 First post details:", {
        title: posts[0].title,
        published: posts[0].published,
        tags: posts[0].tags,
        slug: posts[0].slug
      })
    }
    
    // Log all unique tags
    const allTags = [...new Set(posts.flatMap(p => p.tags))]
    console.log("🏷️ All unique tags found:", allTags)
    
    return NextResponse.json({
      posts: posts,
      debug: {
        totalPosts: posts.length,
        allTags: allTags,
        hasNotionToken: !!process.env.NOTION_TOKEN,
        hasNotionDatabase: !!process.env.NOTION_DATABASE_ID,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("📝 Blog API Error:", error)
    console.error("📝 Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: "Failed to fetch blog posts",
      details: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        hasNotionToken: !!process.env.NOTION_TOKEN,
        hasNotionDatabase: !!process.env.NOTION_DATABASE_ID,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}
