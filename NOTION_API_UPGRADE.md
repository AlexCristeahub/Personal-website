# Notion API Upgrade to 2025-09-03

## Summary of Changes

Your Notion implementation has been updated to comply with the Notion API version **2025-09-03**. Here are the key changes made:

## 1. API Version Header

All Notion Client initializations now explicitly set the API version:

```typescript
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2025-09-03',  // ✅ Added
})
```

## 2. Property Type Changes

The most significant change in the 2025-09-03 API is that the `title` property type has been renamed to `name`.

### Before (Old API):
```typescript
properties.Title?.title?.[0]?.plain_text
```

### After (New API):
```typescript
properties.Title?.name?.[0]?.plain_text
```

## Files Updated

### Core Library
- ✅ `lib/notion.ts` - Main Notion client and data fetching logic

### API Routes
- ✅ `app/api/blog-fixed/route.ts`
- ✅ `app/api/test-notion/route.ts`
- ✅ `app/api/test-connection/route.ts`
- ✅ `app/api/debug-notion/route.ts`
- ✅ `app/api/check-notion-methods/route.ts`

### Test Files
- ✅ `test-notion.js`

## Key Breaking Changes from Notion API

According to the [Notion upgrade guide](https://developers.notion.com/docs/upgrade-guide-2025-09-03):

1. **🚨 CRITICAL: `databases.query()` removed** - Use `dataSources.query()` instead
2. **Property type renamed**: `title` → `name`
3. **Property value key renamed**: `title` → `name` (for accessing the array of text objects)
4. **Explicit version required**: Must set `notionVersion` in Client initialization

### The Most Important Change

**Before (Old API):**
```typescript
const response = await notion.databases.query({
  database_id: databaseId,
})
```

**After (New API 2025-09-03):**
```typescript
// First, get the database to retrieve its data source
const database = await notion.databases.retrieve({
  database_id: databaseId,
})

// Then query using the data source ID
const dataSourceId = database.data_sources?.[0]?.id || databaseId
const response = await notion.dataSources.query({
  data_source_id: dataSourceId,
})
```

## What You Need to Know

- All your Notion API calls will now use the 2025-09-03 version
- The changes are backward compatible with your database structure
- No changes needed to your Notion database properties (they can still be named "Title")
- The change only affects how you access the property values in code

## Testing

After these changes, you should test:

1. Fetching blog posts from your Notion database
2. Verifying that titles are correctly extracted
3. Checking that all other properties (tags, dates, etc.) still work

Run your test endpoints to verify:
- `/api/test-connection` - Basic connection test
- `/api/test-notion` - Standard API test
- `/api/debug-notion` - Detailed debugging info

## Environment Variables

Your current setup (no changes needed):
```
NOTION_TOKEN=your_notion_token_here
NOTION_DATABASE_ID=your_database_id_here
```

Make sure these are set in your `.env.local` file (which should be in `.gitignore`).

## Next Steps

1. Test your application to ensure all Notion integrations work correctly
2. Monitor for any deprecation warnings in the console
3. Keep your `@notionhq/client` package updated (currently using v5.1.0)

## References

- [Notion API Upgrade Guide 2025-09-03](https://developers.notion.com/docs/upgrade-guide-2025-09-03)
- [Notion API Reference](https://developers.notion.com/reference)
