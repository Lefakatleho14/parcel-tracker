/**
 * @file src/components/admin/ParcelTable.tsx
 * @description Table displaying all parcels.
 */

'use client'

import { Parcel }     from '@/types'
import { Badge }      from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface ParcelTableProps {
  parcels:    Parcel[]
  isLoading:  boolean
}

export function ParcelTable({ parcels, isLoading }: ParcelTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading parcels...
      </div>
    )
  }

  if (parcels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <span className="text-4xl mb-3">📭</span>
        <p className="text-sm">No parcels found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Tracking Number</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Sender</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Receiver</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Created</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel) => (
            <tr
              key={parcel.tracking_number}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4 font-mono text-blue-600 font-medium">
                {parcel.tracking_number}
              </td>
              <td className="py-3 px-4 text-gray-700">{parcel.sender_name}</td>
              <td className="py-3 px-4 text-gray-700">{parcel.receiver_name}</td>
              <td className="py-3 px-4">
                <Badge status={parcel.status} />
              </td>
              <td className="py-3 px-4 text-gray-500">
                {formatDate(parcel.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}