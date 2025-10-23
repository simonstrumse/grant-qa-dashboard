import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

// Type definitions for our database tables
export interface Organization {
  id: string
  canonical_name: string
  full_name: string
  description: string
  website: string
  contact_email: string
  phone: string
  org_type: string
  enrichment_version: string
  last_updated: string
  total_grants_count: number
  active_grants_count: number
  completeness_score: number
  fields_with_content: string[]
  fields_missing: string[]
  created_at: string
  updated_at: string
}

export interface ParsedAmount {
  amount: number | null
  currency: string
  raw_text: string
}

export interface ParsedDeadline {
  day?: number
  month?: number
  raw_text: string
  is_recurring?: boolean
}

export interface Grant {
  id: string
  organization_id: string
  grant_slug: string
  grant_name: string
  grant_name_hash: string
  description: string
  description_hash: string
  eligibility: string
  eligibility_hash: string
  geographic_restrictions: string
  geographic_restrictions_hash: string
  application_deadline: string
  application_deadline_hash: string
  award_amount: string
  award_amount_hash: string
  application_process: string
  application_process_hash: string
  contact_email: string
  contact_email_hash: string
  contact_phone: string
  contact_phone_hash: string
  contact_address: string
  contact_address_hash: string
  enriched_at: string
  enrichment_version: string
  data_completeness: string
  completeness_score: number
  fields_with_content: string[]
  fields_missing: string[]
  created_at: string
  updated_at: string
  award_amount_parsed?: ParsedAmount
  application_deadline_parsed?: ParsedDeadline
  geographic_restrictions_parsed?: any
}

export interface Source {
  id: string
  organization_id: string
  url: string
  source_type: string
  content_hash: string
  fetched_at: string
  fetch_method: string
  automation_difficulty: string
  created_at: string
}

export interface ValidationIssue {
  id: string
  entity_type: string
  entity_id: string
  issue_type: string
  field_name: string
  severity: string
  description: string
  is_resolved: boolean
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface DuplicateCandidate {
  id: string
  entity_type: string
  entity_1_id: string
  entity_2_id: string
  similarity_score: number
  match_method: string
  is_duplicate: boolean | null
  reviewed_at: string | null
  notes: string
  created_at: string
}
