import { db } from "../../lib/db"
import Link from "next/link"

export default async function AdminDashboard() {
  const totalJobs = await db.job.count()
  const draftJobs = await db.job.count({ where: { status: "DRAFT" } })
  const publishedJobs = await db.job.count({ where: { status: "PUBLISHED" } })
  const rejectedJobs = await db.job.count({ where: { status: "REJECTED" } })

  const recentDrafts = await db.job.findMany({
    where: { status: "DRAFT" },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      createdAt: true,
      slug: true,
    }
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back. Here is what needs your attention.
          </p>
        </div>
        <Link
          href="/admin/new"
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
        >
          Add job manually
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">Total jobs</p>
          <p className="text-3xl font-bold text-gray-900">{totalJobs}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <p className="text-xs text-amber-600 mb-1">Pending drafts</p>
          <p className="text-3xl font-bold text-amber-700">{draftJobs}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-5">
          <p className="text-xs text-green-600 mb-1">Published</p>
          <p className="text-3xl font-bold text-green-700">{publishedJobs}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-5">
          <p className="text-xs text-red-600 mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-700">{rejectedJobs}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Recent drafts
          </h2>
          <Link
            href="/admin/drafts"
            className="text-sm text-green-700 hover:text-green-800"
          >
            View all drafts
          </Link>
        </div>

        {recentDrafts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentDrafts.map((job) => (
              <div
                key={job.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {job.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {job.company} · {job.location}
                  </p>
                </div>
                <Link
                  href={`/admin/review/${job.slug}`}
                  className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-100 transition-colors"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            No drafts waiting for review
          </p>
        )}
      </div>

    </div>
  )
}