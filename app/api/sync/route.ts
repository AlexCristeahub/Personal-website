import { NextResponse } from "next/server"
import { getBlogPosts } from "@/lib/notion"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    // Verify webhook signature if provided
    const signature = request.headers.get("x-notion-signature")
    const webhookSecret = process.env.NOTION_WEBHOOK_SECRET

    if (webhookSecret && signature) {
      // In a production environment, you would verify the webhook signature here
      // For now, we'll just check if the secret exists
      console.log("Webhook received with signature:", signature)
    }

    // Fetch latest posts to refresh cache
    const posts = await getBlogPosts()

    // Revalidate blog pages
    revalidatePath("/blog")
    revalidatePath("/")

    // Revalidate individual blog post pages
    posts.forEach((post) => {
      revalidatePath(`/blog/${post.slug}`)
    })

    return NextResponse.json({
      success: true,
      message: "Content synced successfully",
      postsCount: posts.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error syncing content:", error)
    return NextResponse.json({ error: "Failed to sync content" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Manual sync endpoint for testing
    const posts = await getBlogPosts()

    return NextResponse.json({
      success: true,
      message: "Content fetched successfully",
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedDate: post.publishedDate,
        tags: post.tags,
      })),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}
