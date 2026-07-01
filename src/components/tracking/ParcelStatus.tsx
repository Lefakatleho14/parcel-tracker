/**
 * @file src/components/tracking/ParcelStatus.tsx
 * @description Displays the current status of a parcel prominently.
 */

import { ParcelWithEvents } from '@/types'
import { STATUS_CONFIG }    from '@/lib/constants'
import { formatDate }       from '@/lib/utils'

interface ParcelStatusProps {
  parcel: ParcelWithEvents
}

export function ParcelStatusCard({ parcel }: ParcelStatusProps) {
  const config = STATUS_CONFIG[parcel.status]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* ── Status Banner ──────────────────────────────────── */}
      <div className={`px-6 py-5 ${config.badgeCss} border-b border-gray-200`}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{config.icon}</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">
              Current Status
            </p>
            <p className="text-xl font-bold">{config.label}</p>
            <p className="text-sm opacity-80 mt-0.5">{config.description}</p>
          </div>
        </div>
      </div>

      {/* ── Parcel Details ─────────────────────────────────── */}
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Tracking Number
          </p>
          <p className="font-mono font-semibold text-gray-900 text-sm">
            {parcel.tracking_number}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Sender
          </p>
          <p className="font-medium text-gray-900 text-sm">
            {parcel.sender_name}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Receiver
          </p>
          <p className="font-medium text-gray-900 text-sm">
            {parcel.receiver_name}
          </p>
        </div>
      </div>

      {/* ── Created Date ───────────────────────────────────── */}
      <div className="px-6 pb-4">
        <p className="text-xs text-gray-400">
          Parcel registered on {formatDate(parcel.created_at)}
        </p>
      </div>

    </div>
  )
}