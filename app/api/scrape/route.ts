// This API route triggers all scrapers
// Protected by a secret key so only authorized requests can run it
// Vercel cron jobs will call this URL every 30 minutes

import { NextRequest, NextResponse } from "next/server"
import { runAllScrapers } from "../../../lib/scheduler"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const results = await runAllScrapers()
    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}