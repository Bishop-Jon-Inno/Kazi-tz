// Homepage
// This is the first page visitors see
// It shows the latest published jobs and a search bar

export const revalidate = 0

import JobCard from "../components/JobCard"
import { getPublishedJobs } from "../lib/jobs"

export default async function HomePage() {
  // Fetch the 12 most recent published jobs from the database
  const jobs = await getPublishedJobs(12)

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">

      {/* Hero section — the big welcome area at the top */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Find jobs in Tanzania and East Africa
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto">
          Updated every 30 minutes with the latest opportunities 
          from top employers across the region.
        </p>
      </div>

      {/* Search bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Job title, keyword or company..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
        />
        <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 focus:outline-none focus:border-green-400">
          <option value="">All locations</option>
          <option value="dar-es-salaam">Dar es Salaam</option>
          <option value="arusha">Arusha</option>
          <option value="dodoma">Dodoma</option>
          <option value="mwanza">Mwanza</option>
          <option value="nairobi">Nairobi</option>
          <option value="kampala">Kampala</option>
          <option value="remote">Remote</option>
        </select>
        <button className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
          Search
        </button>
      </div>

      {/* Jobs section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-gray-700">
          Latest jobs
          <span className="ml-2 text-sm font-normal text-gray-400">
            {jobs.length} showing
          </span>
        </h2>
      </div>

      {/* Job cards grid */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      ) : (
        // This shows when there are no published jobs yet
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">No jobs yet</p>
          <p className="text-sm">
            Jobs will appear here once the scraper finds and you approve them.
          </p>
        </div>
      )}

    </main>
  )
}