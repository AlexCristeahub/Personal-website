export interface BlogCategory {
  id: string
  title: string
  description: string
  slug: string
  icon: string
  tags: string[] // Notion tags that map to this category
  color: string // Theme color for the category
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: 'build-in-public',
    title: 'Build in Public',
    description: 'Documenting what you\'re building, transparently',
    slug: 'build-in-public',
    icon: '🏗️',
    tags: ['build-in-public', 'building', 'transparency', 'open-source', 'development', 'progress', 'updates'],
    color: 'blue'
  },
  {
    id: 'founders-journey',
    title: 'Founder\'s Journey',
    description: 'Personal stories, challenges, decisions',
    slug: 'founders-journey',
    icon: '🚀',
    tags: ['founders-journey', 'entrepreneurship', 'startup', 'founder', 'business', 'journey', 'story'],
    color: 'purple'
  },
  {
    id: 'growth-hacks',
    title: 'Growth Hacks',
    description: 'Practical marketing/traction tactics',
    slug: 'growth-hacks',
    icon: '📈',
    tags: ['growth-hacks', 'marketing', 'growth', 'traction', 'sales', 'acquisition', 'strategy'],
    color: 'green'
  },
  {
    id: 'tools-stacks',
    title: 'Tools & Stacks',
    description: 'Technical/productivity setups',
    slug: 'tools-stacks',
    icon: '🛠️',
    tags: ['tools-stacks', 'productivity', 'tech-stack', 'tools', 'software', 'technology', 'setup'],
    color: 'orange'
  },
  {
    id: 'mindset-philosophy',
    title: 'Mindset & Philosophy',
    description: 'Reflections, opinion pieces',
    slug: 'mindset-philosophy',
    icon: '🧠',
    tags: ['mindset-philosophy', 'philosophy', 'mindset', 'reflection', 'thoughts', 'opinion', 'insights'],
    color: 'indigo'
  }
]

// Utility functions
export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find(category => category.slug === slug)
}

export function getCategoryById(id: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find(category => category.id === id)
}

export function getAllCategorySlugs(): string[] {
  return BLOG_CATEGORIES.map(category => category.slug)
}

export function getCategoryColorClasses(color: string): {
  bg: string
  text: string
  border: string
  hover: string
} {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      hover: 'hover:bg-green-100 dark:hover:bg-green-900/30'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
      hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800',
      hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
    }
  }
  
  return colorMap[color as keyof typeof colorMap] || colorMap.blue
}

export function isValidCategorySlug(slug: string): boolean {
  return getAllCategorySlugs().includes(slug)
}