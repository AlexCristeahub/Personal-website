"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-blog')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const testOriginalApi = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/blog')
      const data = await response.json()
      setResult({ originalApi: true, data })
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testApi} disabled={loading}>
            Test Debug API
          </Button>
          <Button onClick={testOriginalApi} disabled={loading}>
            Test Original API
          </Button>
        </div>
        
        {loading && <div>Loading...</div>}
        
        {result && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}