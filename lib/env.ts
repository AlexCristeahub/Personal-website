// Environment variable validation and defaults
export const env = {
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  NOTION_WEBHOOK_SECRET: process.env.NOTION_WEBHOOK_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const

// Validate required environment variables
export function validateEnv() {
  const required = ["NOTION_TOKEN", "NOTION_DATABASE_ID"] as const
  const missing = required.filter((key) => !env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

// Check if environment is properly configured
export function isEnvConfigured() {
  return !!(env.NOTION_TOKEN && env.NOTION_DATABASE_ID)
}
