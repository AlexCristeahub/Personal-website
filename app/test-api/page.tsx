"use client"

import { useState, useEffect } from "react"

export default function TestAPI() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)

  useEffect(() => {
    async function testAPI() {
      try {
        setLoading(true)
        console.log('🔍 Testing API connection...')
        
        const response = await fetch('/api/blog', {
          cache: 'no-store'
        })
        
        setResponseStatus(response.status)
        console.log('📡 Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log('📊 API Response:', result)
        setData(result)
        
      } catch (err) {
        console.error('❌ API Test Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testAPI()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Test Results</h1>
      
      <div className="space-y-6">
        {/* Environment Variables Check */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Environment Variables</h2>
          <div className="space-y-1 text-sm">
            <p>NOTION_TOKEN: {process.env.NOTION_TOKEN ? '✅ Set' : '❌ Missing'}</p>
            <p>NOTION_DATABASE_ID: {process.env.NOTION_DATABASE_ID ? '✅ Set' : '❌ Missing'}</p>
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
          </div>
        </div>

        {/* API Response Status */}
        <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">API Response</h2>
          <p>Status: {responseStatus || 'Not yet called'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="font-bold">Error Details:</h2>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p>Testing API connection...</p>
          </div>
        )}

        {/* Success Data */}
        {data && (
          <div className="space-y-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Success! Data Found:</h2>
              <p>Posts found: {Array.isArray(data) ? data.length : (data.posts?.length || 0)}</p>
              <p>Data type: {typeof data}</p>
              <p>Is array: {Array.isArray(data) ? 'Yes' : 'No'}</p>
            </div>

            <details className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <summary className="cursor-pointer font-semibold">Raw API Response (Click to expand)</summary>
              <pre className="mt-4 text-xs overflow-auto max-h-96 bg-white dark:bg-black p-4 rounded border">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>

            {/* Post Summary */}
            {(Array.isArray(data) ? data : data.posts)?.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Posts Summary:</h3>
                <div className="space-y-2">
                  {(Array.isArray(data) ? data : data.posts).slice(0, 5).map((post: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-3">
                      <p className="font-medium">{post.title || 'No title'}</p>
                      <p className="text-sm text-gray-600">Published: {post.published ? 'Yes' : 'No'}</p>
                      <p className="text-sm text-gray-600">Tags: {post.tags?.join(', ') || 'None'}</p>
                    </div>
                  ))}
                  {(Array.isArray(data) ? data : data.posts).length > 5 && (
                    <p className="text-sm text-gray-500">... and {(Array.isArray(data) ? data : data.posts).length - 5} more posts</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}