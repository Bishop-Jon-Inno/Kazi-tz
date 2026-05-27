// This file contains shared utilities used by all scrapers
// Think of it as the toolkit every scraper uses

import { db } from "../db"

// This function creates a URL-friendly slug from a job title and company
// Example: "Software Engineer" + "Vodacom" = "software-engineer-vodacom-1234567890"
export function createSlug(title: string, company: string): string {
  const text = `${title} ${company}`
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .trim()
    .slice(0, 80)
    + "-" + Date.now()
}

// This function checks if a job already exists in the database
// We check by matching the source URL of the job
// This prevents the same job being added twice
export async function jobExists(sourceUrl: string): Promise<boolean> {
  const existing = await db.job.findFirst({
    where: { sourceUrl }
  })
  return !!existing
}

// This function saves a new job to the database as a DRAFT
// Every scraped job starts as a draft — you must approve it
export async function saveJobDraft(jobData: {
  title: string
  company: string
  location: string
  description: string
  salary?: string | null
  jobType?: string | null
  category?: string | null
  applicationUrl: string
  sourceUrl: string
  sourceId: string
}) {
  const slug = createSlug(jobData.title, jobData.company)

  const job = await db.job.create({
    data: {
      ...jobData,
      slug,
      status: "DRAFT",
    }
  })

  return job
}

// This function logs a completed crawl to the database
// You can see this history in your admin dashboard
export async function logCrawl(data: {
  sourceId: string
  status: string
  jobsFound: number
  jobsAdded: number
  duplicates: number
  errorMessage?: string
  startedAt: Date
}) {
  await db.crawlLog.create({
    data: {
      ...data,
      completedAt: new Date(),
    }
  })
}

// This function gets a source by its name from the database
// Each website we scrape has a record in the Source table
export async function getSource(name: string) {
  return await db.source.findFirst({
    where: { name }
  })
}