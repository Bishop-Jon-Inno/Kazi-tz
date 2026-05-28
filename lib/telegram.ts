// Telegram notification system
// Sends messages to your Telegram when important events happen

const TELEGRAM_API = "https://api.telegram.org"

export async function sendTelegramMessage(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.log("Telegram not configured, skipping notification")
    return
  }

  try {
    const response = await fetch(
      `${TELEGRAM_API}/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        })
      }
    )

    const data = await response.json()

    if (!data.ok) {
      console.error("Telegram error:", data.description)
    } else {
      console.log("Telegram notification sent successfully")
    }

  } catch (error) {
    console.error("Failed to send Telegram notification:", error)
  }
}

// Notification for when a new draft job is created
export async function notifyNewDraft(job: {
  title: string
  company: string
  location: string
  slug: string
  sourceName: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const message = `
<b>New job draft ready for review</b>

<b>Title:</b> ${job.title}
<b>Company:</b> ${job.company}
<b>Location:</b> ${job.location}
<b>Source:</b> ${job.sourceName}

<a href="${appUrl}/admin/review/${job.slug}">Review this job</a>
  `.trim()

  await sendTelegramMessage(message)
}

// Notification for when a scraper fails
export async function notifyScraperError(sourceName: string, error: string) {
  const message = `
<b>Scraper error</b>

<b>Source:</b> ${sourceName}
<b>Error:</b> ${error.slice(0, 200)}

Please check your admin dashboard.
  `.trim()

  await sendTelegramMessage(message)
}

// Notification for when a crawl completes
export async function notifyCrawlComplete(results: {
  sourceName: string
  jobsFound: number
  jobsAdded: number
  duplicates: number
}) {
  if (results.jobsAdded === 0) return

  const message = `
<b>Crawl complete</b>

<b>Source:</b> ${results.sourceName}
<b>Jobs found:</b> ${results.jobsFound}
<b>New jobs added:</b> ${results.jobsAdded}
<b>Duplicates skipped:</b> ${results.duplicates}
  `.trim()

  await sendTelegramMessage(message)
}