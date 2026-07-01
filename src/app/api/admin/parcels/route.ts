/**
 * @file src/app/api/admin/parcels/route.ts
 * @description GET /api/admin/parcels — List all parcels (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { listParcels }               from '@/services/parcel.service'
import { logger }                    from '@/lib/logger'
import { buildApiError,
         parsePositiveInt,
         isValidParcelStatus }       from '@/lib/utils'
import { API_KEY_HEADER }            from '@/lib/constants'
import { ParcelStatus }              from '@/types'

// ── ROUTE HANDLER ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // 1. Check admin API key
    const apiKey = request.headers.get(API_KEY_HEADER)
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        buildApiError('UNAUTHORIZED', 'Invalid or missing API key', 401),
        { status: 401 }
      )
    }

    // 2. Parse query params
    const { searchParams } = request.nextUrl
    const statusParam      = searchParams.get('status')
    const page             = parsePositiveInt(searchParams.get('page'), 1)
    const limit            = parsePositiveInt(searchParams.get('limit'), 20)

    // 3. Validate status filter if provided
    if (statusParam && !isValidParcelStatus(statusParam)) {
      return NextResponse.json(
        buildApiError('INVALID_STATUS', 'Invalid status filter', 400),
        { status: 400 }
      )
    }

    // 4. Fetch parcels
    const result = await listParcels({
      status: statusParam as ParcelStatus | undefined,
      page,
      limit,
    })

    return NextResponse.json(result, { status: 200 })

  } catch (err) {
    logger.error('Failed to list parcels', { err })
    return NextResponse.json(
      buildApiError('INTERNAL_ERROR', 'Something went wrong', 500),
      { status: 500 }
    )
  }
}