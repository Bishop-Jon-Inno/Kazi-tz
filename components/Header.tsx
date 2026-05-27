// Header component
// This navigation bar appears at the top of every page
// It contains your logo and navigation links

import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo — clicking this takes you to the homepage */}
        <Link href="/" className="text-xl font-bold text-green-700">
          KaziTZ
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/jobs" 
            className="text-sm text-gray-600 hover:text-green-700 transition-colors"
          >
            Browse jobs
          </Link>
          <Link 
            href="/categories" 
            className="text-sm text-gray-600 hover:text-green-700 transition-colors"
          >
            Categories
          </Link>
        </nav>

      </div>
    </header>
  )
}