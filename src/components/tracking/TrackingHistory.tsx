/**
 * @file src/components/tracking/TrackingHistory.tsx
 * @description Timeline of all tracking events for a parcel.
 */

import { TrackingEvent } from '@/types'
import { STATUS_CONFIG } from '@/lib/constants'
import { formatDate }    from '@/lib/utils'

interface TrackingHistoryProps {
  events: TrackingEvent[]
}

export function TrackingHistory({ events }: TrackingHistoryProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No tracking events yet
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="flex flex-col gap-0">
        {events.map((event, index) => {
          const config    = STATUS_CONFIG[event.status]
          const isLast    = index === events.length - 1

          return (
            <li key={event.event_id} className="relative flex gap-4">

              {/* ── Timeline line ───────────────────────────── */}
              {!isLast && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-100" />
              )}

              {/* ── Timeline dot ────────────────────────────── */}
              <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${config.dotCss}`}>
                  <span className="text-white text-xs">{config.icon}</span>
                </div>
              </div>

              {/* ── Event details ───────────────────────────── */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {config.label}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      📍 {event.location}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(event.timestamp)}
                  </p>
                </div>
              </div>

            </li>
          )
        })}
      </ul>
    </div>
  )
}