// This file adds test jobs to your database
// Run it once to see how your homepage looks with real data

import * as dotenv from "dotenv"
dotenv.config() // Load .env file first before anything else

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../app/generated/prisma"

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL,
})

const db = new PrismaClient({ adapter })

async function main() {
  console.log("Starting to seed database...")
  console.log("Database URL found:", !!process.env.DIRECT_URL)

  // First create a test source website
  const source = await db.source.upsert({
    where: { url: "https://example-jobs.co.tz" },
    update: {},
    create: {
      name: "Example Jobs TZ",
      url: "https://example-jobs.co.tz",
      isActive: true,
      crawlInterval: 30,
    }
  })

  console.log("Created source:", source.name)

  // Create test jobs
  const testJobs = [
    {
      title: "Software Engineer — Full Stack",
      company: "Vodacom Tanzania",
      location: "Dar es Salaam",
      description: "We are looking for a skilled Full Stack Software Engineer to join our growing technology team. You will work on building and maintaining web applications that serve millions of Tanzanians.",
      salary: "TZS 3,000,000 — 5,000,000",
      jobType: "Full time",
      category: "Technology",
      applicationUrl: "https://example.com/apply/1",
      sourceUrl: "https://example-jobs.co.tz/job/1",
      slug: "software-engineer-full-stack-vodacom-tanzania",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
      sourceId: source.id,
    },
    {
      title: "Finance Officer",
      company: "CRDB Bank",
      location: "Arusha",
      description: "CRDB Bank is seeking a qualified Finance Officer to support our financial operations in the Arusha region. The ideal candidate has a degree in Finance or Accounting.",
      salary: "TZS 2,000,000 — 3,000,000",
      jobType: "Full time",
      category: "Finance",
      applicationUrl: "https://example.com/apply/2",
      sourceUrl: "https://example-jobs.co.tz/job/2",
      slug: "finance-officer-crdb-bank-arusha",
      status: "PUBLISHED" as const,
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      sourceId: source.id,
    },
    {
      title: "Programme Officer — Food Security",
      company: "WFP Tanzania",
      location: "Dodoma",
      description: "The World Food Programme is recruiting a Programme Officer to lead food security initiatives in the Dodoma region. Experience in humanitarian work required.",
      salary: null,
      jobType: "Contract",
      category: "NGO",
      applicationUrl: "https://example.com/apply/3",
      sourceUrl: "https://example-jobs.co.tz/job/3",
      slug: "programme-officer-food-security-wfp-tanzania",
      status: "PUBLISHED" as const,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      sourceId: source.id,
    },
    {
      title: "Sales Representative",
      company: "Azam Media",
      location: "Mwanza",
      description: "Azam Media is looking for an energetic Sales Representative to grow our subscriber base in Mwanza. You will be responsible for meeting sales targets and building customer relationships.",
      salary: "TZS 1,200,000 + Commission",
      jobType: "Full time",
      category: "Sales",
      applicationUrl: "https://example.com/apply/4",
      sourceUrl: "https://example-jobs.co.tz/job/4",
      slug: "sales-representative-azam-media-mwanza",
      status: "PUBLISHED" as const,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      sourceId: source.id,
    },
    {
      title: "Human Resources Manager",
      company: "Tanzania Breweries",
      location: "Dar es Salaam",
      description: "Tanzania Breweries Limited is seeking an experienced HR Manager to oversee all human resources operations. The role involves recruitment, training and employee relations.",
      salary: "TZS 4,000,000 — 6,000,000",
      jobType: "Full time",
      category: "Human Resources",
      applicationUrl: "https://example.com/apply/5",
      sourceUrl: "https://example-jobs.co.tz/job/5",
      slug: "human-resources-manager-tanzania-breweries",
      status: "PUBLISHED" as const,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      sourceId: source.id,
    },
    {
      title: "Clinical Officer",
      company: "Aga Khan Hospital",
      location: "Dar es Salaam",
      description: "Aga Khan Hospital Dar es Salaam is recruiting a Clinical Officer to join our medical team. The successful candidate will provide quality healthcare services to our patients.",
      salary: null,
      jobType: "Full time",
      category: "Healthcare",
      applicationUrl: "https://example.com/apply/6",
      sourceUrl: "https://example-jobs.co.tz/job/6",
      slug: "clinical-officer-aga-khan-hospital-dar-es-salaam",
      status: "PUBLISHED" as const,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      sourceId: source.id,
    },
  ]

  // Add each job to the database
  for (const job of testJobs) {
    await db.job.upsert({
      where: { slug: job.slug },
      update: {},
      create: job,
    })
    console.log("Created job:", job.title)
  }

  console.log("Seeding complete! Added", testJobs.length, "jobs.")
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })