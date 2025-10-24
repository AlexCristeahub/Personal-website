import type React from "react"
import type { Metadata } from "next"
import { Inter, Dancing_Script } from "next/font/google"
import { Suspense } from "react"
import { ThemeProvider } from "./contexts/ThemeContext"
import PageTransition from "@/components/page-transition"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Alexandru Cristea's Blog",
  description: "Alexandru Cristea's Blog - Thoughts on technology, entrepreneurship, and building in public",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${dancingScript.variable} font-sans antialiased bg-white text-black dark:text-white transition-colors duration-300`} style={{"--dark-bg": "#000000"} as React.CSSProperties}>
        <ThemeProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <PageTransition>{children}</PageTransition>
          </Suspense>
        </ThemeProvider>
        {/* Analytics component removed */}
      </body>
    </html>
  )
}
