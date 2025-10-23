# Grant Database QA Dashboard

A Next.js-based quality assurance dashboard for the Norwegian grant database, designed for effective manual review and validation of enriched grant data.

## Features

- **Organizations Management**: Browse, filter, and review organizations with completeness tracking
- **Grants Management**: Search and review grants with detailed field-level analysis
- **Duplicate Detection**: Identify and review potential duplicate entries
- **Global Search**: Fast full-text search across all organizations and grants
- **Completeness Dashboard**: Track data quality metrics and identify missing information
- **Field-level Filtering**: Filter by presence/absence of specific fields

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Data Source**: Enriched JSON files from grant scraping project

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project set up
- Enriched grant data in `data/enrichment/` directory

### Installation

1. Install dependencies:
```bash
cd qa-dashboard
npm install
```

2. Set up environment variables:
The `.env.local` file is already configured with your Supabase credentials.

3. Migrate data to Supabase (if not already done):
```bash
cd ..
python3 migrate_to_supabase.py
```

4. Start the development server:
```bash
cd qa-dashboard
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Vercel with automatic deployments from the `main` branch.

### Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous API key

These are automatically set in the Vercel project and will be used for all deployments.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/simonstrumse/grant-qa-dashboard)

Or manually:
1. Push to the `main` branch to trigger automatic deployment
2. View deployment status at https://vercel.com/simonstrumses-projects/grant-qa-dashboard

## Usage Guide

### Dashboard Home
- View overall statistics (total organizations, grants, unresolved issues)
- Quick access to low-completeness entries
- Jump to key workflows

### Organizations
- Browse all organizations with filtering options
- Filter by completeness score (low/high)
- Filter by field presence (e.g., show only orgs without email)
- View detailed organization pages with:
  - Field completeness breakdown
  - Associated grants
  - Source URLs
  - Metadata

### Grants
- Search grants by name
- Filter by completeness and field presence
- View detailed grant information:
  - All enriched fields (description, eligibility, etc.)
  - Contact information
  - Content hashes for change tracking
  - Missing vs. present fields

### Duplicate Detection
- Review potential duplicate organizations/grants
- Manual duplicate search tool
- Mark duplicates for merging or keep as separate

### Global Search
- Search across organizations and grants
- Filter by entity type
- Full-text search in names and descriptions

## Database Schema

### Tables
- `organizations` - Organization master data
- `grants` - Grant details with field-level tracking
- `sources` - Source URLs and scraping metadata
- `validation_issues` - Data quality issues
- `duplicate_candidates` - Potential duplicates for review
- `batch_info` - Enrichment batch tracking

### Key Features
- Field-level completeness tracking with JSONB arrays
- Content hashing for change detection
- Full-text search indexes
- Automatic timestamp management

## QA Workflows

### 1. Completeness Review
1. Dashboard → "Review Low Completeness Organizations"
2. Filter by specific missing fields
3. Review each organization
4. Update source data if needed

### 2. Duplicate Detection
1. Duplicates page
2. Review similarity scores
3. Compare entities side-by-side
4. Mark as duplicate or not duplicate

### 3. Data Validation
1. Search for specific terms/keywords
2. Review search results
3. Check for consistency and accuracy
4. Flag validation issues

### 4. Field-level QA
1. Filter organizations/grants by specific field
2. Set "has content" or "missing"
3. Review entries to identify patterns
4. Update enrichment scripts as needed

## API Routes

- `/api/search` - Global search endpoint
  - Query params: `q` (query string), `type` (all/organizations/grants)

## Development

### Project Structure
```
qa-dashboard/
├── app/
│   ├── api/search/          # Search API
│   ├── organizations/       # Organization views
│   ├── grants/              # Grant views
│   ├── duplicates/          # Duplicate detection
│   ├── search/              # Global search
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard home
│   └── globals.css          # Global styles
├── lib/
│   └── supabase.ts          # Supabase client & types
└── components/              # Reusable components (future)
```

### Adding New Features

1. Database changes: Use Supabase MCP to create migrations
2. API routes: Add to `app/api/`
3. UI pages: Add to `app/[feature]/`
4. Types: Update `lib/supabase.ts`

## Data Migration

The migration script (`migrate_to_supabase.py`) handles:
- Parsing v2 JSON schema
- Calculating completeness scores
- Extracting field-level metadata
- Uploading to Supabase with proper relationships

Re-run migration to update data:
```bash
python3 migrate_to_supabase.py
```

## Performance Considerations

- Pagination: Grants list limits to 100 results
- Indexes: Full-text search on organizations and grants
- Client-side: Search page uses client component for interactivity
- Server-side: All data fetching in server components

## Future Enhancements

- [ ] Batch operations (bulk mark as duplicate, etc.)
- [ ] Export to Excel/CSV
- [ ] Advanced duplicate detection algorithm
- [ ] Automated validation rules
- [ ] Change tracking and audit log
- [ ] Multi-user support with authentication
- [ ] Comments and notes on entries

## License

Internal tool for grant database QA.
