import { supabase } from '@/lib/supabase'
import { GrantsTable } from '@/components/GrantsTable'
import { Pagination } from '@/components/Pagination'

interface SearchParams {
  filter?: string
  search?: string
  organization?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: string
  pageSize?: string
}

async function getGrants(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1')
  const pageSize = parseInt(searchParams.pageSize || '25')
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('grants')
    .select(`
      *,
      organizations!inner(id, canonical_name, full_name)
    `, { count: 'exact' })

  // Filter by completeness
  if (searchParams.filter === 'low_completeness') {
    query = query.lt('completeness_score', 50)
  } else if (searchParams.filter === 'high_completeness') {
    query = query.gte('completeness_score', 80)
  }

  // Search by grant name
  if (searchParams.search) {
    query = query.ilike('grant_name', `%${searchParams.search}%`)
  }

  // Filter by organization
  if (searchParams.organization) {
    query = query.eq('organization_id', searchParams.organization)
  }

  // Sorting
  const sortField = searchParams.sort || 'completeness_score'
  const sortOrder = searchParams.order || 'desc'

  query = query.order(sortField, { ascending: sortOrder === 'asc' })

  // Pagination
  query = query.range(offset, offset + pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching grants:', error)
    return { grants: [], total: 0 }
  }

  return { grants: data || [], total: count || 0 }
}

export default async function GrantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { grants, total } = await getGrants(params)
  const page = parseInt(params.page || '1')
  const pageSize = parseInt(params.pageSize || '25')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Grants</h2>
        <div className="text-sm text-gray-600">
          {total} total grants
        </div>
      </div>

      <GrantsTable
        grants={grants}
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
