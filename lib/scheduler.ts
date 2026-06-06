import { scrapeTanzajob } from "./scrapers/tanzajob"
import { scrapeMabumbe } from "./scrapers/mabumbe"
import { db } from "./db"

export async function runAllScrapers() {
  console.log("Starting scheduled scrape at", new Date().toISOString())

  const results = {
    tanzajob: null as any,
    mabumbe: null as any,
    errors: [] as string[],
  }

  try {
    console.log("Running Tanzajob scraper...")
    results.tanzajob = await scrapeTanzajob()
  } catch (error) {
    console.error("Tanzajob scraper failed:", error)
    results.errors.push("Tanzajob: " + String(error))
  }

  try {
    console.log("Running Mabumbe scraper...")
    results.mabumbe = await scrapeMabumbe()
  } catch (error) {
    console.error("Mabumbe scraper failed:", error)
    results.errors.push("Mabumbe: " + String(error))
  }

  await db.source.updateMany({
    where: { isActive: true },
    data: { lastCrawledAt: new Date() }
  })

  console.log("Scheduled scrape complete:", results)
  return results
}