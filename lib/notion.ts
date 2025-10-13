import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export interface NotionPage {
  id: string
  title: string
  slug: string
  published: boolean
  publishedDate: string
  lastEditedTime: string
  tags: string[]
  excerpt?: string
  cover?: string
}

export async function getPublishedBlogPosts(): Promise<NotionPage[]> {
  if (!process.env.NOTION_DATABASE_ID) {
    console.warn('NOTION_DATABASE_ID not found')
    return []
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Published Date',
          direction: 'descending',
        },
      ],
    })

    return response.results.map((page: any) => {
      const properties = page.properties
      
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
        slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
        published: properties.Published?.checkbox || false,
        publishedDate: properties['Published Date']?.date?.start || '',
        lastEditedTime: page.last_edited_time,
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || '',
        cover: page.cover?.external?.url || page.cover?.file?.url || '',
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getPageContent(pageId: string) {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    })
    return response.results
  } catch (error) {
    console.error('Error fetching page content:', error)
    return []
  }
}