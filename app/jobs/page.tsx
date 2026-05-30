import { db } from "../../lib/db"
import JobCard from "../../components/JobCard"
import Link from "next/link"

export const revalidate = 0

export const metadata = {
  title: "Browse All Jobs in Tanzania and East Africa",
  description: "Browse thousands of job opportunities in Tanzania, Kenya, Uganda and East Africa. Updated every 30 minutes.",
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; category?: string; search?: string }>
}) {
  const params = await searchParams
  const { location, category, search } = params

  const jobs = await db.job.findMany({
    where: {
      status: "PUBLISHED",
      ...(location && {
        location: { contains: location, mode: "insensitive" }
      }),
      ...(category && {
        category: { contains: category, mode: "insensitive" }
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ]
      }),
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
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

  const categories = [
    "Technology", "Finance", "Healthcare", "NGO",
    "Sales", "Human Resources", "Education",
    "Engineering", "Other"
  ]

  const locations = [
    "Dar es Salaam", "Arusha", "Dodoma", "Mwanza",
    "Zanzibar", "Nairobi", "Kampala", "Remote"
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Browse all jobs
        </h1>
        <p className="text-gray-500 text-sm">
          {jobs.length} jobs found in Tanzania and East Africa
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <form className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Job title or keyword..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
          />
          <select
            name="location"
            defaultValue={location}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
          >
            <option value="">All locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            name="category"
            defaultValue={category}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
          >
            <option value="">All categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">No jobs found</p>
          <p className="text-sm mb-4">Try adjusting your search filters</p>
          <Link href="/jobs" className="text-green-700 hover:underline text-sm">
            Clear all filters
          </Link>
        </div>
      )}
    </main>
  )
}