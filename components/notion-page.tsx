export function NotionPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 lg:pr-72 animate-slide-up animate-delay-200">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-foreground mb-4 animate-slide-up animate-delay-400">
          So you might want to know who I am?
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 animate-slide-up animate-delay-500">
          <span>October 11, 2025</span>
          <span>•</span>
          <span>By Alex Cristea</span>
          <span>•</span>
          <span>8 min read</span>
        </div>
      </div>

      <article className="prose prose-xl max-w-none animate-slide-up animate-delay-600">
        <div className="space-y-6">
          <h2 id="key-insights" className="text-3xl font-bold text-foreground mb-4">
            Hello, I am Alex
          </h2>

          <p className="leading-relaxed text-foreground">
            You are probably here from my 𝕏 page, where I am more active.
          </p>

          <p className="leading-relaxed text-foreground">
            Everything about my journey as a young founder you can find in this blog.
            That means apps that I have been working on, behind the scenes, tips & tricks and some opinions about other stuff.
            In the past few months I have been thinking about how much it would benefit people to see where to start from in this space so that you don't have to figure out everything by yourself.
            That's why I created this blog, to show the people what the process looks like.
          </p>

          <h3 id="essential-tools" className="text-2xl font-semibold text-foreground mb-3">
            Essential Remote Work Tools
          </h3>

          <p className="leading-relaxed text-foreground">
            The right tools can make or break a remote team's success. Communication platforms, project management
            software, and collaborative design tools have become the backbone of distributed teams worldwide.
          </p>

          <h2 id="looking-ahead" className="text-3xl font-bold text-foreground mb-4">
            Looking Ahead
          </h2>

          <p className="leading-relaxed text-foreground">
            As we look toward the future, remote work is here to stay. The companies that adapt and embrace these
            changes will be the ones that thrive in the new economy.
          </p>
        </div>
      </article>


    </div>
  )
}
