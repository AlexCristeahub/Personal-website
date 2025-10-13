'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    // If pathname changed (not initial load)
    if (previousPathname.current !== pathname && !isInitialLoad) {
      // Fade out current content
      setIsVisible(false)
      
      // After fade out, update content and fade in
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setIsVisible(true)
      }, 300) // Shorter fade-out duration

      previousPathname.current = pathname
      return () => clearTimeout(timer)
    } else if (isInitialLoad) {
      // Initial load - show content immediately
      setDisplayChildren(children)
      setIsVisible(true)
      setIsInitialLoad(false)
      previousPathname.current = pathname
    }
  }, [pathname, children, isInitialLoad])

  return (
    <div 
      className={`transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transitionDuration: '300ms',
        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {displayChildren}
    </div>
  )
}