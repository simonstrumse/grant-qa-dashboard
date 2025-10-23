'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState<'all' | 'organizations' | 'grants'>('all')

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${searchType}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Global Search</h2>

      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search organizations, grants, or content..."
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="all"
                name="searchType"
                value="all"
                checked={searchType === 'all'}
                onChange={(e) => setSearchType('all')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="all" className="text-sm text-gray-700">
                All
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="organizations"
                name="searchType"
                value="organizations"
                checked={searchType === 'organizations'}
                onChange={(e) => setSearchType('organizations')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="organizations" className="text-sm text-gray-700">
                Organizations
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="grants"
                name="searchType"
                value="grants"
                checked={searchType === 'grants'}
                onChange={(e) => setSearchType('grants')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="grants" className="text-sm text-gray-700">
                Grants
              </label>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results ({results.length})
          </h3>

          {results.map((result) => (
            <Link
              key={result.id}
              href={
                result.type === 'organization'
                  ? `/organizations/${result.id}`
                  : `/grants/${result.id}`
              }
              className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        result.type === 'organization'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {result.type === 'organization' ? 'Organization' : 'Grant'}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {result.name}
                  </h4>
                  {result.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {result.description}
                    </p>
                  )}
                  {result.organization_name && (
                    <p className="text-sm text-gray-500 mt-1">
                      Organization: {result.organization_name}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  <div
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      result.completeness_score >= 80
                        ? 'bg-green-100 text-green-800'
                        : result.completeness_score >= 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.completeness_score}%
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No results found for "{query}"</p>
          <p className="text-sm text-gray-400 mt-2">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {/* Search Tips */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Search Tips</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Use specific keywords from organization or grant names</li>
          <li>Try partial matches (e.g., "kunst" will match "Kunstnerforbundet")</li>
          <li>Search for geographic locations to find regional grants</li>
          <li>Use filter options to narrow down results by type</li>
        </ul>
      </div>
    </div>
  )
}
