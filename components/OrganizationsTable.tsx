'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Organization } from '@/lib/supabase'

interface OrganizationsTableProps {
  organizations: Organization[]
  currentSort: string
  currentOrder: 'asc' | 'desc'
}

export function OrganizationsTable({ organizations, currentSort, currentOrder }: OrganizationsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (columnKey: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (currentSort === columnKey) {
      // Toggle order
      params.set('order', currentOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // New sort column
      params.set('sort', columnKey)
      params.set('order', 'asc')
    }

    router.push(`?${params.toString()}`)
  }

  const renderSortIndicator = (columnKey: string) => {
    if (currentSort !== columnKey) {
      return (
        <span className="ml-1 text-gray-400">
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      )
    }

    return (
      <span className="ml-1 text-blue-600">
        {currentOrder === 'asc' ? (
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 max-w-md"
              onClick={() => handleSort('canonical_name')}
            >
              <div className="flex items-center">
                Organization Name
                {renderSortIndicator('canonical_name')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('completeness_score')}
            >
              <div className="flex items-center justify-center">
                Completeness
                {renderSortIndicator('completeness_score')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('active_grants_count')}
            >
              <div className="flex items-center justify-center">
                Grants
                {renderSortIndicator('active_grants_count')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {organizations.map((org) => (
            <tr key={org.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <Link href={`/organizations/${org.id}`} className="block">
                  <div className="font-medium text-gray-900">
                    {org.full_name || org.canonical_name}
                  </div>
                  {org.canonical_name !== org.full_name && (
                    <div className="text-sm text-gray-500 mt-1">{org.canonical_name}</div>
                  )}
                </Link>
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap">
                <div className="flex items-center justify-center">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      org.completeness_score >= 80
                        ? 'bg-green-100 text-green-800'
                        : org.completeness_score >= 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {org.completeness_score.toFixed(0)}%
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">
                  {org.active_grants_count || 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  {org.website && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Website
                    </span>
                  )}
                  {org.contact_email && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Email
                    </span>
                  )}
                  {org.phone && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      Phone
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {organizations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No organizations found
        </div>
      )}
    </div>
  )
}
