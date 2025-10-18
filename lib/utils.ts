import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

export function extractHeadingsFromNotion(recordMapOrBlocks: any): Array<{id: string, text: string, level: number, slug: string}> {
  const headings: Array<{id: string, text: string, level: number, slug: string}> = []
  
  // Handle both recordMap format and array of blocks
  let blocks: any[] = []
  if (recordMapOrBlocks?.block) {
    // It's a recordMap, extract blocks
    blocks = Object.values(recordMapOrBlocks.block).map((b: any) => b.value)
  } else if (Array.isArray(recordMapOrBlocks)) {
    // It's already an array of blocks
    blocks = recordMapOrBlocks
  } else {
    return headings
  }
  
  blocks.forEach((block) => {
    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      const level = parseInt(block.type.split('_')[1])
      const text = block[block.type]?.rich_text?.[0]?.plain_text || ''
      if (text) {
        headings.push({
          id: block.id,
          text,
          level,
          slug: createSlug(text)
        })
      }
    }
  })
  
  return headings
}
