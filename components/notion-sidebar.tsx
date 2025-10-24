import type React from "react"
import { memo } from "react"
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Breadcrumb } from "@/components/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"

import Link from "next/link"

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

const BookOpenIcon = memo(({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
))

const FileTextIcon = memo(({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
))

const HashIcon = memo(({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
))

const PaletteIcon = memo(({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h10a2 2 0 012 2v2a2 2 0 01-2 2H9" />
  </svg>
))



const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: BookOpenIcon,
  },
  {
    title: "Apps",
    url: "#the-power-of-minimalism",
    icon: FileTextIcon,
  },
  {
    title: "Design",
    url: "/design",
    icon: PaletteIcon,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: HashIcon,
  },
]

interface NotionSidebarProps {
  children: React.ReactNode
}

export const NotionSidebar = memo(function NotionSidebar({ children }: NotionSidebarProps) {
  return (
    <SidebarProvider>
      <ThemeToggle />
      <Sidebar className="border-r border-gray-200 dark:border-gray-500 bg-sidebar dark:bg-sidebar">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-600 dark:text-gray-300 font-medium">📝 Alexandru's Blog</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      {item.url.startsWith("#") ? (
                        <a href={item.url} className="text-gray-700 dark:text-gray-200 hover:opacity-70">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </a>
                      ) : (
                        <Link href={item.url} className="text-gray-700 dark:text-gray-200 hover:opacity-70">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-white dark:bg-black">
        <div className="sticky top-0 z-40 flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-500 bg-white dark:bg-black">
          <SidebarTrigger className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:opacity-70" />
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-500" />
          <Breadcrumb />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
})
