// Simple fallback for static generation
const mockNotionData: NotionPage[] = [
  {
    id: '1',
    title: 'Welcome to My Blog',
    slug: 'welcome',
    published: true,
    publishedDate: '2024-01-01',
    lastEditedTime: '2024-01-01',
    tags: ['welcome', 'blog'],
    excerpt: 'Welcome to my personal blog where I share thoughts on technology and entrepreneurship.',
    cover: ''
  }
]

let notion: any = null

// Initialize Notion client only in runtime environment
if (typeof window === 'undefined' && process.env.NOTION_TOKEN) {
  try {
    const { Client } = require('@notionhq/client')
    notion = new Client({
      auth: process.env.NOTION_TOKEN,
    })
  } catch (error) {
    console.warn('Notion client initialization failed, using mock data')
  }
}

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
  // Return mock data for static generation
  if (!notion || !process.env.NOTION_DATABASE_ID) {
    console.warn('Using mock data for static generation')
    return mockNotionData
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
    return mockNotionData
  }
}

export async function getPageContent(pageId: string) {
  if (!notion) {
    return []
  }
  
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

// Alias for compatibility
export const getBlogPosts = getPublishedBlogPosts

export async function getBlogPost(slug: string): Promise<NotionPage | null> {
  const posts = await getPublishedBlogPosts()
  return posts.find(post => post.slug === slug) || null
}
