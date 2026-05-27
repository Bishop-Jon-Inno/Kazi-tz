// Scheduler — runs all scrapers every 30 minutes automatically
// This file is called by a Next.js API route that Vercel triggers on a schedule

import { scrapeTanzajob } from "./scrapers/tanzajob"
import { db } from "./db"

export async function runAllScrapers() {
  console.log("Starting scheduled scrape at", new Date().toISOString())

  const results = {
    tanzajob: null as any,
    errors: [] as string[],
  }

  // Run Tanzajob scraper
  try {
    console.log("Running Tanzajob scraper...")
    results.tanzajob = await scrapeTanzajob()
  } catch (error) {
    console.error("Tanzajob scraper failed:", error)
    results.errors.push("Tanzajob: " + String(error))
  }

  // Update last crawled timestamp for all active sources
  await db.source.updateMany({
    where: { isActive: true },
    data: { lastCrawledAt: new Date() }
  })

  console.log("Scheduled scrape complete:", results)
  return results
}