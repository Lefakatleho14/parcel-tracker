/**
 * @file src/app/page.tsx
 * @description Landing page with parcel search form.
 */

import type { Metadata }  from 'next'
import { SearchForm }     from '@/components/tracking/SearchForm'

export const metadata: Metadata = {
  title: 'Track Your Parcel',
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          📦 Parcel Tracker
        </h1>
        <p className="text-gray-500 text-lg">
          Enter your tracking number to see real-time delivery updates
        </p>
      </div>

      {/* ── Search Card ───────────────────────────────────── */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <SearchForm />
      </div>

      {/* ── Admin Link ────────────────────────────────────── */}
      <p className="mt-8 text-sm text-gray-400">
        Are you staff?{' '}
        <a href="/admin" className="text-blue-600 hover:underline">
          Go to Admin Dashboard
        </a>
      </p>

    </main>
  )
}