'use client';

import { useState, useEffect } from 'react';

export default function TestTagsPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testStandardAPI() {
      try {
        const response = await fetch('/api/test-notion', { cache: 'no-store' });
        const data = await response.json();
        setResults(data);
      } catch (error) {
        setResults({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    }

    testStandardAPI();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🧪 Testing Standard Notion API...</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Standard Notion API Test</h1>
      
      {results?.success ? (
        <div className="space-y-6">
          <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">✅ Success!</h2>
            <div className="space-y-2">
              <p><strong>Total Posts:</strong> {results.totalPosts}</p>
              <p><strong>All Tags Found:</strong> {results.allTags?.length > 0 ? results.allTags.join(', ') : 'No tags found'}</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">📝 Posts with Tags:</h2>
            <div className="space-y-4">
              {results.posts?.map((post: any, index: number) => (
                <div key={index} className="bg-white dark:bg-black p-4 rounded border">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <p><strong>Published:</strong> {post.published ? 'Yes' : 'No'}</p>
                  <p><strong>Tags:</strong> {post.tags?.length > 0 ? post.tags.join(', ') : 'No tags'}</p>
                  {post.rawTagsProperty && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600">Raw Tags Property</summary>
                      <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
                        {JSON.stringify(post.rawTagsProperty, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">🔍 Debug Info:</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Available Properties:</strong> {results.debug?.firstPostProperties?.join(', ')}</p>
              <p><strong>First Post Tags Raw:</strong></p>
              <pre className="bg-white dark:bg-black p-3 rounded text-xs">
                {JSON.stringify(results.debug?.firstPostTagsRaw, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">❌ Error</h2>
          <p>{results?.error}</p>
          {results?.stack && (
            <details className="mt-4">
              <summary className="cursor-pointer">Stack Trace</summary>
              <pre className="text-xs mt-2 bg-white dark:bg-black p-3 rounded">
                {results.stack}
              </pre>
            </details>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-bold mb-2">🎯 What This Test Does:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Uses the standard Notion API (not dataSources)</li>
          <li>Queries your database directly</li>
          <li>Shows raw tag properties from Notion</li>
          <li>Extracts tags using the standard method</li>
          <li>Shows exactly what tags are found</li>
        </ul>
      </div>
    </div>
  );
}