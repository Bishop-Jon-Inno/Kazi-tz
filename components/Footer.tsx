// Footer component
// Appears at the bottom of every page
// Contains copyright info and useful links

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          
          {/* Brand section */}
          <div>
            <h3 className="font-bold text-green-700 text-lg mb-2">
              KaziTZ
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              The leading job platform for Tanzania and East Africa. 
              Find your next opportunity today.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3 text-sm">
              Quick links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/jobs" className="text-sm text-gray-500 hover:text-green-700">
                  Browse all jobs
                </a>
              </li>
              <li>
                <a href="/categories" className="text-sm text-gray-500 hover:text-green-700">
                  Job categories
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} KaziTZ. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}