'use client';

import { useState, useEffect } from 'react';

export default function TestFixedPage() {
  const [results, setResults] = useState<any>(null);
  const [methodsCheck, setMethodsCheck] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runTests() {
      try {
        // Test 1: Check available methods
        const methodsResponse = await fetch('/api/check-notion-methods', { cache: 'no-store' });
        const methodsData = await methodsResponse.json();
        setMethodsCheck(methodsData);

        // Test 2: Try the fixed API
        const fixedResponse = await fetch('/api/blog-fixed', { cache: 'no-store' });
        const fixedData = await fixedResponse.json();
        setResults(fixedData);

      } catch (error) {
        setResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    }

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔧 Testing Fixed API...</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔧 Fixed API Test Results</h1>
      
      {/* Methods Check */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">🔍 Available Notion Methods</h2>
        {methodsCheck?.success ? (
          <div className="space-y-2 text-sm">
            <p><strong>Notion Version:</strong> {methodsCheck.notionVersion}</p>
            <p><strong>Has databases.query:</strong> {methodsCheck.methods?.hasDatabaseQuery ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Has dataSources.query:</strong> {methodsCheck.methods?.hasDataSourcesQuery ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Available methods:</strong> {methodsCheck.methods?.availableMethods?.join(', ')}</p>
            <p><strong>Database methods:</strong> {methodsCheck.methods?.databaseMethods?.join(', ')}</p>
            <p><strong>DataSources methods:</strong> {methodsCheck.methods?.dataSourcesMethods?.join(', ')}</p>
          </div>
        ) : (
          <p className="text-red-600">Error: {methodsCheck?.error}</p>
        )}
      </div>

      {/* Fixed API Results */}
      {results?.posts ? (
        <div className="space-y-6">
          <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">✅ Fixed API Success!</h2>
            <div className="space-y-2">
              <p><strong>Total Posts:</strong> {results.debug?.totalPosts}</p>
              <p><strong>All Tags Found:</strong> {results.debug?.allTags?.length > 0 ? results.debug.allTags.join(', ') : 'No tags found'}</p>
              <p><strong>Data Source ID:</strong> {results.debug?.dataSourceId}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">📝 Posts with Tags:</h2>
            <div className="space-y-4">
              {results.posts?.map((post: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded border">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <p><strong>Published:</strong> {post.published ? 'Yes' : 'No'}</p>
                  <p><strong>Tags:</strong> 
                    {post.tags?.length > 0 ? (
                      <span className="ml-2">
                        {post.tags.map((tag: string, tagIndex: number) => (
                          <span key={tagIndex} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">
                            {tag}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-red-600 ml-2">No tags</span>
                    )}
                  </p>
                  <p><strong>Slug:</strong> {post.slug}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">❌ Error</h2>
          <p>{results?.error || results?.details}</p>
          {results?.debug && (
            <div className="mt-4">
              <p><strong>Debug Info:</strong></p>
              <pre className="text-xs bg-white dark:bg-black p-3 rounded mt-2">
                {JSON.stringify(results.debug, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-bold mb-2">🎯 What This Test Does:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Checks what Notion API methods are available</li>
          <li>Uses the dataSources.query method (which your client supports)</li>
          <li>Improved tag extraction with better error handling</li>
          <li>Shows detailed debugging of the tag extraction process</li>
          <li>Displays exactly what tags are found for each post</li>
        </ul>
      </div>
    </div>
  );
}