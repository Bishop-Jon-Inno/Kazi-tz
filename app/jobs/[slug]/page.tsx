import { notFound } from "next/navigation"
import Link from "next/link"
import { getJobBySlug, getPublishedJobs } from "../../../lib/jobs"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) { return { title: "Job not found - KaziTZ" } }
  return {
    title: job.title + " at " + job.company,
    description: job.aiSummary || job.description.slice(0, 160),
    openGraph: {
      title: job.title + " at " + job.company + " - KaziTZ",
      description: job.aiSummary || job.description.slice(0, 160),
      type: "website",
    }
  }
}

export async function generateStaticParams() {
  const jobs = await getPublishedJobs(100)
  return jobs.map((job) => ({ slug: job.slug }))
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  if (!job) { notFound() }

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.publishedAt?.toISOString() || job.createdAt.toISOString(),
    "validThrough": job.expiresAt?.toISOString(),
    "employmentType": job.jobType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": "TZ"
      }
    },
    "baseSalary": job.salary ? {
      "@type": "MonetaryAmount",
      "currency": "TZS",
      "value": job.salary
    } : undefined,
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/" className="text-sm text-green-700 hover:text-green-800 mb-6 inline-block">
        Back to jobs
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <p className="text-lg text-gray-600">{job.company}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Location</p>
            <p className="text-sm font-medium text-gray-700">{job.location}</p>
          </div>
          {job.jobType && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Job type</p>
              <p className="text-sm font-medium text-gray-700">{job.jobType}</p>
            </div>
          )}
          {job.salary && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Salary</p>
              <p className="text-sm font-medium text-gray-700">{job.salary}</p>
            </div>
          )}
          {job.category && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Category</p>
              <p className="text-sm font-medium text-gray-700">{job.category}</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors">
            Apply for this job
          </a>
          <p className="text-xs text-gray-400 mt-2">You will be taken to the employer website to apply</p>
        </div>
      </div>

      {job.aiSummary && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-green-800 mb-2">Quick summary</h2>
          <p className="text-sm text-green-700 leading-relaxed">{job.aiSummary}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job description</h2>
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</div>
      </div>

      <div className="text-center text-xs text-gray-400 mb-8">
        Originally posted on
        <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="text-green-600 hover:underline ml-1">
          {job.source?.name || "external source"}
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-4 text-sm">Interested in this position?</p>
        <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer"
          className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors">
          Apply now
        </a>
      </div>
    </main>
  )
}
