// This file contains all functions that fetch job data from the database
// Think of these as your waiters that go to the kitchen and bring back food
// We keep all database queries in one place so they are easy to find and update

import { db } from "./db"

// Fetch the latest published jobs for the homepage
// Only published jobs appear publicly — drafts and rejected jobs stay hidden
export async function getPublishedJobs(limit: number = 10) {
  const jobs = await db.job.findMany({
    where: {
      status: "PUBLISHED"
    },
    orderBy: {
      publishedAt: "desc"
    },
    take: limit,
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      jobType: true,
      category: true,
      slug: true,
      publishedAt: true,
      salary: true,
    }
  })
  return jobs
}

// Fetch one single job by its slug for the job detail page
// Slug example: "software-engineer-vodacom-dar-es-salaam"
export async function getJobBySlug(slug: string) {
  const job = await db.job.findUnique({
    where: { slug },
    include: {
      source: {
        select: {
          name: true,
          url: true,
        }
      }
    }
  })
  return job
}