import { db } from "../../../lib/db"
import Link from "next/link"

export default async function DraftsPage() {
  const drafts = await db.job.findMany({
    where: { status: "DRAFT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, company: true,
      location: true, category: true, createdAt: true, slug: true,
      source: { select: { name: true } }
    }
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Draft queue</h1>
          <p className="text-sm text-gray-500 mt-1">{drafts.length} jobs waiting for review</p>
        </div>
      </div>
      {drafts.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {drafts.map((job) => (
            <div key={job.id} className="p-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{job.title}</p>
                <p className="text-sm text-gray-500 mt-1">{job.company} · {job.location}</p>
                <p className="text-xs text-gray-400 mt-1">Source: {job.source?.name || "Unknown"}</p>
              </div>
              <Link href={"/admin/review/" + job.slug}
                className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">
                Review
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <p className="text-gray-400 text-lg mb-2">No drafts waiting</p>
          <p className="text-gray-400 text-sm">New jobs from the scraper will appear here</p>
        </div>
      )}
    </div>
  )
}
