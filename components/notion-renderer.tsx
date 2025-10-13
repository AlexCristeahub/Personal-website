"use client"

import { createSlug } from "@/lib/utils"

interface NotionRendererProps {
  recordMap: any
  rootPageId?: string
  previewImages?: boolean
  showCollectionViewDropdown?: boolean
}

export function NotionRenderer({
  recordMap,
  rootPageId,
  previewImages = true,
  showCollectionViewDropdown = false,
}: NotionRendererProps) {
  if (!recordMap || !recordMap.block) {
    return (
      <div className="notion-renderer">
        <div className="p-8 text-center text-muted-foreground">
          <p>Content is currently unavailable. Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const blocks = Object.values(recordMap.block).map((block: any) => block.value)

  return (
    <div className="notion-renderer w-full px-6 py-8">
      <div className="prose prose-xl dark:prose-invert max-w-none">
        {blocks.map((block: any) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  )
}

function BlockRenderer({ block }: { block: any }) {
  if (!block || !block.type) {
    return null
  }

  const blockContent = block[block.type]

  switch (block.type) {
    case "paragraph":
      return (
        <p className="mb-4">
          <RichTextRenderer richText={blockContent.rich_text || []} />
        </p>
      )

    case "heading_1":
      const h1Text = blockContent.rich_text?.map((item: any) => item.plain_text || "").join("") || ""
      const h1Slug = h1Text ? createSlug(h1Text) : ""
      return (
        <h1 id={h1Slug} className="text-3xl font-bold mb-6 mt-8 scroll-mt-20">
          <RichTextRenderer richText={blockContent.rich_text || []} />
        </h1>
      )

    case "heading_2":
      const h2Text = blockContent.rich_text?.map((item: any) => item.plain_text || "").join("") || ""
      const h2Slug = h2Text ? createSlug(h2Text) : ""
      return (
        <h2 id={h2Slug} className="text-2xl font-semibold mb-4 mt-6 scroll-mt-20">
          <RichTextRenderer richText={blockContent.rich_text || []} />
        </h2>
      )

    case "heading_3":
      const h3Text = blockContent.rich_text?.map((item: any) => item.plain_text || "").join("") || ""
      const h3Slug = h3Text ? createSlug(h3Text) : ""
      return (
        <h3 id={h3Slug} className="text-xl font-medium mb-3 mt-5 scroll-mt-20">
          <RichTextRenderer richText={blockContent.rich_text || []} />
        </h3>
      )

    case "bulleted_list_item":
      return (
        <li className="mb-2">
          <RichTextRenderer richText={blockContent.rich_text || []} />
        </li>
      )

    case "numbered_list_item":
      return (
        <li className="mb-2">
          <RichTextRenderer richText={blockContent.rich_text || []} />
        </li>
      )

    case "quote":
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6">
          <RichTextRenderer richText={blockContent.rich_text || []} />
        </blockquote>
      )

    case "code":
      return (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
          <code className="text-sm">
            <RichTextRenderer richText={blockContent.rich_text || []} />
          </code>
        </pre>
      )

    case "image":
      const imageUrl = blockContent.file?.url || blockContent.external?.url
      const caption = blockContent.caption?.[0]?.plain_text

      if (imageUrl) {
        return (
          <figure className="my-6">
            <img src={imageUrl || "/placeholder.svg"} alt={caption || "Image"} className="w-full rounded-lg" />
            {caption && (
              <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">{caption}</figcaption>
            )}
          </figure>
        )
      }
      return null

    case "divider":
      return <hr className="my-8 border-gray-300 dark:border-gray-500" />

    default:
      // For unsupported block types, show the raw text if available
      if (blockContent.rich_text) {
        return (
          <div className="mb-4">
            <RichTextRenderer richText={blockContent.rich_text} />
          </div>
        )
      }
      return null
  }
}

function RichTextRenderer({ richText }: { richText: any[] }) {
  if (!richText || richText.length === 0) {
    return null
  }

  return (
    <>
      {richText.map((text: any, index: number) => {
        let content = text.plain_text || ""

        if (text.annotations) {
          if (text.annotations.bold) {
            content = <strong key={index}>{content}</strong>
          }
          if (text.annotations.italic) {
            content = <em key={index}>{content}</em>
          }
          if (text.annotations.strikethrough) {
            content = <del key={index}>{content}</del>
          }
          if (text.annotations.underline) {
            content = <u key={index}>{content}</u>
          }
          if (text.annotations.code) {
            content = (
              <code key={index} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                {content}
              </code>
            )
          }
        }

        if (text.href) {
          content = (
            <a
              key={index}
              href={text.href}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          )
        }

        return content
      })}
    </>
  )
}
