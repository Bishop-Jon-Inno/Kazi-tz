// This is a temporary test endpoint
// It checks if our app can talk to the database
// We will delete this file after testing

import { NextResponse } from "next/server"
import { db } from "../../../lib/db"

export async function GET() {
  try {
    // Count how many jobs are in the database
    // Should return 0 since we have no jobs yet
    const jobCount = await db.job.count()
    
    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      jobCount: jobCount
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: String(error)
    }, { status: 500 })
  }
}