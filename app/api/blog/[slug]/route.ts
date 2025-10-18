import { NextResponse } from "next/server"
import { getBlogPost, getPageContent } from "@/lib/notion"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    console.log('🔍 Fetching blog post with slug:', slug)
    
    // Get the post metadata
    const post = await getBlogPost(slug)
    
    if (!post) {
      console.log('❌ Post not found:', slug)
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }
    
    console.log('✅ Post found:', post.title)
    
    // Get the post content (blocks)
    const blocks = await getPageContent(post.id)
    console.log('📄 Content blocks:', blocks.length)
    
    // Format content as recordMap for NotionRenderer
    const recordMap = {
      block: blocks.reduce((acc: any, block: any) => {
        acc[block.id] = { value: block }
        return acc
      }, {})
    }
    
    console.log('📦 RecordMap keys:', Object.keys(recordMap.block).length)
    
    return NextResponse.json({
      ...post,
      content: recordMap,
    })
  } catch (error) {
    console.error("❌ Error fetching blog post:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch blog post",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
