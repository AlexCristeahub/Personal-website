import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    
    console.log('🔍 Testing standard Notion API...');
    
    // Use standard database query (not dataSources)
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
    });

    console.log('✅ Standard API - Found', response.results.length, 'pages');

    const posts = response.results.map((page: any) => {
      const properties = page.properties;
      
      console.log('📊 Page properties:', Object.keys(properties));
      console.log('📊 Tags property:', properties.Tags);
      
      const tags = properties.Tags?.multi_select?.map((tag: any) => tag.name) || [];
      console.log('📊 Extracted tags:', tags);

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || "Untitled",
        published: properties.Published?.checkbox || false,
        tags: tags,
        rawTagsProperty: properties.Tags, // Include raw property for debugging
      };
    });

    const allTags = posts.flatMap(post => post.tags);
    console.log('🏷️ All tags found:', allTags);

    return NextResponse.json({
      success: true,
      totalPosts: posts.length,
      posts: posts,
      allTags: [...new Set(allTags)],
      debug: {
        firstPostProperties: response.results[0] ? Object.keys(response.results[0].properties) : [],
        firstPostTagsRaw: response.results[0] ? response.results[0].properties.Tags : null,
      }
    });

  } catch (error: any) {
    console.error('❌ Standard API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}