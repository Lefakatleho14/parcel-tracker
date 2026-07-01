/**
 * @file src/app/api/track/[tracking_number]/route.ts
 * @description GET /api/track/[tracking_number] — Public parcel tracking
 */

import { NextRequest, NextResponse }  from 'next/server'
import { getParcelWithEvents }        from '@/services/tracking.service'
import { logger }                     from '@/lib/logger'
import { buildApiError,
         isValidTrackingNumber }      from '@/lib/utils'

// ── ROUTE HANDLER ──────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: { tracking_number: string } }
) {
  try {
    // 1. Validate tracking number format
    const { tracking_number } = params
    if (!isValidTrackingNumber(tracking_number)) {
      return NextResponse.json(
        buildApiError('INVALID_TRACKING_NUMBER', 'Invalid tracking number format', 400),
        { status: 400 }
      )
    }

    // 2. Fetch parcel with events
    const parcel = await getParcelWithEvents(tracking_number)

    if (!parcel) {
      return NextResponse.json(
        buildApiError('NOT_FOUND', 'Parcel not found', 404),
        { status: 404 }
      )
    }

    return NextResponse.json(parcel, { status: 200 })

  } catch (err) {
    logger.error('Failed to track parcel', { err })
    return NextResponse.json(
      buildApiError('INTERNAL_ERROR', 'Something went wrong', 500),
      { status: 500 }
    )
  }
}