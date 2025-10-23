import { getSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'

async function getDuplicateCandidates() {
  const supabase = getSupabaseClient()

  const { data: duplicates } = await supabase
    .from('duplicate_candidates')
    .select('*')
    .is('is_duplicate', null)
    .order('similarity_score', { ascending: false })

  return duplicates || []
}

async function getOrganizations() {
  const supabase = getSupabaseClient()

  const { data } = await supabase
    .from('organizations')
    .select('canonical_name, full_name')
    .order('canonical_name', { ascending: true })

  return data || []
}

export default async function DuplicatesPage() {
  const duplicates = await getDuplicateCandidates()
  const organizations = await getOrganizations()

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Duplicate Detection</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pending Review ({duplicates.length})
        </h3>

        {duplicates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No pending duplicate candidates to review.</p>
            <p className="text-sm text-gray-400">
              Run the duplicate detection script to identify potential duplicates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {duplicates.map((dup: any) => (
              <div
                key={dup.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Potential {dup.entity_type} Duplicate
                    </h4>
                    <p className="text-sm text-gray-600">
                      Similarity: {dup.similarity_score.toFixed(1)}% • Method: {dup.match_method}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200">
                      Mark as Duplicate
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                      Not a Duplicate
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium">Entity 1</p>
                    <p className="text-gray-600">ID: {dup.entity_1_id}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium">Entity 2</p>
                    <p className="text-gray-600">ID: {dup.entity_2_id}</p>
                  </div>
                </div>

                {dup.notes && (
                  <p className="mt-3 text-sm text-gray-600 italic">{dup.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Duplicate Detection Tool */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Manual Duplicate Detection
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Use this tool to manually search for potential duplicates in the database.
          This is useful for finding organizations or grants with similar names.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search for potential duplicates
            </label>
            <input
              type="text"
              placeholder="Enter organization or grant name..."
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Search Organizations
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Search Grants
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Total Organizations</h4>
          <p className="text-2xl font-bold text-gray-900">{organizations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Pending Review</h4>
          <p className="text-2xl font-bold text-gray-900">{duplicates.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Confirmed Duplicates</h4>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How to use duplicate detection</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Review each potential duplicate pair above</li>
          <li>Compare the entities by viewing their detail pages</li>
          <li>Mark as duplicate if they represent the same entity</li>
          <li>Mark as not duplicate if they are different entities</li>
          <li>Confirmed duplicates can be merged or one can be marked inactive</li>
        </ol>
      </div>
    </div>
  )
}
