'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  getRowKey: (row: T) => string
  getRowHref?: (row: T) => string
  currentSort?: string
  currentOrder?: 'asc' | 'desc'
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  getRowHref,
  currentSort,
  currentOrder = 'asc'
}: DataTableProps<T>) {
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
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                } ${column.className || ''}`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && renderSortIndicator(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => {
            const RowWrapper = getRowHref ? Link : 'tr'
            const rowProps = getRowHref
              ? { href: getRowHref(row), className: 'hover:bg-gray-50 cursor-pointer' }
              : { className: 'hover:bg-gray-50' }

            return (
              <RowWrapper key={getRowKey(row)} {...rowProps as any}>
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}>
                    {column.render ? column.render(row) : (row as any)[column.key]}
                  </td>
                ))}
              </RowWrapper>
            )
          })}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No data found
        </div>
      )}
    </div>
  )
}
