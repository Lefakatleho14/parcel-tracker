/**
 * @file src/components/admin/UpdateStatusForm.tsx
 * @description Form to update a parcel's status.
 */

'use client'

import { useState }                      from 'react'
import { Button }                        from '@/components/ui/Button'
import { Input }                         from '@/components/ui/Input'
import { Card }                          from '@/components/ui/Card'
import { ParcelStatus, ParcelWithEvents } from '@/types'
import { VALID_STATUS_TRANSITIONS }      from '@/lib/constants'

interface UpdateStatusFormProps {
  onStatusUpdated: () => void
}

export function UpdateStatusForm({ onStatusUpdated }: UpdateStatusFormProps) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [currentStatus,  setCurrentStatus]  = useState<ParcelStatus | null>(null)
  const [newStatus,      setNewStatus]      = useState<ParcelStatus | ''>('')
  const [location,       setLocation]       = useState('')
  const [isLooking,      setIsLooking]      = useState(false)
  const [isUpdating,     setIsUpdating]     = useState(false)
  const [error,          setError]          = useState<string | null>(null)
  const [success,        setSuccess]        = useState<string | null>(null)

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setCurrentStatus(null)
    setNewStatus('')
    setIsLooking(true)

    try {
      const response = await fetch(`/api/track/${trackingNumber}`)
      const data: ParcelWithEvents = await response.json()

      if (!response.ok) {
        setError('Parcel not found')
        return
      }

      setCurrentStatus(data.status)

    } catch {
      setError('Network error — please try again')
    } finally {
      setIsLooking(false)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!newStatus) return
    setError(null)
    setSuccess(null)
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/parcels/${trackingNumber}/status`, {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':    process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? '',
        },
        body: JSON.stringify({ status: newStatus, location }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message ?? 'Failed to update status')
        return
      }

      setSuccess(`Status updated to ${newStatus}`)
      setCurrentStatus(newStatus as ParcelStatus)
      setNewStatus('')
      setLocation('')
      onStatusUpdated()

    } catch {
      setError('Network error — please try again')
    } finally {
      setIsUpdating(false)
    }
  }

  const allowedTransitions = currentStatus
    ? VALID_STATUS_TRANSITIONS[currentStatus]
    : []

  return (
    <Card title="Update Parcel Status">
      <div className="flex flex-col gap-4">

        <form onSubmit={handleLookup} className="flex gap-2">
          <div className="flex-1">
            <Input
              label="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              placeholder="PKT-20240618-A3X9"
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="secondary" isLoading={isLooking}>
              Look Up
            </Button>
          </div>
        </form>

        {currentStatus && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4 pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Current status: <strong>{currentStatus}</strong>
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ParcelStatus)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select new status...</option>
                {allowedTransitions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {allowedTransitions.length === 0 && (
                <p className="text-xs text-gray-500">
                  This parcel has reached a terminal status — no further updates allowed.
                </p>
              )}
            </div>

            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Johannesburg Hub"
              required
              minLength={2}
            />

            <Button
              type="submit"
              isLoading={isUpdating}
              disabled={!newStatus || allowedTransitions.length === 0}
            >
              Update Status
            </Button>
          </form>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            ✅ {success}
          </p>
        )}

      </div>
    </Card>
  )
}