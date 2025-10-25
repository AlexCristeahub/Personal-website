"use client"

import { useEffect, useState, useRef } from "react"
import { extractHeadingsFromNotion } from "@/lib/utils"

interface TOCItem {
  text: string
  slug: string
  level: number
  href: string
}

interface TableOfContentsProps {
  recordMap?: any
}

export function TableOfContents({ recordMap }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [isSticky, setIsSticky] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (recordMap) {
      const headings = extractHeadingsFromNotion(recordMap)
      setTocItems(headings)
    }
  }, [recordMap])
  
  // Manual sticky implementation
  useEffect(() => {
    const handleScroll = () => {
      if (tocRef.current) {
        const rect = tocRef.current.getBoundingClientRect()
        const shouldStick = window.scrollY > 100
        setIsSticky(shouldStick)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (tocItems.length === 0) return

    const handleScroll = () => {
      const sections = tocItems.map((item) => document.getElementById(item.slug)).filter(Boolean)
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Set initial active section

    return () => window.removeEventListener("scroll", handleScroll)
  }, [tocItems])

  const scrollToSection = (slug: string) => {
    const element = document.getElementById(slug)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (tocItems.length === 0) {
    return (
      <div 
        ref={tocRef}
        className="p-4"
        style={isSticky ? {
          position: 'fixed',
          top: '5rem',
          width: '320px',
          maxHeight: 'calc(100vh - 6rem)',
          overflowY: 'auto'
        } : undefined}
      >
        <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-3">Table of Contents</h3>
          <p className="text-sm text-muted-foreground">No headings found in this post.</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={tocRef}
      className="p-4"
      style={isSticky ? {
        position: 'fixed',
        top: '5rem',
        width: '320px',
        maxHeight: 'calc(100vh - 6rem)',
        overflowY: 'auto'
      } : undefined}
    >
      <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3">Table of Contents</h3>
        <nav className="space-y-2">
          {tocItems.map((item) => (
            <button
              key={item.slug}
              onClick={() => scrollToSection(item.slug)}
              className={`block w-full text-left text-sm transition-colors hover:text-foreground cursor-pointer ${
                activeSection === item.slug ? "text-black dark:text-white font-medium" : "text-muted-foreground"
              } ${item.level === 2 ? "" : item.level === 3 ? "pl-4" : "pl-8"}`}
              title={item.text}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
