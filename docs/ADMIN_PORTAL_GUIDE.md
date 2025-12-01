# Nescomm Admin Portal + School ERP - Implementation Guide

## Overview

This is a **two-tier SaaS architecture** where:
- **Nescomm Admin Portal** (`nescomm.com`) - For company employees to manage schools
- **School ERP** (`subdomain.nescomm.com`) - Individual school instances with full ERP access

## Architecture (Vercel Free Tier Compatible)

### Current Deployment
- **Marketing Site**: `https://nescomm.vercel.app/`
- **ERP Application**: `https://web-nescomm.vercel.app/`

### Route Structure

```
web-nescomm.vercel.app/
├── /admin                    → Company Admin Portal
│   ├── /admin/schools        → Manage all schools
│   ├── /admin/schools/new    → Create new school
│   └── /admin/settings       → Admin settings
├── /auth/admin-login         → Company admin login
├── /dashboard                → School ERP Dashboard
│   ├── /dashboard/admission  → Admission management
│   ├── /dashboard/students   → Student management
│   ├── /dashboard/staff      → Staff management
│   └── ... (all other ERP modules)
└── /auth/login               → School user login
```

### Tenant Selection
Instead of subdomains, **tenant is determined by**:
1. **School Admin Login** → User belongs to specific tenant via `members` table
2. **All queries filtered** → Automatic tenant isolation via RLS
3. **Multi-school support** → Same user can belong to multiple tenants

### Role Hierarchy
- **Superadmin** (`superadmin` role): Nescomm employees managing the platform
- **School Admin** (`admin` role): School administrators with full ERP access
- **Other Roles**: Teachers, students, parents, etc. (as defined in your roles table)

## Database Schema

### Key Tables

#### 1. `school_instances`
Tracks all school instances created by company admins.

```sql
- id: UUID
- tenant_id: UUID (links to tenants table)
- subdomain: TEXT (unique subdomain like 'dpsranchi')
- school_name: TEXT
- admin_email: TEXT
- admin_user_id: UUID (school admin user)
- status: TEXT (pending | active | suspended | cancelled)
- setup_completed: BOOLEAN
- subscription_plan: TEXT (trial | basic | standard | premium)
- max_students: INTEGER
- max_staff: INTEGER
- created_by: UUID (company admin who created it)
```

#### 2. `admin_activity_logs`
Audit trail for company admin actions.

#### 3. Existing tables:
- `tenants` - Each school is a tenant
- `members` - Maps users to tenants with roles
- `roles` - company_admin, school_admin, teacher, student, etc.

## Implementation Steps

### Step 1: Database Setup

Run the SQL script:
```bash
# Execute the admin-portal-schema.sql
psql -U your_user -d your_db -f database/admin-portal-schema.sql
```

### Step 2: Create First Company Admin

Manually create the first company admin in Supabase:

1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user with email (e.g., admin@nescomm.com)
3. Run SQL:

```sql
-- Get the Nescomm tenant ID
SELECT id FROM tenants WHERE domain = 'nescomm.com';

-- Get company_admin role ID
SELECT id FROM roles WHERE name = 'company_admin';

-- Insert member record
INSERT INTO members (user_id, tenant_id, role_id, status)
VALUES (
  'USER_ID_FROM_AUTH',
  'NESCOMM_TENANT_ID',
  'COMPANY_ADMIN_ROLE_ID',
  'approved'
);
```

### Step 4: Environment Setup (Vercel)

Update your environment variables in Vercel dashboard:

**For web-nescomm.vercel.app:**
```env
NEXT_PUBLIC_APP_URL=https://web-nescomm.vercel.app
NEXT_PUBLIC_MARKETING_URL=https://nescomm.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

No subdomain handling needed - everything runs on single domain!

### Step 5: Simplified Routing (No Subdomain Middleware Needed!)

Since you're on Vercel Free tier, you don't need complex subdomain routing.

**How it works:**
1. User logs in at `/auth/login` or `/auth/admin-login`
2. After authentication, check user's role from `members` table
3. If `company_admin` → redirect to `/admin`
4. If `school_admin` or other → redirect to `/dashboard`
5. All data queries automatically filtered by tenant via RLS

**Your existing middleware** (`middleware.ts`) handles auth - no changes needed!

### Step 5: Middleware Enhancement

The middleware needs to handle subdomain routing. Update `middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  
  // Extract subdomain
  const parts = hostname.split('.');
  
  // Main domain: nescomm.com or localhost -> Admin Portal
  if (hostname.includes('nescomm.com') || hostname.startsWith('localhost')) {
    if (parts.length === 2 || hostname.startsWith('localhost')) {
      // Main domain - allow admin routes
      return NextResponse.next();
    }
  }
  
  // Subdomain: school.nescomm.com -> School ERP
  if (parts.length >= 3) {
    const subdomain = parts[0];
    
    // Skip www, api, admin
    if (['www', 'api', 'admin'].includes(subdomain)) {
      return NextResponse.next();
    }
    
    // Add subdomain to headers for use in app
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-school-subdomain', subdomain);
    
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

## User Flow (Simplified for Single Domain)

### Company Admin Flow

1. **Login**: Nescomm employee (superadmin) logs in at `web-nescomm.vercel.app/auth/admin-login`
2. **Dashboard**: Redirected to `/admin` - sees overview of all schools
3. **Create School**:
   - Go to `/admin/schools/new`
   - Fill form:
     - School name (e.g., "DPS Ranchi")
     - School identifier (e.g., "dpsranchi") - stored but not used as subdomain
     - Admin email & password
     - Subscription plan, limits
   - Click "Create School"
4. **Behind the scenes**:
   - Creates tenant in `tenants` table
   - Creates school admin user in auth
   - Creates member linking user to tenant with `admin` role (not `school_admin`)
   - Creates school_instance record
5. **Result**: Nescomm employee sends credentials to school admin

### School Admin Flow

1. **Receive Credentials**: Gets email & password from Nescomm
2. **Login**: Goes to `web-nescomm.vercel.app/auth/login`
3. **Auto-redirect**: System checks their tenant via `members` table → redirects to `/dashboard`
4. **Access ERP**: Full access to all ERP modules (students, staff, admissions, etc.)
5. **Tenant Isolation**: All queries automatically filtered by their `tenant_id`

### Multi-Tenant Login (Same Domain)

When user logs in:
```typescript
// Get user's tenant(s) from members table
const { data: members } = await supabase
  .from("members")
  .select("*, tenant:tenants(*), role:roles(*)")
  .eq("user_id", user.id)
  .eq("status", "approved");

// If user belongs to multiple tenants, show selector
// If single tenant, auto-select
// Store selected tenant_id in session/context
```

## Security - Row Level Security (RLS)

All tables must have RLS policies that filter by `tenant_id`:

```sql
-- Example: Students table
CREATE POLICY "Users can only see their tenant's students"
  ON students FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM members 
      WHERE user_id = auth.uid()
    )
  );
```

## Production Deployment (Vercel)

### Current Setup - Perfect! ✅

Your existing Vercel deployments work great:
- **Marketing**: `nescomm.vercel.app` (homepage)
- **Application**: `web-nescomm.vercel.app` (admin + school ERP)

### No Additional Configuration Needed

1. **DNS**: Already configured by Vercel
2. **SSL**: Automatic via Vercel
3. **Routing**: Path-based (no subdomain complexity)

### Environment Variables

Set in Vercel Dashboard for `web-nescomm`:

```env
NEXT_PUBLIC_APP_URL=https://web-nescomm.vercel.app
NEXT_PUBLIC_MARKETING_URL=https://nescomm.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
```

### Database Capacity (Supabase Free Tier)

**Your current schema + admin portal additions:**

| Component | Storage Estimate |
|-----------|-----------------|
| Existing tables (students, staff, etc.) | ~50-100 MB per school |
| Admin portal tables | < 1 MB total |
| 10 schools with 1000 students each | ~250-300 MB |
| **Total with buffer** | **< 400 MB** |

**Supabase Free Tier**: 500 MB database ✅
- You have plenty of room!
- Can comfortably handle 10-15 schools
- Monitor usage in Supabase dashboard

### Scaling Path

When you outgrow free tier:
1. **Supabase Pro** ($25/mo): 8 GB database, 50 GB bandwidth
2. **Vercel Pro** ($20/mo): Custom domains, more bandwidth
3. **Total**: ~$45/mo for professional setup

## Files Created

### Database
- `database/admin-portal-schema.sql` - Admin portal schema

### Types
- `lib/types/admin.ts` - TypeScript types for admin portal

### Helpers
- `lib/helpers/admin.ts` - Helper functions for admin operations

### Pages
- `app/admin/layout.tsx` - Admin portal layout
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/schools/new/page.tsx` - Create school page

### Components
- `components/admin/create-school-form.tsx` - School creation form

## Next Steps

### 1. Complete Admin Portal
- [ ] Schools list page (`/admin/schools/page.tsx`)
- [ ] School details page (`/admin/schools/[id]/page.tsx`)
- [ ] School edit page (`/admin/schools/[id]/edit/page.tsx`)
- [ ] Settings page (`/admin/settings/page.tsx`)
- [ ] Activity logs page

### 2. Authentication Pages
- [ ] Company admin login (`/auth/admin-login/page.tsx`)
- [ ] Separate from school login

### 3. School Instance Features
- [ ] Setup wizard for new schools
- [ ] Subscription management
- [ ] Usage analytics per school
- [ ] Billing integration

### 4. Enhanced Features
- [ ] Email notifications (welcome email to school admins)
- [ ] Subdomain SSL certificates
- [ ] School suspension/reactivation
- [ ] Data export for schools
- [ ] Multi-language support

## Testing Checklist

- [ ] Company admin can log in
- [ ] Company admin can create school
- [ ] Subdomain is properly validated
- [ ] School admin credentials are created
- [ ] School admin can log in at subdomain
- [ ] Tenant isolation works (can't see other schools' data)
- [ ] RLS policies are working
- [ ] Middleware routes correctly
- [ ] Admin activity is logged

## Troubleshooting

### Issue: Subdomain not working locally
**Solution**: Use /etc/hosts mapping or test with path-based routing first

### Issue: RLS policies blocking access
**Solution**: Check that user has proper member record with approved status

### Issue: Auth user created but can't login
**Solution**: Verify email confirmation is disabled or email is confirmed

### Issue: Tenant isolation not working
**Solution**: All queries must join with members table to get tenant_id

## Support

For questions or issues, contact: dev@nescomm.com
