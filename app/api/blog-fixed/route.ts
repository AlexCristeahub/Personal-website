import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

function formatDatabaseId(id: string): string {
  const cleanId = id.replace(/-/g, "")
  if (cleanId.length !== 32) {
    throw new Error(`Invalid database ID format. Expected 32 characters, got ${cleanId.length}`)
  }
  return `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-${cleanId.slice(12, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20, 32)}`
}

export async function GET() {
  try {
    console.log('🔍 Fixed API - Starting...')
    
    const databaseId = process.env.NOTION_DATABASE_ID
    const token = process.env.NOTION_TOKEN

    if (!token || !databaseId) {
      throw new Error("Missing environment variables")
    }

    const formattedDatabaseId = formatDatabaseId(databaseId)
    console.log('🔍 Fixed API - Using database ID:', formattedDatabaseId)

    // Get database info first
    const database = await notion.databases.retrieve({
      database_id: formattedDatabaseId,
    })

    console.log('🔍 Fixed API - Database retrieved')
    console.log('🔍 Fixed API - Data sources:', database.data_sources?.length || 0)

    if (!database.data_sources || database.data_sources.length === 0) {
      console.log('❌ Fixed API - No data sources found')
      return NextResponse.json({
        posts: [],
        debug: {
          totalPosts: 0,
          allTags: [],
          error: 'No data sources found in database'
        }
      })
    }

    const dataSourceId = database.data_sources[0].id
    console.log('🔍 Fixed API - Using data source:', dataSourceId)

    // Query using dataSources (which your client supports)
    const response = await (notion as any).dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    })

    console.log('🔍 Fixed API - Query successful, found', response.results.length, 'pages')

    const posts = response.results.map((page: any) => {
      const properties = page.properties
      
      // Debug the tags property specifically
      console.log('🏷️ Fixed API - Page:', properties.Title?.title?.[0]?.plain_text)
      console.log('🏷️ Fixed API - Raw Tags property:', JSON.stringify(properties.Tags, null, 2))
      
      // Extract tags more carefully
      let tags: string[] = []
      if (properties.Tags) {
        if (properties.Tags.multi_select) {
          tags = properties.Tags.multi_select.map((tag: any) => tag.name) || []
        } else if (properties.Tags.select) {
          tags = [properties.Tags.select.name]
        } else if (Array.isArray(properties.Tags)) {
          tags = properties.Tags.map((tag: any) => tag.name || tag).filter(Boolean)
        }
      }
      
      console.log('🏷️ Fixed API - Extracted tags:', tags)

      let slug = page.id
      if (properties.Slug?.rich_text?.[0]?.plain_text) {
        slug = properties.Slug.rich_text[0].plain_text
      } else if (properties.Title?.title?.[0]?.plain_text) {
        slug = properties.Title.title[0].plain_text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      }

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || "Untitled",
        slug,
        excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text,
        cover: page.cover?.external?.url || page.cover?.file?.url,
        publishedDate: properties["Published Date"]?.date?.start || page.created_time,
        lastEditedTime: page.last_edited_time,
        tags: tags,
        published: properties.Published?.checkbox || false,
      }
    })

    const allTags = [...new Set(posts.flatMap(p => p.tags))]
    console.log('🏷️ Fixed API - All unique tags:', allTags)

    return NextResponse.json({
      posts: posts,
      debug: {
        totalPosts: posts.length,
        allTags: allTags,
        hasNotionToken: !!process.env.NOTION_TOKEN,
        hasNotionDatabase: !!process.env.NOTION_DATABASE_ID,
        timestamp: new Date().toISOString(),
        dataSourceId: dataSourceId,
        sampleTagsProperty: posts[0]?.tags ? 'Found tags' : 'No tags found'
      }
    })

  } catch (error: any) {
    console.error("❌ Fixed API Error:", error)
    return NextResponse.json({ 
      posts: [],
      error: "Failed to fetch blog posts",
      details: error.message,
      debug: {
        hasNotionToken: !!process.env.NOTION_TOKEN,
        hasNotionDatabase: !!process.env.NOTION_DATABASE_ID,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}