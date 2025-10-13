import type { Metadata } from "next"
import { getCategoryBySlug } from "@/lib/blog-categories"

interface CategoryLayoutProps {
  children: React.ReactNode
  params: { category: string }
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = getCategoryBySlug(params.category)
  
  if (!category) {
    return {
      title: 'Category Not Found | Alexandru\'s Blog',
      description: 'The requested blog category could not be found.',
    }
  }

  return {
    title: `${category.title} | Alexandru's Blog`,
    description: `${category.description}. Explore posts about ${category.tags.join(', ')}.`,
    keywords: [...category.tags, 'blog', 'startup', 'entrepreneurship'],
    openGraph: {
      title: `${category.title} | Alexandru's Blog`,
      description: category.description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${category.title} | Alexandru's Blog`,
      description: category.description,
    },
  }
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return children
}