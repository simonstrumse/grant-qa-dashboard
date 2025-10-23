import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { StatCard } from '@/components/StatCard'

async function getDashboardStats() {
  const [orgsResult, grantsResult, issuesResult] = await Promise.all([
    supabase.from('organizations').select('*', { count: 'exact', head: true }),
    supabase.from('grants').select('*', { count: 'exact', head: true }),
    supabase.from('validation_issues').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
  ])

  // Get completeness stats
  const { data: lowCompletenessOrgs } = await supabase
    .from('organizations')
    .select('id')
    .lt('completeness_score', 50)

  const { data: lowCompletenessGrants } = await supabase
    .from('grants')
    .select('id')
    .lt('completeness_score', 50)

  return {
    totalOrgs: orgsResult.count || 0,
    totalGrants: grantsResult.count || 0,
    unresolvedIssues: issuesResult.count || 0,
    lowCompletenessOrgs: lowCompletenessOrgs?.length || 0,
    lowCompletenessGrants: lowCompletenessGrants?.length || 0,
  }
}

export default async function Dashboard() {
  const stats = await getDashboardStats()

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor data quality and completeness across your grant database</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Organizations"
          value={stats.totalOrgs}
          href="/organizations"
          icon="🏢"
          description="Total organizations in database"
          variant="default"
        />
        <StatCard
          title="Total Grants"
          value={stats.totalGrants}
          href="/grants"
          icon="💰"
          description="Total grants across all organizations"
          variant="success"
        />
        <StatCard
          title="Unresolved Issues"
          value={stats.unresolvedIssues}
          href="/issues"
          icon="⚠️"
          description="Data quality issues pending review"
          variant={stats.unresolvedIssues > 0 ? 'error' : 'default'}
        />
        <StatCard
          title="Low Completeness Orgs"
          value={stats.lowCompletenessOrgs}
          href="/organizations?filter=low_completeness"
          icon="📊"
          description="Organizations with <50% completeness"
          variant={stats.lowCompletenessOrgs > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Low Completeness Grants"
          value={stats.lowCompletenessGrants}
          href="/grants?filter=low_completeness"
          icon="📉"
          description="Grants with <50% completeness"
          variant={stats.lowCompletenessGrants > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Duplicate Review"
          value="0"
          href="/duplicates"
          icon="🔍"
          description="Potential duplicates awaiting review"
          variant="default"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>⚡</span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionButton href="/organizations?sort=completeness&order=asc" label="Review Low Completeness Orgs" />
          <ActionButton href="/grants?sort=completeness&order=asc" label="Review Low Completeness Grants" />
          <ActionButton href="/duplicates" label="Check for Duplicates" />
          <ActionButton href="/search" label="Search Database" />
        </div>
      </div>

      {/* Info Banner */}
      {(stats.lowCompletenessOrgs > 0 || stats.lowCompletenessGrants > 0) && (
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Attention needed:</span> You have{' '}
                {stats.lowCompletenessOrgs + stats.lowCompletenessGrants} items with low data completeness.
                Consider reviewing and enriching these entries.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <span>{label}</span>
      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
