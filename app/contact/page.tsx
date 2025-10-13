import { NotionSidebar } from "@/components/notion-sidebar"
import { ScrollProgress } from "@/components/scroll-progress"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Contact | Alexandru\'s Blog',
  description: 'Schedule a call with me - book a 30-minute conversation about startups, tech, and innovation',
  keywords: ['contact', 'schedule', 'call', 'consultation', 'booking'],
}

export default function ContactPage() {
  return (
    <>
      <ScrollProgress />
      <NotionSidebar>
        <div className="relative">
          <div className="group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:max-w-5xl group-data-[state=expanded]/sidebar:ml-0 group-data-[state=expanded]/sidebar:mr-64">
            <div className="min-h-screen bg-white dark:bg-black page-content">
              {/* Header Section */}
              <section className="pt-16 pb-8">
                <div className="container mx-auto px-4 text-center">
                  <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Ready to discuss your project, share ideas, or just have a conversation about tech and entrepreneurship? 
                    I'd love to hear from you.
                  </p>
                </div>
              </section>

              {/* Calendar Booking Section */}
              <section className="pb-16">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-500 rounded-lg p-8 shadow-lg">
                      <div className="text-center mb-8">
                        <div className="text-4xl mb-4">📅</div>
                        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Schedule a Call</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          Book a 30-minute call to discuss your project, ideas, or just have a conversation about tech and entrepreneurship.
                        </p>
                        
                        <Button asChild size="lg" className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black px-8 py-3">
                          <Link href="https://cal.com/alexandru-cristea/30min" target="_blank" rel="noopener noreferrer">
                            Book a 30min Call
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>The calendar will open in a new tab</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <Footer />
            </div>
          </div>

        </div>
      </NotionSidebar>
    </>
  )
}