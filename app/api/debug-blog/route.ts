import { NextResponse } from "next/server"
import { getBlogPosts } from "@/lib/notion"

export async function GET() {
  try {
    console.log("🔍 Debug: Starting blog posts fetch...")
    
    const posts = await getBlogPosts()
    
    console.log("🔍 Debug: Fetched posts:", posts.length)
    console.log("🔍 Debug: First post:", posts[0])
    
    return NextResponse.json({
      success: true,
      count: posts.length,
      posts: posts,
      debug: {
        hasNotionToken: !!process.env.NOTION_TOKEN,
        hasNotionDatabase: !!process.env.NOTION_DATABASE_ID,
        notionDatabaseId: process.env.NOTION_DATABASE_ID,
      }
    })
  } catch (error) {
    console.error("🔍 Debug: Error in blog API:", error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      debug: {
        hasNotionToken: !!process.env.NOTION_TOKEN,
        hasNotionDatabase: !!process.env.NOTION_DATABASE_ID,
        notionDatabaseId: process.env.NOTION_DATABASE_ID,
      }
    }, { status: 500 })
  }
}