import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Parcel Tracker</p>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Back to Public View
            </a>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}