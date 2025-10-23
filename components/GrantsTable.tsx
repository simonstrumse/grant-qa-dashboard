'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface GrantsTableProps {
  grants: any[]
  currentSort: string
  currentOrder: 'asc' | 'desc'
}

function formatAmount(parsed: any): string {
  if (!parsed) return '-'

  try {
    const data = typeof parsed === 'string' ? JSON.parse(parsed) : parsed
    if (data.amount) {
      return `kr ${data.amount.toLocaleString('no-NO')}`
    }
  } catch (e) {
    // Ignore parse errors
  }
  return '-'
}

function formatDeadline(parsed: any): string {
  if (!parsed) return '-'

  try {
    const data = typeof parsed === 'string' ? JSON.parse(parsed) : parsed
    if (data.day && data.month) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${data.day}. ${months[data.month - 1]}`
    }
  } catch (e) {
    // Ignore parse errors
  }
  return '-'
}

export function GrantsTable({ grants, currentSort, currentOrder }: GrantsTableProps) {
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
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 max-w-sm"
              onClick={() => handleSort('grant_name')}
            >
              <div className="flex items-center">
                Grant Name
                {renderSortIndicator('grant_name')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('award_amount')}
            >
              <div className="flex items-center justify-end">
                Award Amount
                {renderSortIndicator('award_amount')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('application_deadline')}
            >
              <div className="flex items-center justify-center">
                Deadline
                {renderSortIndicator('application_deadline')}
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
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('fields_count')}
            >
              <div className="flex items-center">
                Fields
                {renderSortIndicator('fields_count')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {grants.map((grant) => (
            <tr key={grant.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <Link href={`/grants/${grant.id}`} className="block">
                  <div className="font-medium text-gray-900">{grant.grant_name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {grant.organizations?.full_name || grant.organizations?.canonical_name}
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatAmount(grant.award_amount_parsed)}
                </div>
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap">
                <div className="text-sm text-gray-700">
                  {formatDeadline(grant.application_deadline_parsed)}
                </div>
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap">
                <div className="flex items-center justify-center">
                  <div
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      grant.completeness_score >= 80
                        ? 'bg-green-100 text-green-800'
                        : grant.completeness_score >= 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {grant.completeness_score.toFixed(0)}%
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {grant.description && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700">
                      Desc
                    </span>
                  )}
                  {grant.eligibility && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700">
                      Elig
                    </span>
                  )}
                  {grant.award_amount_parsed && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                      $$
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {grants.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No grants found
        </div>
      )}
    </div>
  )
}
