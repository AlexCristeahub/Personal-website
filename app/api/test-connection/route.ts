import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

export async function GET() {
  const token = process.env.NOTION_TOKEN
  const databaseId = process.env.NOTION_DATABASE_ID

  console.log('🔍 Testing Notion connection...')
  console.log('Token exists:', !!token)
  console.log('Database ID:', databaseId)

  if (!token || !databaseId) {
    return NextResponse.json({
      success: false,
      error: 'Missing environment variables',
      hasToken: !!token,
      hasDatabaseId: !!databaseId,
    })
  }

  try {
    const notion = new Client({ 
      auth: token,
      notionVersion: '2025-09-03',
    })

    // First, try to retrieve the database to check permissions
    console.log('📊 Retrieving database info...')
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    })

    console.log('✅ Database retrieved:', database.title)

    // API 2025-09-03: Use dataSources.query instead of databases.query
    console.log('🔍 Querying database via dataSources...')
    const dataSourceId = database.data_sources?.[0]?.id || databaseId
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
    })

    console.log('✅ Query successful, results:', response.results.length)

    // Get property names from first result
    const properties = response.results[0]?.properties
    const propertyNames = properties ? Object.keys(properties) : []

    return NextResponse.json({
      success: true,
      database: {
        title: database.title,
        id: database.id,
      },
      results: {
        count: response.results.length,
        propertyNames,
        firstResult: response.results[0] ? {
          id: response.results[0].id,
          properties: Object.keys(response.results[0].properties),
        } : null,
      },
    })
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      status: error.status,
    }, { status: 500 })
  }
}
