// Prisma version 7 requires a database adapter
// We use the official PostgreSQL adapter to connect to Supabase

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../app/generated/prisma"

// This creates the PostgreSQL adapter using your database URL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

// This trick prevents too many connections during development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}