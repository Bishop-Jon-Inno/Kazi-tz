import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../lib/db"
import { auth } from "../../../../lib/auth"

function generateSlug(title: string, company: string): string {
  const text = `${title} ${company}`
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
    + "-" + Date.now()
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, company, location, description, salary, jobType, category, applicationUrl } = body

  if (!title || !company || !location || !description || !applicationUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  let source = await db.source.findFirst({
    where: { name: "Manual" }
  })

  if (!source) {
    source = await db.source.create({
      data: {
        name: "Manual",
        url: "https://kazitz.com/manual",
        isActive: true,
        crawlInterval: 0,
      }
    })
  }

  const slug = generateSlug(title, company)

  const job = await db.job.create({
    data: {
      title,
      company,
      location,
      description,
      salary: salary || null,
      jobType: jobType || null,
      category: category || null,
      applicationUrl,
      sourceUrl: "manual",
      slug,
      status: "DRAFT",
      sourceId: source.id,
    }
  })

  return NextResponse.json({ success: true, job })
}