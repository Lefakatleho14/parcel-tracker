/**
 * @file src/app/api/parcels/route.ts
 * @description POST /api/parcels — Create a new parcel (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createParcel }              from '@/services/parcel.service'
import { logger }                    from '@/lib/logger'
import { buildApiError }             from '@/lib/utils'
import { API_KEY_HEADER }            from '@/lib/constants'

// ── INPUT VALIDATION SCHEMA ────────────────────────────────────────────────────

const CreateParcelSchema = z.object({
  sender_name:   z.string().min(2, 'Sender name must be at least 2 characters').max(100),
  receiver_name: z.string().min(2, 'Receiver name must be at least 2 characters').max(100),
})

// ── ROUTE HANDLER ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // 1. Check admin API key
    const apiKey = request.headers.get(API_KEY_HEADER)
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        buildApiError('UNAUTHORIZED', 'Invalid or missing API key', 401),
        { status: 401 }
      )
    }

    // 2. Parse and validate request body
    const body   = await request.json()
    const parsed = CreateParcelSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        buildApiError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Invalid input', 400),
        { status: 400 }
      )
    }

    // 3. Create the parcel
    const parcel = await createParcel(parsed.data)

    return NextResponse.json(parcel, { status: 201 })

  } catch (err) {
    logger.error('Failed to create parcel', { err })
    return NextResponse.json(
      buildApiError('INTERNAL_ERROR', 'Something went wrong', 500),
      { status: 500 }
    )
  }
}