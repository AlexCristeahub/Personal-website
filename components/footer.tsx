import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

function SocialCard({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:bg-accent hover:text-accent-foreground flex items-center justify-between border-t border-b p-3 text-sm md:border-t-0 group transition-colors"
    >
      <span className="font-medium">{title}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}

function ContentSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 border-b">
      {children}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] mt-16">
      <div className="relative mx-auto max-w-3xl px-4">
        <div className="relative grid grid-cols-1 border-x md:grid-cols-2 md:divide-x">
          {/* Photo Column */}
          <div>
            <ContentSection>
              <div className="w-full h-full overflow-hidden">
                <img 
                  src="/alexandru-portrait.png" 
                  alt="Alexandru Cristea" 
                  className="w-full h-full object-cover"
                />
              </div>
            </ContentSection>
          </div>

          {/* Social Media Column */}
          <div className="flex flex-col">
            <SocialCard title="X / Twitter" href="https://x.com/alex_cristeaz" />
            <SocialCard title="LinkedIn" href="https://www.linkedin.com/in/alexandru-cristea-814b95327/" />
            <SocialCard title="Instagram" href="https://www.instagram.com/alexcristea__/" />
            <div className="flex-1 flex items-end justify-end p-3">
              <div className="font-redaction text-lg font-bold">
                Alexandru Cristea
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex justify-center border-t p-3">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Alexandru Cristea. All rights reserved.
        </p>
      </div>
    </footer>
  )
}