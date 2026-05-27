// layout.tsx
// This is the outer shell of your entire website
// Header and Footer defined here appear on EVERY page automatically
// You never have to add them to individual pages

import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Header from "../components/Header"
import Footer from "../components/Footer"

const geist = Geist({
  subsets: ["latin"],
})

// Metadata appears in browser tabs and Google search results
export const metadata: Metadata = {
  title: "KaziTZ — Jobs in Tanzania and East Africa",
  description: "Find the latest job opportunities in Tanzania, Kenya, Uganda and across East Africa. Updated every 30 minutes.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        
        {/* Header appears at top of every page */}
        <Header />
        
        {/* children means whatever page the visitor is on */}
        {/* Homepage, job page, categories — all go here */}
        {children}
        
        {/* Footer appears at bottom of every page */}
        <Footer />

      </body>
    </html>
  )
}