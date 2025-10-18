const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2025-09-03',
});

console.log('🔍 Notion Client Structure:');
console.log('Available properties:', Object.keys(notion));
console.log('\n📊 Databases property:', typeof notion.databases);
if (notion.databases) {
  console.log('Databases methods:', Object.keys(notion.databases));
  console.log('Has query?', typeof notion.databases.query);
  console.log('Has retrieve?', typeof notion.databases.retrieve);
}

console.log('\n📊 DataSources property:', typeof notion.dataSources);
if (notion.dataSources) {
  console.log('DataSources methods:', Object.keys(notion.dataSources));
}

console.log('\n📊 Pages property:', typeof notion.pages);
if (notion.pages) {
  console.log('Pages methods:', Object.keys(notion.pages));
}
