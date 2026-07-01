/**
 * @file src/components/tracking/TrackingChart.tsx
 * @description Visual timeline chart showing parcel journey stages.
 *
 * 'use client' is required because Recharts uses browser APIs
 * and cannot run on the server.
 */

'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { ParcelStatus, TrackingEvent } from '@/types'
import { STATUS_CONFIG }               from '@/lib/constants'

interface TrackingChartProps {
  events:        TrackingEvent[]
  currentStatus: ParcelStatus
}

// The full delivery lifecycle in order
const LIFECYCLE: ParcelStatus[] = [
  ParcelStatus.PENDING,
  ParcelStatus.PICKED_UP,
  ParcelStatus.IN_TRANSIT,
  ParcelStatus.OUT_FOR_DELIVERY,
  ParcelStatus.DELIVERED,
]

// Colour for each bar state
const COLORS = {
  completed: '#22c55e',   // green-500
  current:   '#3b82f6',   // blue-500
  pending:   '#e5e7eb',   // gray-200
  exception: '#ef4444',   // red-500
  returned:  '#a855f7',   // purple-500
}

interface ChartDataPoint {
  name:    string
  value:   number
  color:   string
  status:  ParcelStatus
}

function buildChartData(
  events:        TrackingEvent[],
  currentStatus: ParcelStatus
): ChartDataPoint[] {
  const isException = currentStatus === ParcelStatus.EXCEPTION
  const isReturned  = currentStatus === ParcelStatus.RETURNED

  // Find the index of the current status in the lifecycle
  const currentIndex = LIFECYCLE.indexOf(currentStatus)

  return LIFECYCLE.map((status, index) => {
    const config = STATUS_CONFIG[status]

    // Determine bar color based on position in lifecycle
    let color: string
    let value: number

    if (isException) {
      // All bars grey except current which is red
      color = status === currentStatus ? COLORS.exception : COLORS.pending
      value = status === currentStatus ? 100 : 30
    } else if (isReturned) {
      color = status === currentStatus ? COLORS.returned : COLORS.pending
      value = status === currentStatus ? 100 : 30
    } else if (index < currentIndex) {
      // Completed stages
      color = COLORS.completed
      value = 100
    } else if (index === currentIndex) {
      // Current stage
      color = COLORS.current
      value = 100
    } else {
      // Future stages
      color = COLORS.pending
      value = 30
    }

    return {
      name:   config.icon + ' ' + config.label,
      value,
      color,
      status,
    }
  })
}

// Custom tooltip shown on hover
function CustomTooltip({
  active,
  payload,
}: {
  active?:  boolean
  payload?: Array<{ payload: ChartDataPoint }>
}) {
  if (!active || !payload || payload.length === 0) return null

  const point  = payload[0]?.payload
  if (!point) return null
  const config = STATUS_CONFIG[point.status]

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-900">{config.label}</p>
      <p className="text-gray-500 mt-0.5">{config.description}</p>
    </div>
  )
}

export function TrackingChart({ events, currentStatus }: TrackingChartProps) {
  const data = buildChartData(events, currentStatus)

  return (
    <div className="flex flex-col gap-3">

      {/* ── Legend ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
          Upcoming
        </span>
      </div>

      {/* ── Chart ───────────────────────────────────────────── */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 60 }}
          barCategoryGap="20%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3f4f6"
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            angle={-35}
            textAnchor="end"
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* ── Event count ─────────────────────────────────────── */}
      <p className="text-xs text-gray-400 text-center">
        {events.length} tracking event{events.length !== 1 ? 's' : ''} recorded
      </p>

    </div>
  )
}