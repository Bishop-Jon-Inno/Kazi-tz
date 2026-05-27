// JobCard component
// Displays a single job as a clickable card
// Used on the homepage and search results page

import Link from "next/link"

// This defines what information a JobCard needs to display
// Think of it as a checklist of required information
type JobCardProps = {
  id: string
  title: string
  company: string
  location: string
  jobType: string | null
  category: string | null
  slug: string
  publishedAt: Date | null
  salary: string | null
}

// This function calculates how long ago a job was posted
// Example: "2 hours ago" or "3 days ago"
function timeAgo(date: Date | null): string {
  if (!date) return "Recently"
  
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return "Just now"
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`
  return new Date(date).toLocaleDateString("en-TZ", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
}

export default function JobCard({
  title,
  company,
  location,
  jobType,
  category,
  slug,
  publishedAt,
  salary,
}: JobCardProps) {
  return (
    <Link href={`/jobs/${slug}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-sm transition-all cursor-pointer">
        
        {/* Job title and company */}
        <div className="mb-3">
          <h2 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500">
            {company} · {timeAgo(publishedAt)}
          </p>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2">
          
          {/* Location tag */}
          <span className="text-xs bg-green-50 text-green-800 px-3 py-1 rounded-full">
            {location}
          </span>

          {/* Job type tag — only shows if we have this info */}
          {jobType && (
            <span className="text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
              {jobType}
            </span>
          )}

          {/* Category tag — only shows if we have this info */}
          {category && (
            <span className="text-xs bg-purple-50 text-purple-800 px-3 py-1 rounded-full">
              {category}
            </span>
          )}

          {/* Salary tag — only shows if we have this info */}
          {salary && (
            <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full">
              {salary}
            </span>
          )}

        </div>

      </div>
    </Link>
  )
}