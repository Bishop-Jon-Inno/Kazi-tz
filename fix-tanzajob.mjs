import { writeFileSync } from "fs"

const content = `import { chromium } from "playwright"
import { jobExists, saveJobDraft, logCrawl, getSource } from "./scraper-utils"
import { notifyNewDraft, notifyScraperError, notifyCrawlComplete } from "../telegram"

export async function scrapeTanzajob() {
  const startedAt = new Date()
  let jobsFound = 0
  let jobsAdded = 0
  let duplicates = 0
  let errorMessage: string | undefined

  const source = await getSource("Tanzajob")
  if (!source) {
    console.error("Tanzajob source not found in database")
    return
  }

  let browser
  try {
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    await page.setExtraHTTPHeaders({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    })

    console.log("Scraping Tanzajob...")

    await page.goto("https://www.tanzajob.com/job-vacancies-tanzania", {
      waitUntil: "networkidle",
      timeout: 30000
    })

    const jobCards = await page.evaluate(() => {
      const cards: { url: string; title: string; company: string }[] = []
      document.querySelectorAll("div.card.card-job").forEach(card => {
        const url = card.getAttribute("data-href") || ""
        const title = card.querySelector("h3")?.textContent?.trim() || ""
        const company = card.querySelector("a.company-name")?.textContent?.trim() || ""
        if (url && title) {
          cards.push({ url, title, company })
        }
      })
      return cards
    })

    console.log("Found " + jobCards.length + " job cards")
    jobsFound = jobCards.length

    for (const card of jobCards) {
      try {
        const exists = await jobExists(card.url)
        if (exists) {
          duplicates++
          continue
        }

        await page.goto(card.url, {
          waitUntil: "networkidle",
          timeout: 20000
        })

        const jobData = await page.evaluate(() => {
          const jsonLdScript = document.querySelector("script[type='application/ld+json']")
          if (jsonLdScript) {
            try {
              const data = JSON.parse(jsonLdScript.textContent || "")
              if (data["@type"] === "JobPosting") {
                const div = document.createElement("div")
                div.innerHTML = data.description || ""
                const cleanDescription = div.textContent || div.innerText || ""
                return {
                  title: data.title || "",
                  description: cleanDescription.trim(),
                  location: data.jobLocation?.address?.addressLocality || "Tanzania",
                  jobType: data.employmentType || null,
                  salary: null,
                  company: data.hiringOrganization?.name || "",
                }
              }
            } catch {
              // fall through
            }
          }

          const getText = (selector: string) =>
            document.querySelector(selector)?.textContent?.trim() || ""

          const title = getText("h1.text-center") || getText("h1")
          const description = getText("div.job-description") + " " + getText("div.job-qualifications")
          const location = document.querySelector("li.withicon.location-dot span")?.textContent?.trim() || "Tanzania"
          const jobType = document.querySelector("li.withicon.file-signature span")?.textContent?.trim() || null

          return { title, description, location, jobType, salary: null, company: "" }
        })

        if (!jobData.title || !jobData.description) {
          continue
        }

        const company = jobData.company || card.company || "Unknown"

        const savedJob = await saveJobDraft({
          title: jobData.title,
          company,
          location: jobData.location,
          description: jobData.description.slice(0, 5000),
          jobType: jobData.jobType,
          salary: jobData.salary,
          applicationUrl: card.url,
          sourceUrl: card.url,
          sourceId: source.id,
          category: "Other",
        })

        jobsAdded++
        console.log("Added: " + jobData.title)

        await notifyNewDraft({
          title: jobData.title,
          company,
          location: jobData.location,
          slug: savedJob.slug,
          sourceName: "Tanzajob",
        })

        await page.waitForTimeout(2000)

      } catch (jobError) {
        console.error("Error scraping " + card.url + ":", jobError)
      }
    }

  } catch (error) {
    errorMessage = String(error)
    console.error("Tanzajob scraper error:", error)
    await notifyScraperError("Tanzajob", String(error))
  } finally {
    if (browser) await browser.close()
  }

  await notifyCrawlComplete({
    sourceName: "Tanzajob",
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

  console.log("Tanzajob done: " + jobsAdded + " new, " + duplicates + " duplicates")
  return { jobsFound, jobsAdded, duplicates }
}
`

writeFileSync("lib/scrapers/tanzajob.ts", content)
console.log("tanzajob.ts rewritten successfully")