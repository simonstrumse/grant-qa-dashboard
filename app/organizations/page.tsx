import { supabase } from '@/lib/supabase'
import type { Organization } from '@/lib/supabase'
import { OrganizationsTable } from '@/components/OrganizationsTable'
import { Pagination } from '@/components/Pagination'

interface SearchParams {
  filter?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: string
  pageSize?: string
}

async function getOrganizations(searchParams: SearchParams) {

  const page = parseInt(searchParams.page || '1')
  const pageSize = parseInt(searchParams.pageSize || '25')
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('organizations')
    .select('*', { count: 'exact' })

  // Filter by completeness
  if (searchParams.filter === 'low_completeness') {
    query = query.lt('completeness_score', 50)
  } else if (searchParams.filter === 'high_completeness') {
    query = query.gte('completeness_score', 80)
  }

  // Sorting
  const sortField = searchParams.sort || 'completeness_score'
  const sortOrder = searchParams.order || 'desc'
  query = query.order(sortField, { ascending: sortOrder === 'asc' })

  // Pagination
  query = query.range(offset, offset + pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching organizations:', error)
    return { organizations: [], total: 0 }
  }

  return { organizations: data as Organization[], total: count || 0 }
}

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { organizations, total } = await getOrganizations(params)
  const page = parseInt(params.page || '1')
  const pageSize = parseInt(params.pageSize || '25')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Organizations</h2>
          <p className="text-gray-600">Browse and filter grant organizations by data completeness</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{total}</div>
          <div className="text-sm text-gray-600">total organizations</div>
        </div>
      </div>

      <OrganizationsTable
        organizations={organizations}
        currentSort={params.sort || 'completeness_score'}
        currentOrder={(params.order as 'asc' | 'desc') || 'desc'}
      />

      <Pagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={total}
      />
    </div>
  )
}
