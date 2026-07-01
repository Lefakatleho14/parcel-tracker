/**
 * @file src/services/tracking.service.ts
 * @description Business logic for tracking parcel movements.
 *
 * DESIGN DECISION: Separated from parcel.service.ts because tracking
 * (read-only, public) has different concerns from parcel management
 * (write, admin-only). Keeping them separate makes each file smaller
 * and easier to reason about.
 */

import { prisma }  from '@/lib/prisma'
import { logger }  from '@/lib/logger'

// ── GET PARCEL WITH FULL TRACKING HISTORY ─────────────────────────────────────

export async function getParcelWithEvents(tracking_number: string) {
  const parcel = await prisma.parcel.findUnique({
    where:   { tracking_number },
    include: {
      events: {
        // Most recent event first
        orderBy: { timestamp: 'desc' },
      },
    },
  })

  if (!parcel) {
    logger.warn('Parcel not found', { tracking_number })
    return null
  }

  logger.info('Parcel tracked', { tracking_number, status: parcel.status })

  return parcel
}