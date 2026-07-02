/**
 * @file src/components/admin/CreateParcelForm.tsx
 * @description Form to create a new parcel.
 */

'use client'

import { useState }  from 'react'
import { Button }    from '@/components/ui/Button'
import { Input }     from '@/components/ui/Input'
import { Card }      from '@/components/ui/Card'

interface CreateParcelFormProps {
  onParcelCreated: () => void
}

export function CreateParcelForm({ onParcelCreated }: CreateParcelFormProps) {
  const [senderName,   setSenderName]   = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [isLoading,    setIsLoading]    = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [success,      setSuccess]      = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/parcels', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':    process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? '',
        },
        body: JSON.stringify({
          sender_name:   senderName,
          receiver_name: receiverName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message ?? 'Failed to create parcel')
        return
      }

      setSuccess(`Parcel created! Tracking number: ${data.tracking_number}`)
      setSenderName('')
      setReceiverName('')
      onParcelCreated()

    } catch {
      setError('Network error — please try again')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card title="Create New Parcel">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <Input
          label="Sender Name"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="e.g. John Doe"
          required
          minLength={2}
          maxLength={100}
        />

        <Input
          label="Receiver Name"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          placeholder="e.g. Jane Smith"
          required
          minLength={2}
          maxLength={100}
        />

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

        <Button type="submit" isLoading={isLoading}>
          Create Parcel
        </Button>

      </form>
    </Card>
  )
}