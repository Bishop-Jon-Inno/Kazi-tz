import { chromium } from "playwright"
import { jobExists, saveJobDraft, logCrawl, getSource } from "./scraper-utils"
import { notifyNewDraft, notifyScraperError, notifyCrawlComplete } from "../telegram"

export async function scrapeMabumbe() {
  const startedAt = new Date()
  let jobsFound = 0
  let jobsAdded = 0
  let duplicates = 0
  let errorMessage: string | undefined

  const source = await getSource("Mabumbe")
  if (!source) {
    console.error("Mabumbe source not found in database")
    return
  }

  let browser
  try {
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    await page.setExtraHTTPHeaders({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })

    console.log("Scraping Mabumbe...")

    await page.goto("https://mabumbe.com/jobs/", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    })

    await page.waitForTimeout(3000)

    const pageTitle = await page.title()
    console.log("Page title:", pageTitle)

    const jobCards = await page.evaluate(() => {
      const cards: { url: string; title: string; company: string; location: string; category: string; summary: string }[] = []

      document.querySelectorAll("div.mjma-job-card").forEach(card => {
        const titleEl = card.querySelector("h2 a")
        const url = titleEl ? (titleEl as HTMLAnchorElement).href : ""
        const title = titleEl ? titleEl.textContent?.trim() || "" : ""

        const metaSpans = card.querySelectorAll(".mjma-meta span")
        const company = metaSpans[0] ? metaSpans[0].textContent?.trim() || "" : ""
        const location = metaSpans[1] ? metaSpans[1].textContent?.trim() || "" : "Tanzania"

        const categoryEl = card.querySelector(".mjma-tax a")
        const category = categoryEl ? categoryEl.textContent?.trim() || "" : "Other"

        const summaryEl = card.querySelector("p.mjma-summary")
        const summary = summaryEl ? summaryEl.textContent?.trim() || "" : ""

        if (url && title) {
          cards.push({ url, title, company, location, category, summary })
        }
      })

      return cards
    })

    console.log("Found " + jobCards.length + " job cards")
    jobsFound = jobCards.length

    for (const card of jobCards) {
      try {
        const exists = await jobExists(card.url)
        if (exists) { duplicates++; continue }

        await page.goto(card.url, {
          waitUntil: "domcontentloaded",
          timeout: 60000
        })

        await page.waitForTimeout(2000)

        const jobData = await page.evaluate(() => {
          const getText = (selector: string) =>
            document.querySelector(selector)?.textContent?.trim() || ""

          const description = getText(".mjma-job-body") ||
            getText(".entry-content") ||
            getText("article") ||
            getText("main")

          return { description }
        })

        if (!jobData.description) { continue }

        const savedJob = await saveJobDraft({
          title: card.title,
          company: card.company || "Unknown",
          location: card.location,
          description: jobData.description.slice(0, 5000),
          jobType: null,
          salary: null,
          applicationUrl: card.url,
          sourceUrl: card.url,
          sourceId: source.id,
          category: card.category || "Other",
        })

        jobsAdded++
        console.log("Added: " + card.title)

        await notifyNewDraft({
          title: card.title,
          company: card.company || "Unknown",
          location: card.location,
          slug: savedJob.slug,
          sourceName: "Mabumbe",
        })

        await page.waitForTimeout(2000)

      } catch (jobError) {
        console.error("Error scraping " + card.url + ":", jobError)
      }
    }

  } catch (error) {
    errorMessage = String(error)
    console.error("Mabumbe scraper error:", error)
    await notifyScraperError("Mabumbe", String(error))
  } finally {
    if (browser) await browser.close()
  }

  await notifyCrawlComplete({
    sourceName: "Mabumbe",
    jobsFound,
    jobsAdded,
    duplicates,
  })

  await logCrawl({
    sourceId: source.id,
    status: errorMessage ? "error" : "success",
    jobsFound,
    jobsAdded,
    duplicates,
    errorMessage,
    startedAt,
  })

  console.log("Mabumbe done: " + jobsAdded + " new, " + duplicates + " duplicates")
  return { jobsFound, jobsAdded, duplicates }
}
