"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { memo } from "react"

const HomeIcon = memo(({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
))

const ChevronRightIcon = memo(({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
))

interface BreadcrumbItem {
  label: string
  href: string
  isActive?: boolean
}

const pathToLabel: Record<string, string> = {
  "/": "Home",
  "/blog": "Blog",
  "/admin": "Admin",
}

export const Breadcrumb = memo(function Breadcrumb() {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/", isActive: pathname === "/" }]

    if (segments.length === 0) return breadcrumbs

    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      // Handle dynamic routes like /blog/[slug]
      if (segment.length > 20) {
        // Truncate long slugs
        const label = segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        breadcrumbs.push({
          label: label.length > 30 ? `${label.substring(0, 30)}...` : label,
          href: currentPath,
          isActive: isLast,
        })
      } else {
        const label = pathToLabel[currentPath] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        breadcrumbs.push({
          label,
          href: currentPath,
          isActive: isLast,
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index === 0 && <HomeIcon className="w-4 h-4 mr-1" />}

          {item.isActive ? (
            <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
              {item.label}
            </Link>
          )}

          {index < breadcrumbs.length - 1 && <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />}
        </div>
      ))}
    </nav>
  )
})
