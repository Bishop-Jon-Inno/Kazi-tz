import { db } from "../../../../lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

type Props = { params: Promise<{ slug: string }> }

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params
  const job = await db.job.findUnique({
    where: { slug },
    include: { source: { select: { name: true } } }
  })
  if (!job) { notFound() }

  async function approveJob() {
    "use server"
    await db.job.update({ where: { slug }, data: { status: "PUBLISHED", publishedAt: new Date() } })
    redirect("/admin/drafts")
  }

  async function rejectJob() {
    "use server"
    await db.job.update({ where: { slug }, data: { status: "REJECTED" } })
    redirect("/admin/drafts")
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/drafts" className="text-sm text-green-700 hover:text-green-800">Back to drafts</Link>
        <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">Draft</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{job.company}</p>
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
          <div><p className="text-xs text-gray-400 mb-1">Location</p><p className="text-sm font-medium text-gray-700">{job.location}</p></div>
          <div><p className="text-xs text-gray-400 mb-1">Job type</p><p className="text-sm font-medium text-gray-700">{job.jobType || "Not specified"}</p></div>
          <div><p className="text-xs text-gray-400 mb-1">Category</p><p className="text-sm font-medium text-gray-700">{job.category || "Not specified"}</p></div>
          <div><p className="text-xs text-gray-400 mb-1">Salary</p><p className="text-sm font-medium text-gray-700">{job.salary || "Not specified"}</p></div>
          <div><p className="text-xs text-gray-400 mb-1">Source</p><p className="text-sm font-medium text-gray-700">{job.source?.name || "Manual"}</p></div>
          <div><p className="text-xs text-gray-400 mb-1">Application URL</p><a href={job.applicationUrl} target="_blank" className="text-sm text-green-600 hover:underline truncate block">{job.applicationUrl}</a></div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Job description</h2>
        <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{job.description}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-4">What would you like to do with this job?</p>
        <div className="flex gap-3">
          <form action={approveJob}>
            <button type="submit" className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors">
              Approve and publish
            </button>
          </form>
          <form action={rejectJob}>
            <button type="submit" className="bg-red-50 text-red-700 px-6 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors">
              Reject
            </button>
          </form>
          <Link href={"/admin/edit/" + job.slug} className="bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Edit first
          </Link>
        </div>
      </div>
    </div>
  )
}
