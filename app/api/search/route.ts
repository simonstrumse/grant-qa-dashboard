import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'all'

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results: any[] = []

  try {

    // Search organizations
    if (type === 'all' || type === 'organizations') {
      const { data: orgs } = await supabase
        .from('organizations')
        .select('id, canonical_name, full_name, description, completeness_score')
        .or(`canonical_name.ilike.%${query}%,full_name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(50)

      if (orgs) {
        results.push(
          ...orgs.map((org) => ({
            id: org.id,
            type: 'organization',
            name: org.full_name || org.canonical_name,
            description: org.description,
            completeness_score: org.completeness_score,
          }))
        )
      }
    }

    // Search grants
    if (type === 'all' || type === 'grants') {
      const { data: grants } = await supabase
        .from('grants')
        .select(`
          id,
          grant_name,
          description,
          completeness_score,
          organizations!inner(full_name, canonical_name)
        `)
        .or(`grant_name.ilike.%${query}%,description.ilike.%${query}%,eligibility.ilike.%${query}%`)
        .limit(50)

      if (grants) {
        results.push(
          ...grants.map((grant: any) => ({
            id: grant.id,
            type: 'grant',
            name: grant.grant_name,
            description: grant.description,
            organization_name:
              grant.organizations?.full_name || grant.organizations?.canonical_name,
            completeness_score: grant.completeness_score,
          }))
        )
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
