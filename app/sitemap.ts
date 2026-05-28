import { MetadataRoute } from "next"
import { db } from "../lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kazitz.com"

  // Get all published jobs
  const jobs = await db.job.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 1000,
  })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${appUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ]

  // Dynamic job pages
  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${appUrl}/jobs/${job.slug}`,
    lastModified: job.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...jobPages]
}