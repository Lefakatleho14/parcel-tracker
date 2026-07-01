/**
 * @file src/lib/utils.ts
 * @description Pure utility functions.
 */

import { TRACKING_NUMBER_PREFIX, TRACKING_NUMBER_REGEX } from '@/lib/constants'
import { ParcelStatus }                                   from '@/types'

// ── TRACKING NUMBER ────────────────────────────────────────────────────────────

export function generateTrackingNumber(): string {
  const date   = new Date()
  const year   = date.getFullYear()
  const month  = String(date.getMonth() + 1).padStart(2, '0')
  const day    = String(date.getDate()).padStart(2, '0')
  const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const suffix = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')

  return `${TRACKING_NUMBER_PREFIX}-${year}${month}${day}-${suffix}`
}

export function isValidTrackingNumber(value: string): boolean {
  return TRACKING_NUMBER_REGEX.test(value)
}

// ── DATE FORMATTING ────────────────────────────────────────────────────────────

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    day:    'numeric',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const now     = Date.now()
  const then    = new Date(date).getTime()
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60)    return 'just now'
  if (seconds < 3600)  return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

// ── STRING UTILITIES ───────────────────────────────────────────────────────────

export function toTitleCase(str: string): string {
  return str.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

export function sanitiseString(str: string): string {
  return str.trim().replace(/\s+/g, ' ')
}

// ── PARCEL STATUS ──────────────────────────────────────────────────────────────

export function isValidParcelStatus(value: string): value is ParcelStatus {
  return Object.values(ParcelStatus).includes(value as ParcelStatus)
}

// ── API HELPERS ────────────────────────────────────────────────────────────────

export function buildApiError(error: string, message: string, statusCode: number) {
  return { error, message, statusCode }
}

export function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}