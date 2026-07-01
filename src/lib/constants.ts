/**
 * @file src/lib/constants.ts
 * @description Application-wide constants.
 */

import { ParcelStatus } from '@/types'

// ── TRACKING NUMBER ────────────────────────────────────────────────────────────

export const TRACKING_NUMBER_REGEX   = /^PKT-\d{8}-[A-Z0-9]{4}$/
export const TRACKING_NUMBER_PREFIX  = 'PKT'
export const TRACKING_NUMBER_EXAMPLE = 'PKT-20240618-A3X9'

// ── STATUS DISPLAY CONFIG ──────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  ParcelStatus,
  {
    label:       string
    description: string
    icon:        string
    badgeCss:    string
    dotCss:      string
  }
> = {
  [ParcelStatus.PENDING]: {
    label:       'Pending',
    description: 'Parcel registered and awaiting pickup',
    icon:        '📦',
    badgeCss:    'bg-gray-100 text-gray-700 border border-gray-300',
    dotCss:      'bg-gray-400',
  },
  [ParcelStatus.PICKED_UP]: {
    label:       'Picked Up',
    description: 'Parcel has been collected from the sender',
    icon:        '🚚',
    badgeCss:    'bg-blue-100 text-blue-700 border border-blue-300',
    dotCss:      'bg-blue-500',
  },
  [ParcelStatus.IN_TRANSIT]: {
    label:       'In Transit',
    description: 'Parcel is moving through the delivery network',
    icon:        '✈️',
    badgeCss:    'bg-yellow-100 text-yellow-700 border border-yellow-300',
    dotCss:      'bg-yellow-500',
  },
  [ParcelStatus.OUT_FOR_DELIVERY]: {
    label:       'Out for Delivery',
    description: 'Parcel is with your local courier — arriving today',
    icon:        '🛵',
    badgeCss:    'bg-orange-100 text-orange-700 border border-orange-300',
    dotCss:      'bg-orange-500',
  },
  [ParcelStatus.DELIVERED]: {
    label:       'Delivered',
    description: 'Parcel has been successfully delivered',
    icon:        '✅',
    badgeCss:    'bg-green-100 text-green-700 border border-green-300',
    dotCss:      'bg-green-500',
  },
  [ParcelStatus.EXCEPTION]: {
    label:       'Exception',
    description: 'An issue occurred — please contact support',
    icon:        '⚠️',
    badgeCss:    'bg-red-100 text-red-700 border border-red-300',
    dotCss:      'bg-red-500',
  },
  [ParcelStatus.RETURNED]: {
    label:       'Returned',
    description: 'Parcel could not be delivered and has been returned',
    icon:        '↩️',
    badgeCss:    'bg-purple-100 text-purple-700 border border-purple-300',
    dotCss:      'bg-purple-500',
  },
}

// ── VALID STATUS TRANSITIONS ───────────────────────────────────────────────────

export const VALID_STATUS_TRANSITIONS: Record<ParcelStatus, ParcelStatus[]> = {
  [ParcelStatus.PENDING]:          [ParcelStatus.PICKED_UP, ParcelStatus.EXCEPTION],
  [ParcelStatus.PICKED_UP]:        [ParcelStatus.IN_TRANSIT, ParcelStatus.EXCEPTION],
  [ParcelStatus.IN_TRANSIT]:       [ParcelStatus.OUT_FOR_DELIVERY, ParcelStatus.EXCEPTION, ParcelStatus.RETURNED],
  [ParcelStatus.OUT_FOR_DELIVERY]: [ParcelStatus.DELIVERED, ParcelStatus.EXCEPTION, ParcelStatus.RETURNED],
  [ParcelStatus.DELIVERED]:        [],
  [ParcelStatus.EXCEPTION]:        [ParcelStatus.IN_TRANSIT, ParcelStatus.RETURNED, ParcelStatus.PENDING],
  [ParcelStatus.RETURNED]:         [],
}

// ── PAGINATION ─────────────────────────────────────────────────────────────────

export const DEFAULT_PAGE      = 1
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE     = 100

// ── API ────────────────────────────────────────────────────────────────────────

export const API_KEY_HEADER = 'x-api-key'
