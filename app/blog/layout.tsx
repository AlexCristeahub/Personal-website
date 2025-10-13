import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Blog Categories | Alexandru\'s Blog',
  description: 'Explore blog posts organized by categories: Build in Public, Founder\'s Journey, Growth Hacks, Tools & Stacks, and Mindset & Philosophy. Insights on startups, entrepreneurship, and technology.',
  keywords: ['blog', 'categories', 'startup', 'entrepreneurship', 'growth', 'tools', 'mindset', 'build in public', 'founder'],
  openGraph: {
    title: 'Blog Categories | Alexandru\'s Blog',
    description: 'Explore blog posts organized by categories covering startups, entrepreneurship, and technology insights.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Blog Categories | Alexandru\'s Blog',
    description: 'Explore blog posts organized by categories covering startups, entrepreneurship, and technology insights.',
  },
}

interface BlogLayoutProps {
  children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return children
}