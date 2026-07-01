/**
 * @file src/app/api/parcels/[tracking_number]/status/route.ts
 * @description PATCH /api/parcels/[tracking_number]/status — Update parcel status (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { updateParcelStatus }        from '@/services/parcel.service'
import { logger }                    from '@/lib/logger'
import { buildApiError,
         isValidTrackingNumber }     from '@/lib/utils'
import { API_KEY_HEADER }            from '@/lib/constants'
import { ParcelStatus }              from '@/types'

// ── INPUT VALIDATION SCHEMA ────────────────────────────────────────────────────

const UpdateStatusSchema = z.object({
  status:    z.nativeEnum(ParcelStatus),
  location:  z.string().min(2, 'Location must be at least 2 characters').max(200),
  timestamp: z.string().datetime().optional(),
})

// ── ROUTE HANDLER ──────────────────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tracking_number: string } }
) {
  try {
    // 1. Check admin API key
    const apiKey = request.headers.get(API_KEY_HEADER)
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        buildApiError('UNAUTHORIZED', 'Invalid or missing API key', 401),
        { status: 401 }
      )
    }

    // 2. Validate tracking number format
    const { tracking_number } = params
    if (!isValidTrackingNumber(tracking_number)) {
      return NextResponse.json(
        buildApiError('INVALID_TRACKING_NUMBER', 'Invalid tracking number format', 400),
        { status: 400 }
      )
    }

    // 3. Parse and validate request body
    const body   = await request.json()
    const parsed = UpdateStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        buildApiError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Invalid input', 400),
        { status: 400 }
      )
    }

    // 4. Update the status
    const result = await updateParcelStatus(tracking_number, parsed.data)

    // Check if service returned an error
    if ('error' in result) {
      const statusCode = result.error === 'NOT_FOUND' ? 404 : 400
      return NextResponse.json(
        buildApiError(result.error, result.message, statusCode),
        { status: statusCode }
      )
    }

    return NextResponse.json(result, { status: 200 })

  } catch (err) {
    logger.error('Failed to update parcel status', { err })
    return NextResponse.json(
      buildApiError('INTERNAL_ERROR', 'Something went wrong', 500),
      { status: 500 }
    )
  }
}