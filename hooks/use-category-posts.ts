"use client"

import { useMemo } from "react"
import { useBlogPosts } from "@/hooks/use-blog"
import { getCategoryBySlug, BLOG_CATEGORIES, type BlogCategory } from "@/lib/blog-categories"
import type { NotionPage } from "@/lib/notion"

export interface UseCategoryPostsReturn {
  posts: NotionPage[]
  loading: boolean
  error: string | null
  postCount: number
  category: BlogCategory | undefined
}

export function useCategoryPosts(categorySlug: string): UseCategoryPostsReturn {
  const { posts: allPosts, loading, error } = useBlogPosts()
  const category = getCategoryBySlug(categorySlug)

  const filteredPosts = useMemo(() => {
    if (!category || !allPosts.length) {
      return []
    }

    // TEMPORARY: Show all posts in every category for debugging
    // Remove this and uncomment the filtering logic below once tags are working
    return allPosts

    // return allPosts.filter(post => {
    //   // Check if any of the post's tags match any of the category's tags
    //   return post.tags.some(postTag => {
    //     const normalizedPostTag = postTag.toLowerCase().trim()
    //     return category.tags.some(categoryTag => {
    //       const normalizedCategoryTag = categoryTag.toLowerCase().trim()
          
    //       // Exact match
    //       if (normalizedPostTag === normalizedCategoryTag) return true
          
    //       // Partial match (either direction)
    //       if (normalizedPostTag.includes(normalizedCategoryTag) || 
    //           normalizedCategoryTag.includes(normalizedPostTag)) return true
          
    //       // Handle common variations
    //       const postTagWords = normalizedPostTag.split(/[-_\s]+/)
    //       const categoryTagWords = normalizedCategoryTag.split(/[-_\s]+/)
          
    //       // Check if any words match
    //       return postTagWords.some(postWord => 
    //         categoryTagWords.some(categoryWord => 
    //           postWord === categoryWord || 
    //           postWord.includes(categoryWord) || 
    //           categoryWord.includes(postWord)
    //         )
    //       )
    //     })
    //   })
    // })
  }, [allPosts, category])

  return {
    posts: filteredPosts,
    loading,
    error,
    postCount: filteredPosts.length,
    category
  }
}

export interface UseCategoryCountsReturn {
  counts: Record<string, number>
  loading: boolean
  error: string | null
  totalPosts: number
}

export function useCategoryCounts(): UseCategoryCountsReturn {
  const { posts: allPosts, loading, error } = useBlogPosts()

  const counts = useMemo(() => {
    if (!allPosts.length) {
      return {}
    }

    const categoryCount: Record<string, number> = {}

    // Initialize all categories with 0 count
    BLOG_CATEGORIES.forEach(category => {
      categoryCount[category.slug] = 0
    })

    // TEMPORARY: Count all posts for each category for debugging
    // Replace this with the filtering logic below once tags are working
    BLOG_CATEGORIES.forEach(category => {
      categoryCount[category.slug] = allPosts.length
    })

    // // Count posts for each category
    // allPosts.forEach(post => {
    //   BLOG_CATEGORIES.forEach(category => {
    //     const hasMatchingTag = post.tags.some(postTag => {
    //       const normalizedPostTag = postTag.toLowerCase().trim()
    //       return category.tags.some(categoryTag => {
    //         const normalizedCategoryTag = categoryTag.toLowerCase().trim()
            
    //         // Exact match
    //         if (normalizedPostTag === normalizedCategoryTag) return true
            
    //         // Partial match (either direction)
    //         if (normalizedPostTag.includes(normalizedCategoryTag) || 
    //             normalizedCategoryTag.includes(normalizedPostTag)) return true
            
    //         // Handle common variations
    //         const postTagWords = normalizedPostTag.split(/[-_\s]+/)
    //         const categoryTagWords = normalizedCategoryTag.split(/[-_\s]+/)
            
    //         // Check if any words match
    //         return postTagWords.some(postWord => 
    //           categoryTagWords.some(categoryWord => 
    //             postWord === categoryWord || 
    //             postWord.includes(categoryWord) || 
    //             categoryWord.includes(postWord)
    //           )
    //         )
    //       })
    //     })
        
    //     if (hasMatchingTag) {
    //       categoryCount[category.slug]++
    //     }
    //   })
    // })

    return categoryCount
  }, [allPosts])

  return {
    counts,
    loading,
    error,
    totalPosts: allPosts.length
  }
}