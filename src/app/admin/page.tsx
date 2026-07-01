/**
 * @file src/app/admin/page.tsx
 * @description Admin dashboard — create parcels, update status, view all parcels.
 *
 * This is a Client Component because it manages state (parcel list,
 * filters, loading) and handles user interactions.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { CreateParcelForm }   from '@/components/admin/CreateParcelForm'
import { UpdateStatusForm }   from '@/components/admin/UpdateStatusForm'
import { ParcelTable }        from '@/components/admin/ParcelTable'
import { StatusFilter }       from '@/components/admin/StatusFilter'
import { Card }               from '@/components/ui/Card'
import { Parcel, ParcelStatus, ParcelWithEvents } from '@/types'

export default function AdminPage() {
  const [parcels,       setParcels]       = useState<Parcel[]>([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [statusFilter,  setStatusFilter]  = useState<ParcelStatus | 'ALL'>('ALL')
  const [totalParcels,  setTotalParcels]  = useState(0)

  // ── Fetch parcels ────────────────────────────────────────────────────────────

  const fetchParcels = useCallback(async (status: ParcelStatus | 'ALL') => {
    setIsLoading(true)
    try {
      const url = status === 'ALL'
        ? '/api/admin/parcels'
        : `/api/admin/parcels?status=${status}`

      const response = await fetch(url, {
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? '' },
      })

      const data = await response.json()
      setParcels(data.data ?? [])
      setTotalParcels(data.pagination?.total ?? 0)

    } catch {
      console.error('Failed to fetch parcels')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch on mount and when filter changes
  useEffect(() => {
    fetchParcels(statusFilter)
  }, [statusFilter, fetchParcels])

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleParcelCreated(parcel: ParcelWithEvents) {
    fetchParcels(statusFilter)
  }

  function handleStatusUpdated(tracking_number: string) {
    fetchParcels(statusFilter)
  }

  function handleFilterChange(status: ParcelStatus | 'ALL') {
    setStatusFilter(status)
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-8">

      {/* ── Page Header ───────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage parcels and track deliveries
        </p>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📦</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalParcels}</p>
              <p className="text-xs text-gray-500">Total Parcels</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="text-3xl">✈️</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {parcels.filter(p => p.status === 'IN_TRANSIT').length}
              </p>
              <p className="text-xs text-gray-500">In Transit</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {parcels.filter(p => p.status === 'DELIVERED').length}
              </p>
              <p className="text-xs text-gray-500">Delivered</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Action Forms ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreateParcelForm onParcelCreated={handleParcelCreated} />
        <UpdateStatusForm onStatusUpdated={handleStatusUpdated} />
      </div>

      {/* ── Parcels Table ─────────────────────────────────── */}
      <Card title="All Parcels">
        <div className="flex flex-col gap-4">
          <StatusFilter
            selected={statusFilter}
            onChange={handleFilterChange}
          />
          <ParcelTable
            parcels={parcels}
            isLoading={isLoading}
          />
        </div>
      </Card>

    </div>
  )
}