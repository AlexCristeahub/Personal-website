"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, Clock } from "lucide-react"
import { toast } from "sonner"

interface SyncStatusProps {
  className?: string
}

export function SyncStatus({ className }: SyncStatusProps) {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const handleSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setLastSync(new Date().toLocaleString())
        toast.success(`Content synced! Found ${data.postsCount} posts.`)

        // Refresh the page to show updated content
        window.location.reload()
      } else {
        throw new Error(data.error || "Sync failed")
      }
    } catch (error) {
      console.error("Sync error:", error)
      toast.error("Failed to sync content. Please try again.")
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Content Sync
        </CardTitle>
        <CardDescription>Sync your latest Notion content with the website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {lastSync ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Last synced: {lastSync}</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">Never synced</span>
              </>
            )}
          </div>
          <Badge variant="secondary">Auto-sync enabled</Badge>
        </div>

        <Button onClick={handleSync} disabled={syncing} className="w-full gap-2">
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Now"}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Content automatically syncs when you publish in Notion</p>
          <p>• Use manual sync if content seems outdated</p>
          <p>• Changes may take a few moments to appear</p>
        </div>
      </CardContent>
    </Card>
  )
}
