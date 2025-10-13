import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const results: any = {};

  // Check environment variables
  results.environmentCheck = {
    hasToken: !!process.env.NOTION_TOKEN,
    hasDbId: !!process.env.NOTION_DATABASE_ID,
    tokenPreview: process.env.NOTION_TOKEN ? process.env.NOTION_TOKEN.substring(0, 10) + '...' : 'MISSING',
    dbId: process.env.NOTION_DATABASE_ID || 'MISSING'
  };

  console.log('🔍 Debug Notion - Environment Check:', results.environmentCheck);

  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return NextResponse.json({
      ...results,
      error: 'Missing required environment variables'
    });
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    // Test 1: Can we connect to Notion at all?
    try {
      console.log('🔍 Debug Notion - Testing database query...');
      const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
      });

      results.connectionTest = 'SUCCESS';
      results.totalPages = response.results.length;
      
      console.log('✅ Debug Notion - Connection successful, found', response.results.length, 'pages');

      // Test 2: What properties exist?
      if (response.results.length > 0) {
        const firstPage = response.results[0];
        results.availableProperties = Object.keys(firstPage.properties);
        
        console.log('📊 Debug Notion - Available properties:', results.availableProperties);

        // Test 3: What does the first page look like?
        results.firstPageExample = {
          id: firstPage.id,
          properties: {}
        };

        // Check each property we need
        const requiredProps = ['Title', 'Published', 'Tags', 'Slug', 'Excerpt', 'Published Date'];
        requiredProps.forEach(prop => {
          if (firstPage.properties[prop]) {
            results.firstPageExample.properties[prop] = firstPage.properties[prop];
          } else {
            results.missingProperties = results.missingProperties || [];
            results.missingProperties.push(prop);
          }
        });

        console.log('📊 Debug Notion - Missing properties:', results.missingProperties || 'None');

        // Test 4: Check actual data from first few pages
        results.sampleData = response.results.slice(0, 3).map((page: any) => {
          const title = page.properties.Title?.title?.[0]?.plain_text || 'No title';
          const published = page.properties.Published?.checkbox || false;
          const tags = page.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [];
          
          return {
            id: page.id,
            title,
            published,
            tags,
            hasSlug: !!page.properties.Slug,
            hasExcerpt: !!page.properties.Excerpt,
            hasPublishedDate: !!page.properties['Published Date']
          };
        });

        console.log('📊 Debug Notion - Sample data:', results.sampleData);
      } else {
        console.log('⚠️ Debug Notion - No pages found in database');
        results.warning = 'No pages found in database. Check if integration is connected to the database.';
      }

    } catch (notionError: any) {
      console.error('❌ Debug Notion - Connection failed:', notionError);
      results.connectionTest = 'FAILED';
      results.notionError = {
        message: notionError.message,
        code: notionError.code,
        status: notionError.status
      };
    }

  } catch (clientError: any) {
    console.error('❌ Debug Notion - Client error:', clientError);
    results.clientError = clientError.message;
  }

  return NextResponse.json(results);
}