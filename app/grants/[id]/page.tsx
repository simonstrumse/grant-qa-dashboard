import { supabase } from '@/lib/supabase'
import type { Grant, Organization } from '@/lib/supabase'
import Link from 'next/link'

async function getGrant(id: string) {
  const { data: grant } = await supabase
    .from('grants')
    .select('*')
    .eq('id', id)
    .single()

  if (!grant) return null

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', grant.organization_id)
    .single()

  return {
    grant: grant as Grant,
    organization: org as Organization,
  }
}

export default async function GrantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getGrant(id)

  if (!data) {
    return <div>Grant not found</div>
  }

  const { grant, organization } = data

  return (
    <div>
      <div className="mb-6 flex space-x-4">
        <Link href="/grants" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Grants
        </Link>
        {organization && (
          <Link
            href={`/organizations/${organization.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View Organization →
          </Link>
        )}
      </div>

      {/* Grant Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {grant.grant_name}
            </h2>
            <p className="text-lg text-gray-600">
              {organization?.full_name || organization?.canonical_name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Slug: {grant.grant_slug}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Completeness</div>
            <div className="text-3xl font-bold text-gray-900">
              {grant.completeness_score.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Status: {grant.data_completeness}
            </div>
          </div>
        </div>
      </div>

      {/* Field Completeness */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">
              Fields with Content ({grant.fields_with_content.length})
            </h4>
            <ul className="space-y-1">
              {grant.fields_with_content.map((field) => (
                <li key={field} className="text-sm text-gray-700 flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {field}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-2">
              Missing Fields ({grant.fields_missing.length})
            </h4>
            <ul className="space-y-1">
              {grant.fields_missing.map((field) => (
                <li key={field} className="text-sm text-gray-700 flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  {field}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Grant Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grant Details</h3>
        <div className="space-y-6">
          <DetailField
            label="Description"
            value={grant.description}
            hash={grant.description_hash}
          />
          <DetailField
            label="Eligibility"
            value={grant.eligibility}
            hash={grant.eligibility_hash}
          />
          <DetailField
            label="Geographic Restrictions"
            value={grant.geographic_restrictions}
            hash={grant.geographic_restrictions_hash}
          />
          <DetailField
            label="Application Deadline"
            value={grant.application_deadline}
            hash={grant.application_deadline_hash}
          />
          <DetailField
            label="Application Process"
            value={grant.application_process}
            hash={grant.application_process_hash}
          />
          <DetailField
            label="Award Amount"
            value={grant.award_amount}
            hash={grant.award_amount_hash}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailField
            label="Email"
            value={grant.contact_email}
            hash={grant.contact_email_hash}
            compact
          />
          <DetailField
            label="Phone"
            value={grant.contact_phone}
            hash={grant.contact_phone_hash}
            compact
          />
          <DetailField
            label="Address"
            value={grant.contact_address}
            hash={grant.contact_address_hash}
            compact
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="font-medium">Enriched:</span>{' '}
            {grant.enriched_at ? new Date(grant.enriched_at).toLocaleDateString() : 'N/A'}
          </div>
          <div>
            <span className="font-medium">Version:</span> {grant.enrichment_version}
          </div>
          <div>
            <span className="font-medium">Created:</span>{' '}
            {new Date(grant.created_at).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{' '}
            {new Date(grant.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailField({
  label,
  value,
  hash,
  compact = false,
}: {
  label: string
  value: string
  hash?: string
  compact?: boolean
}) {
  const hasContent = value && value.trim().length > 0
  const isPlaceholder =
    hasContent &&
    (value.toLowerCase().includes('not specified') ||
      value.toLowerCase().includes('not available') ||
      value.toLowerCase().includes('please visit'))

  return (
    <div>
      <dt className={`font-medium text-gray-900 mb-1 ${compact ? 'text-sm' : 'text-base'}`}>
        {label}
        {isPlaceholder && (
          <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
            Placeholder
          </span>
        )}
        {!hasContent && (
          <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
            Missing
          </span>
        )}
      </dt>
      <dd className={`text-gray-700 ${compact ? 'text-sm' : ''}`}>
        {hasContent ? (
          <>
            <p className={isPlaceholder ? 'text-gray-500 italic' : ''}>{value}</p>
            {hash && (
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Hash: {hash.slice(0, 20)}...
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-400 italic">No data provided</p>
        )}
      </dd>
    </div>
  )
}
