import { NotionSidebar } from "@/components/notion-sidebar"
import { ScrollProgress } from "@/components/scroll-progress"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Design | Alexandru\'s Blog',
  description: 'Design page',
  keywords: ['design'],
}

export default function DesignPage() {
  return (
    <>
      <ScrollProgress />
      <NotionSidebar>
        <div className="relative">
          <div className="group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:max-w-5xl group-data-[state=expanded]/sidebar:ml-0 group-data-[state=expanded]/sidebar:mr-64">
            <div className="min-h-screen bg-white dark:bg-black page-content">
              {/* Blank page */}
              <Footer />
            </div>
          </div>
        </div>
      </NotionSidebar>
    </>
  )
}