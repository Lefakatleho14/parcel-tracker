/**
 * @file src/lib/prisma.ts
 * @description Prisma client singleton.
 *
 * DESIGN DECISION: We create ONE Prisma client instance and reuse it.
 * In Next.js development, the module cache is cleared on every hot reload,
 * which would create a new database connection every time you save a file.
 * After ~10 reloads you'd hit Neon's connection limit.
 *
 * The globalThis trick persists the client across hot reloads in development
 * while still creating a single instance in production.
 */

import { PrismaClient } from '@prisma/client'

// Extend the global type to include our prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      // In development: log all queries, errors and warnings to the console
      ? ['query', 'error', 'warn']
      // In production: only log errors
      : ['error'],
  })

// In development, save the client to globalThis so hot reloads reuse it
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}