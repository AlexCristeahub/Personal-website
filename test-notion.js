const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2025-09-03',
});

const databaseId = '275e6eb8027c805fb009cbe568177c55';

async function test() {
  try {
    console.log('🔍 Testing Notion connection...\n');
    
    // Test 1: Retrieve database
    console.log('1️⃣ Retrieving database info...');
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    const dbTitle = database.title?.[0]?.plain_text || 'Untitled';
    console.log('✅ Database found:', dbTitle);
    console.log('   Database ID:', database.id);
    console.log('   Parent type:', database.parent?.type);
    if (database.parent?.page_id) {
      console.log('   Parent page ID:', database.parent.page_id);
    }
    if (database.properties) {
      console.log('   Properties:', Object.keys(database.properties).join(', '));
    }
    console.log('   Is inline:', database.is_inline);
    console.log('   Has data_sources:', !!database.data_sources);
    if (database.data_sources && database.data_sources.length > 0) {
      console.log('   Data source ID:', database.data_sources[0].id);
      console.log('   Data source type:', database.data_sources[0].type);
    }
    console.log('');
    
    // Test 2: Query database - try different approaches
    console.log('2️⃣ Querying database...');
    let response;
    
    // For inline databases with data_sources, use dataSources.query
    if (database.data_sources && database.data_sources.length > 0) {
      console.log('   Using dataSources.query (inline database)...');
      const dataSourceId = database.data_sources[0].id;
      response = await notion.dataSources.query({
        data_source_id: dataSourceId,
      });
    } else {
      // For regular databases, use databases.query
      console.log('   Using databases.query (regular database)...');
      response = await notion.databases.query({
        database_id: databaseId,
      });
    }
    
    console.log('✅ Query successful!');
    console.log('   Total results:', response.results.length);
    console.log('');
    
    // Test 3: Show first result
    if (response.results.length > 0) {
      const firstPage = response.results[0];
      console.log('3️⃣ First page details:');
      console.log('   ID:', firstPage.id);
      console.log('   Properties:', Object.keys(firstPage.properties).join(', '));
      console.log('');
      
      // Show property values
      console.log('4️⃣ Property values:');
      for (const [key, value] of Object.entries(firstPage.properties)) {
        console.log(`   ${key}:`, value.type);
        // API 2025-09-03: 'title' property type is now 'name'
        if (value.type === 'name' && value.name?.[0]) {
          console.log(`      → "${value.name[0].plain_text}"`);
        }
        if (value.type === 'checkbox') {
          console.log(`      → ${value.checkbox}`);
        }
        if (value.type === 'date' && value.date) {
          console.log(`      → ${value.date.start}`);
        }
        if (value.type === 'multi_select') {
          console.log(`      → [${value.multi_select.map(t => t.name).join(', ')}]`);
        }
        if (value.type === 'rich_text' && value.rich_text?.[0]) {
          console.log(`      → "${value.rich_text[0].plain_text}"`);
        }
      }
    } else {
      console.log('⚠️ No results found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
    if (error.status) {
      console.error('   Status:', error.status);
    }
  }
}

test();
