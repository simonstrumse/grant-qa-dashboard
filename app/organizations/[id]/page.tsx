import { getSupabaseClient } from '@/lib/supabase'
import type { Organization, Grant, Source } from '@/lib/supabase'
import Link from 'next/link'
import { CircularProgress } from '@/components/ProgressBar'
import { Badge, CompletenessScore } from '@/components/Badge'

async function getOrganization(id: string) {
  const supabase = getSupabaseClient()

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single()

  const { data: grants } = await supabase
    .from('grants')
    .select('*')
    .eq('organization_id', id)
    .order('grant_name', { ascending: true })

  const { data: sources } = await supabase
    .from('sources')
    .select('*')
    .eq('organization_id', id)

  return {
    organization: org as Organization,
    grants: (grants as Grant[]) || [],
    sources: (sources as Source[]) || [],
  }
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { organization, grants, sources } = await getOrganization(id)

  if (!organization) {
    return <div>Organization not found</div>
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/organizations" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Organizations
        </Link>
      </div>

      {/* Organization Header */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-200 p-8 mb-6 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {organization.full_name || organization.canonical_name}
            </h2>
            {organization.canonical_name !== organization.full_name && (
              <p className="text-lg text-gray-600 mb-4">ID: {organization.canonical_name}</p>
            )}
            {organization.description && (
              <p className="text-gray-700 leading-relaxed max-w-3xl">{organization.description}</p>
            )}
          </div>
          <div className="ml-6">
            <CircularProgress score={organization.completeness_score} size={120} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-100">
          <QuickStat label="Total Grants" value={organization.total_grants_count} />
          <QuickStat label="Active Grants" value={organization.active_grants_count} />
          <QuickStat label="Fields Present" value={organization.fields_with_content.length} />
          <QuickStat label="Fields Missing" value={organization.fields_missing.length} />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📞</span>
            Contact Information
          </h3>
          <div className="space-y-3">
            <InfoField label="Website" value={organization.website} isUrl />
            <InfoField label="Email" value={organization.contact_email} />
            <InfoField label="Phone" value={organization.phone} />
            <InfoField label="Type" value={organization.org_type} />
            <InfoField
              label="Last Updated"
              value={new Date(organization.last_updated).toLocaleDateString()}
            />
          </div>
        </div>

        {/* Field Completeness */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>✅</span>
            Field Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2">
                Present ({organization.fields_with_content.length})
              </h4>
              <div className="space-y-1">
                {organization.fields_with_content.map((field) => (
                  <div key={field} className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{field}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2">
                Missing ({organization.fields_missing.length})
              </h4>
              <div className="space-y-1">
                {organization.fields_missing.map((field) => (
                  <div key={field} className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span>{field}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔗</span>
            Sources ({sources.length})
          </h3>
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium break-all"
                >
                  {source.url}
                </a>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="info" size="sm">Type: {source.source_type}</Badge>
                  <Badge variant="neutral" size="sm">Method: {source.fetch_method}</Badge>
                  {source.automation_difficulty && (
                    <Badge
                      variant={source.automation_difficulty === 'easy' ? 'success' : source.automation_difficulty === 'hard' ? 'error' : 'warning'}
                      size="sm"
                    >
                      Difficulty: {source.automation_difficulty}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grants */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>💰</span>
          Grants ({grants.length})
        </h3>
        {grants.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No grants found for this organization.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grants.map((grant) => (
              <Link
                key={grant.id}
                href={`/grants/${grant.id}`}
                className="group border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex-1">
                    {grant.grant_name}
                  </h4>
                  <CompletenessScore score={grant.completeness_score} />
                </div>
                {grant.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {grant.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Slug: {grant.grant_slug}</span>
                  <Badge variant="neutral" size="sm">{grant.data_completeness}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-blue-600">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  )
}

function InfoField({
  label,
  value,
  isUrl = false,
}: {
  label: string
  value: string
  isUrl?: boolean
}) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
      <dt className="text-sm font-medium text-gray-600 w-1/3">{label}</dt>
      <dd className="text-sm text-gray-900 w-2/3 text-right">
        {isUrl && value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 break-all"
          >
            {value}
          </a>
        ) : value ? (
          <span className="break-all">{value}</span>
        ) : (
          <span className="text-gray-400 italic">Not provided</span>
        )}
      </dd>
    </div>
  )
}
