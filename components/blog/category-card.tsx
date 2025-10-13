"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCategoryColorClasses, type BlogCategory } from "@/lib/blog-categories"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CategoryCardProps {
  category: BlogCategory
  postCount: number
  className?: string
}

export function CategoryCard({ category, postCount, className }: CategoryCardProps) {
  const colorClasses = getCategoryColorClasses(category.color)

  return (
    <Link href={`/blog/${category.slug}`} className="block">
      <Card 
        className={cn(
          "h-full transition-all duration-200 cursor-pointer group",
          "hover:shadow-lg hover:scale-[1.02]",
          colorClasses.border,
          colorClasses.hover,
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {category.icon}
            </div>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs font-medium",
                colorClasses.bg,
                colorClasses.text
              )}
            >
              {postCount} {postCount === 1 ? 'post' : 'posts'}
            </Badge>
          </div>
          <CardTitle className={cn(
            "text-xl font-bold group-hover:text-opacity-80 transition-colors",
            colorClasses.text
          )}>
            {category.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {category.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1">
            {category.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  colorClasses.bg,
                  colorClasses.text,
                  "opacity-70"
                )}
              >
                {tag}
              </span>
            ))}
            {category.tags.length > 3 && (
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-muted-foreground bg-muted">
                +{category.tags.length - 3}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}