import { NotionPage } from "@/components/notion-page"
import { NotionSidebar } from "@/components/notion-sidebar"
import { ScrollProgress } from "@/components/scroll-progress"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import Link from "next/link"



export default function Home() {
  return (
    <>
      <ScrollProgress />
      <NotionSidebar>
        <div className="relative">
          <div className="group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:max-w-5xl group-data-[state=expanded]/sidebar:ml-0 group-data-[state=expanded]/sidebar:mr-64">
            <div className="p-6 bg-white dark:bg-black page-content">
              <div className="mb-8">
                <NotionPage />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-500 pt-8">
                <div className="text-center py-16 bg-white dark:bg-black border border-gray-200 dark:border-gray-500 rounded-lg">
                  <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">Ready to Connect?</h2>
                    <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                      Let's discuss your project, share ideas, or just have a conversation about tech and entrepreneurship.
                    </p>
                    <Button asChild size="lg" className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black font-semibold px-8 py-3">
                      <Link href="/contact">
                        Get in Touch
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </NotionSidebar>
    </>
  )
}
