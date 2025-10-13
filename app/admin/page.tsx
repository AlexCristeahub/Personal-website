"use client"

import { NotionSidebar } from "@/components/notion-sidebar"
import { ScrollProgress } from "@/components/scroll-progress"
import { TableOfContents } from "@/components/table-of-contents"
import { SyncStatus } from "@/components/sync-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Database, Webhook, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <>
      <ScrollProgress />
      <NotionSidebar>
        <div className="relative">
          <div className="group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:max-w-5xl group-data-[state=expanded]/sidebar:ml-0 group-data-[state=expanded]/sidebar:mr-64">
            <div className="container mx-auto px-4 py-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
                <p className="text-xl text-muted-foreground">Manage your Notion-powered blog</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SyncStatus />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Notion Setup
                    </CardTitle>
                    <CardDescription>Configure your Notion database connection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database ID</span>
                        <Badge variant={process.env.NOTION_DATABASE_ID ? "default" : "destructive"}>
                          {process.env.NOTION_DATABASE_ID ? "Connected" : "Missing"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Token</span>
                        <Badge variant={process.env.NOTION_TOKEN ? "default" : "destructive"}>
                          {process.env.NOTION_TOKEN ? "Connected" : "Missing"}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Required environment variables:</p>
                      <p>• NOTION_TOKEN</p>
                      <p>• NOTION_DATABASE_ID</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Webhook className="w-5 h-5" />
                      Webhooks
                    </CardTitle>
                    <CardDescription>Automatic content synchronization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Webhook URL</span>
                        <Badge variant="outline">/api/sync</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status</span>
                        <Badge variant="secondary">Ready</Badge>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Configure in Notion:</p>
                      <p>• Go to your integration settings</p>
                      <p>• Add webhook URL: /api/sync</p>
                      <p>• Select database events</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Link href="/blog">
                        <Button variant="outline" className="w-full gap-2 bg-transparent">
                          <ExternalLink className="w-4 h-4" />
                          View Blog
                        </Button>
                      </Link>

                      <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
                        <a href="https://notion.so" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                          Open Notion
                        </a>
                      </Button>

                      <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
                        <a href="/api/sync" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                          Test Sync API
                        </a>
                      </Button>

                      <Link href="/">
                        <Button variant="outline" className="w-full gap-2 bg-transparent">
                          <ExternalLink className="w-4 h-4" />
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <TableOfContents />
        </div>
      </NotionSidebar>
    </>
  )
}
