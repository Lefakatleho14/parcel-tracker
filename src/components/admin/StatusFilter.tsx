/**
 * @file src/components/admin/StatusFilter.tsx
 * @description Filter parcels by status.
 */

'use client'

import { ParcelStatus }  from '@/types'
import { STATUS_CONFIG } from '@/lib/constants'

interface StatusFilterProps {
  selected:  ParcelStatus | 'ALL'
  onChange:  (status: ParcelStatus | 'ALL') => void
}

export function StatusFilter({ selected, onChange }: StatusFilterProps) {
  const options: Array<{ value: ParcelStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: '📋 All Parcels' },
    ...Object.values(ParcelStatus).map((status) => ({
      value: status,
      label: `${STATUS_CONFIG[status].icon} ${STATUS_CONFIG[status].label}`,
    })),
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-3 py-1.5 rounded-full text-xs font-medium transition-colors
            ${selected === option.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}