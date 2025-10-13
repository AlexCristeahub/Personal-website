"use client"

import useSWR from "swr"
import type { NotionPage, NotionPageContent } from "@/lib/notion"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Post not found")
      }
      throw new Error("Failed to fetch")
    }
    return res.json()
  })

export function useBlogPosts() {
  const {
    data: posts,
    error,
    isLoading,
    mutate,
  } = useSWR<NotionPage[]>("/api/blog", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // Cache for 1 minute
  })

  return {
    posts: posts || [],
    loading: isLoading,
    error: error?.message || null,
    refresh: () => mutate(),
  }
}

export function useBlogPost(slug: string) {
  const {
    data: post,
    error,
    isLoading,
  } = useSWR<NotionPageContent>(slug ? `/api/blog/${slug}` : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 300000, // Cache for 5 minutes (blog posts change less frequently)
  })

  return {
    post: post || null,
    loading: isLoading,
    error: error?.message || null,
  }
}
