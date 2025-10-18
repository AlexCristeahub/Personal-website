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
      notionVersion: '2025-09-03',
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
    console.log('🔍 Fetching from Notion database:', process.env.NOTION_DATABASE_ID)
    
    // API 2025-09-03: databases.query no longer exists, use dataSources.query
    // First retrieve the database to get its data source
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    })
    
    console.log('📊 Database info:', {
      title: database.title?.[0]?.plain_text || 'Untitled',
      hasDataSources: !!database.data_sources,
      dataSourceCount: database.data_sources?.length || 0
    })
    
    // Get the data source ID (all databases have data sources in the new API)
    const dataSourceId = database.data_sources?.[0]?.id || process.env.NOTION_DATABASE_ID
    
    console.log('🔄 Using dataSources.query with ID:', dataSourceId)
    
    // Try to sort by Published Date (most common), fallback to no sort if it fails
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
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
    }).catch(async (sortError: any) => {
      // If sorting fails, try without sort
      console.log('⚠️ Sorting failed, querying without sort')
      return notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
      })
    })

    console.log('✅ Notion response:', {
      count: response.results.length,
      hasResults: response.results.length > 0
    })

    if (response.results.length === 0) {
      console.warn('⚠️ No published posts found in Notion')
      return mockNotionData
    }

    return response.results.map((page: any) => {
      const properties = page.properties
      
      // Log first page properties for debugging
      if (response.results.indexOf(page) === 0) {
        console.log('📄 First page properties:', Object.keys(properties))
      }
      
      // Debug property values for first page
      if (response.results.indexOf(page) === 0) {
        console.log('🔍 Property types:', {
          Title: properties.Title?.type,
          Tags: properties.Tags?.type,
          Slug: properties.slug?.type || properties.Slug?.type,
          PublishedDate: properties['Published Date']?.type,
        })
        console.log('🔍 Tags value:', properties.Tags)
        console.log('🔍 slug (lowercase) value:', properties.slug)
        console.log('🔍 Slug (uppercase) value:', properties.Slug)
        console.log('🔍 Published Date value:', properties['Published Date'])
      }
      
      // Extract tags - handle both 'select' (single) and 'multi_select' (multiple)
      let tags: string[] = []
      if (properties.Tags?.type === 'select' && properties.Tags.select) {
        tags = [properties.Tags.select.name]
      } else if (properties.Tags?.type === 'multi_select' && properties.Tags.multi_select) {
        tags = properties.Tags.multi_select.map((tag: any) => tag.name)
      }
      
      return {
        id: page.id,
        // Title property still uses 'title' type (not changed to 'name' yet)
        title: properties.Title?.title?.[0]?.plain_text || 
               properties.Name?.title?.[0]?.plain_text || 
               'Untitled',
        // Slug property - check both cases and generate from title if empty
        slug: properties.slug?.rich_text?.[0]?.plain_text || 
              properties.Slug?.rich_text?.[0]?.plain_text || 
              // Generate slug from title if not provided
              (properties.Title?.title?.[0]?.plain_text || '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '') ||
              page.id,
        published: properties.Published?.checkbox || false,
        publishedDate: properties['Published Date']?.date?.start || 
                      properties.Date?.date?.start || 
                      page.created_time || 
                      page.last_edited_time,
        lastEditedTime: page.last_edited_time,
        tags: tags,
        excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || 
                properties.Summary?.rich_text?.[0]?.plain_text || '',
        cover: page.cover?.external?.url || page.cover?.file?.url || '',
      }
    })
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
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
