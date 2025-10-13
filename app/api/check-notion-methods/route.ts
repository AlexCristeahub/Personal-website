import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    
    const methods = {
      hasDatabase: !!notion.databases,
      hasDatabaseQuery: !!(notion.databases && notion.databases.query),
      hasDatabaseRetrieve: !!(notion.databases && notion.databases.retrieve),
      hasDataSources: !!(notion as any).dataSources,
      hasDataSourcesQuery: !!((notion as any).dataSources && (notion as any).dataSources.query),
      availableMethods: Object.keys(notion),
      databaseMethods: notion.databases ? Object.keys(notion.databases) : [],
      dataSourcesMethods: (notion as any).dataSources ? Object.keys((notion as any).dataSources) : [],
    };

    console.log('🔍 Available Notion methods:', methods);

    return NextResponse.json({
      success: true,
      methods,
      notionVersion: require('@notionhq/client/package.json').version,
    });

  } catch (error: any) {
    console.error('❌ Error checking Notion methods:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}