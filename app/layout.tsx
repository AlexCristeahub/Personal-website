import type React from "react"
import type { Metadata } from "next"
import { Inter, Dancing_Script } from "next/font/google"
import { Suspense } from "react"
import { ThemeProvider } from "./contexts/ThemeContext"
import PageTransition from "@/components/page-transition"
import { PHProvider } from "./providers/posthog"
import { PostHogPageView } from "./providers/posthog-pageview"
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
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W8MDB37K');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Ahrefs Analytics */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="mdMytTZ7ceLBwaAPJOyHVA" async />
      </head>
      <body className={`${inter.variable} ${dancingScript.variable} font-sans antialiased bg-white text-black dark:text-white transition-colors duration-300`} style={{"--dark-bg": "#000000"} as React.CSSProperties}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W8MDB37K"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <PHProvider>
          <ThemeProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <PostHogPageView />
              <PageTransition>{children}</PageTransition>
            </Suspense>
          </ThemeProvider>
        </PHProvider>
      </body>
    </html>
  )
}
