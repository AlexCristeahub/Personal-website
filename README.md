# Alexandru's Blog

A modern, minimalist blog built with Next.js, featuring Notion integration and a clean design.

## Features

- 🎨 Modern design with dark/light theme support
- 📝 Notion-powered content management
- 📱 Fully responsive layout
- ⚡ Fast performance with Next.js
- 🔗 Social media integration
- 📊 Blog categorization system

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/alexandru-blog.git
   cd alexandru-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```
   NOTION_TOKEN=your_notion_token_here
   NOTION_DATABASE_ID=your_database_id_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add your environment variables
5. Deploy!

### Deploy on Netlify

1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure environment variables

## Environment Variables

- `NOTION_TOKEN` - Your Notion integration token
- `NOTION_DATABASE_ID` - Your Notion database ID

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Content**: Notion API
- **Deployment**: Vercel
- **Typography**: Inter + Dancing Script + Redaction 50

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   ├── design/            # Design page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── footer.tsx         # Footer component
│   ├── notion-sidebar.tsx # Sidebar component
│   └── ...                # Other components
├── lib/                   # Utility libraries
├── public/                # Static assets
└── package.json           # Dependencies
```

## License

MIT License - feel free to use this project as a template for your own blog!