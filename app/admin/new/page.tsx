"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      salary: (form.elements.namedItem("salary") as HTMLInputElement).value,
      jobType: (form.elements.namedItem("jobType") as HTMLSelectElement).value,
      category: (form.elements.namedItem("category") as HTMLSelectElement).value,
      applicationUrl: (form.elements.namedItem("applicationUrl") as HTMLInputElement).value,
    }
    const res = await fetch("/api/jobs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    if (res.ok) {
      router.push("/admin/drafts")
    } else {
      setError("Failed to create job. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add job manually</h1>
        <p className="text-sm text-gray-500 mt-1">Job will be saved as a draft for your review</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Basic information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job title</label>
            <input name="title" type="text" required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
              placeholder="e.g. Software Engineer" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
            <input name="company" type="text" required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
              placeholder="e.g. Vodacom Tanzania" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input name="location" type="text" required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
              placeholder="e.g. Dar es Salaam" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job type</label>
              <select name="jobType"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400">
                <option value="Full time">Full time</option>
                <option value="Part time">Part time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400">
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="NGO">NGO</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Education">Education</option>
                <option value="Engineering">Engineering</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary (optional)</label>
            <input name="salary" type="text"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
              placeholder="e.g. TZS 2,000,000 - 3,000,000" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Job details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job description</label>
            <textarea name="description" required rows={8}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
              placeholder="Paste the full job description here..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application URL</label>
            <input name="applicationUrl" type="url" required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-400"
              placeholder="https://company.com/apply" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Save as draft"}
          </button>
          <a href="/admin"
            className="bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Cancel
          </a>
        </div>

      </form>
    </div>
  )
}