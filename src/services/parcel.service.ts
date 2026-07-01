/**
 * @file src/services/parcel.service.ts
 * @description Business logic for parcel operations.
 *
 * DESIGN DECISION: We separate business logic from API route handlers.
 * Route handlers deal with HTTP (parsing requests, sending responses).
 * Services deal with data (database queries, validation, business rules).
 * This follows the Single Responsibility Principle (SOLID).
 */

import { prisma }                        from '@/lib/prisma'
import { logger }                        from '@/lib/logger'
import { generateTrackingNumber,
         sanitiseString, toTitleCase }   from '@/lib/utils'
import { VALID_STATUS_TRANSITIONS,
         DEFAULT_PAGE, DEFAULT_PAGE_SIZE,
         MAX_PAGE_SIZE }                 from '@/lib/constants'
import { ParcelStatus,
         CreateParcelRequest,
         UpdateStatusRequest }           from '@/types'

// ── CREATE PARCEL ──────────────────────────────────────────────────────────────

export async function createParcel(data: CreateParcelRequest) {
  const tracking_number = generateTrackingNumber()

  const parcel = await prisma.parcel.create({
    data: {
      tracking_number,
      sender_name:   toTitleCase(sanitiseString(data.sender_name)),
      receiver_name: toTitleCase(sanitiseString(data.receiver_name)),
      status:        ParcelStatus.PENDING,
      // Create the first tracking event automatically
      events: {
        create: {
          status:    ParcelStatus.PENDING,
          location:  'Sorting Facility',
          timestamp: new Date(),
        },
      },
    },
    include: { events: true },
  })

  logger.info('Parcel created', { tracking_number })

  return parcel
}

// ── UPDATE PARCEL STATUS ───────────────────────────────────────────────────────

export async function updateParcelStatus(
  tracking_number: string,
  data: UpdateStatusRequest
) {
  // 1. Fetch the current parcel
  const parcel = await prisma.parcel.findUnique({
    where: { tracking_number },
  })

  if (!parcel) {
    return { error: 'NOT_FOUND', message: 'Parcel not found' }
  }

  // 2. Enforce the status state machine
  const allowedTransitions = VALID_STATUS_TRANSITIONS[parcel.status]
  if (!allowedTransitions.includes(data.status)) {
    return {
      error:   'INVALID_TRANSITION',
      message: `Cannot transition from ${parcel.status} to ${data.status}`,
    }
  }

  // 3. Update parcel status and add a new tracking event atomically
  // We use a transaction so both writes succeed or both fail together
  const updated = await prisma.$transaction(async (tx) => {
    const updatedParcel = await tx.parcel.update({
      where: { tracking_number },
      data:  { status: data.status },
    })

    await tx.trackingEvent.create({
      data: {
        tracking_number,
        status:    data.status,
        location:  sanitiseString(data.location),
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      },
    })

    return updatedParcel
  })

  logger.info('Parcel status updated', {
    tracking_number,
    from: parcel.status,
    to:   data.status,
  })

  return updated
}

// ── LIST PARCELS (ADMIN) ───────────────────────────────────────────────────────

export async function listParcels(params: {
  status?: ParcelStatus
  page?:   number
  limit?:  number
}) {
  const page  = Math.max(1, params.page  ?? DEFAULT_PAGE)
  const limit = Math.min(params.limit ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
  const skip  = (page - 1) * limit

  // Build the filter — if no status provided, return all parcels
  const where = params.status ? { status: params.status } : {}

  // Run count and data queries in parallel for performance
  const [total, data] = await Promise.all([
    prisma.parcel.count({ where }),
    prisma.parcel.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
  ])

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}