import { db } from "../../lib/db"
import Link from "next/link"

export const metadata = {
  title: "Job Categories in Tanzania and East Africa",
  description: "Browse jobs by category in Tanzania and East Africa.",
}

export default async function CategoriesPage() {
  const categories = await db.job.groupBy({
    by: ["category"],
    where: { status: "PUBLISHED" },
    _count: { category: true },
    orderBy: { _count: { category: "desc" } },
  })

  const categoryIcons: Record<string, string> = {
    "Technology": "💻",
    "Finance": "💰",
    "Healthcare": "🏥",
    "NGO": "🌍",
    "Sales": "📊",
    "Human Resources": "👥",
    "Education": "📚",
    "Engineering": "⚙️",
    "Other": "📋",
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Job categories
        </h1>
        <p className="text-gray-500 text-sm">
          Browse jobs by category across Tanzania and East Africa
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          cat.category && (
            <Link
              key={cat.category}
              href={`/jobs?category=${encodeURIComponent(cat.category)}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-sm transition-all"
            >
              <div className="text-2xl mb-2">
                {categoryIcons[cat.category] || "📋"}
              </div>
              <h2 className="font-semibold text-gray-900 mb-1">
                {cat.category}
              </h2>
              <p className="text-sm text-gray-500">
                {cat._count.category} jobs
              </p>
            </Link>
          )
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p>No categories found yet.</p>
          <p className="text-sm mt-2">Jobs will appear here once published.</p>
        </div>
      )}
    </main>
  )
}