import { auth } from "../../lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) { redirect("/admin/login") }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-green-700">KaziTZ Admin</span>
            <a href="/admin" className="text-sm text-gray-600 hover:text-green-700">Dashboard</a>
            <a href="/admin/drafts" className="text-sm text-gray-600 hover:text-green-700">Drafts</a>
            <a href="/admin/jobs" className="text-sm text-gray-600 hover:text-green-700">All jobs</a>
            <a href="/admin/sources" className="text-sm text-gray-600 hover:text-green-700">Sources</a>
            <a href="/admin/new" className="text-sm text-gray-600 hover:text-green-700">Add job</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-gray-500 hover:text-green-700" target="_blank">View site</a>
            <a href="/api/auth/signout" className="text-sm text-red-500 hover:text-red-700">Sign out</a>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
    </div>
  )
}
