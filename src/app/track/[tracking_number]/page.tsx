/**
 * @file src/app/track/[tracking_number]/page.tsx
 * @description Public parcel tracking detail page with chart.
 */

import type { Metadata }        from 'next'
import { ParcelStatusCard }     from '@/components/tracking/ParcelStatus'
import { TrackingHistory }      from '@/components/tracking/TrackingHistory'
import { TrackingChart }        from '@/components/tracking/TrackingChart'
import { SearchForm }           from '@/components/tracking/SearchForm'
import { Card }                 from '@/components/ui/Card'
import { ParcelWithEvents }     from '@/types'

interface TrackingPageProps {
  params: { tracking_number: string }
}

export async function generateMetadata({ params }: TrackingPageProps): Promise<Metadata> {
  return {
    title: `Tracking ${params.tracking_number}`,
  }
}

async function getParcel(tracking_number: string): Promise<ParcelWithEvents | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/track/${tracking_number}`,
      { cache: 'no-store' }
    )
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { tracking_number } = params
  const parcel              = await getParcel(tracking_number)

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Header ────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-gray-900 font-semibold">
            <span>📦</span>
            <span>Parcel Tracker</span>
          </a>
          <a href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
            Admin
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* ── Search Form ───────────────────────────────────── */}
        <Card title="Track Another Parcel">
          <SearchForm />
        </Card>

        {/* ── Not Found ─────────────────────────────────────── */}
        {!parcel && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
            <span className="text-5xl">🔍</span>
            <h2 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
              Parcel Not Found
            </h2>
            <p className="text-gray-500 text-sm">
              No parcel found for tracking number{' '}
              <span className="font-mono font-medium text-gray-700">
                {tracking_number}
              </span>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Please check your tracking number and try again
            </p>
          </div>
        )}

        {/* ── Parcel Found ──────────────────────────────────── */}
        {parcel && (
          <>
            {/* Current status card */}
            <ParcelStatusCard parcel={parcel} />

            {/* Journey visualization chart */}
            <Card title="Delivery Journey">
              <TrackingChart
                events={parcel.events}
                currentStatus={parcel.status}
              />
            </Card>

            {/* Tracking history timeline */}
            <Card title="Tracking History">
              <TrackingHistory events={parcel.events} />
            </Card>
          </>
        )}

      </div>
    </main>
  )
}