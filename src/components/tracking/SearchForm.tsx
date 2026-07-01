/**
 * @file src/components/tracking/SearchForm.tsx
 * @description Public search form for tracking a parcel.
 *
 * 'use client' because it manages form state and handles user input.
 */

'use client'

import { useState }              from 'react'
import { useRouter }             from 'next/navigation'
import { Button }                from '@/components/ui/Button'
import { Input }                 from '@/components/ui/Input'
import { TRACKING_NUMBER_EXAMPLE } from '@/lib/constants'

export function SearchForm() {
  const router                        = useRouter()
  const [trackingNumber, setTracking] = useState('')
  const [error,          setError]    = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const cleaned = trackingNumber.trim().toUpperCase()

    if (!cleaned) {
      setError('Please enter a tracking number')
      return
    }

    // Navigate to the tracking page — the page component fetches the data
    router.push(`/track/${cleaned}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            label="Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTracking(e.target.value.toUpperCase())}
            placeholder={TRACKING_NUMBER_EXAMPLE}
            maxLength={20}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit">
            Track
          </Button>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <p className="text-xs text-gray-400">
        Example: {TRACKING_NUMBER_EXAMPLE}
      </p>
    </form>
  )
}