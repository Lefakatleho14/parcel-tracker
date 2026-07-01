/**
 * @file src/components/ui/Badge.tsx
 * @description Reusable status badge component.
 */

'use client'

import { ParcelStatus }  from '@/types'
import { STATUS_CONFIG } from '@/lib/constants'

interface BadgeProps {
  status: ParcelStatus
}

export function Badge({ status }: BadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badgeCss}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}