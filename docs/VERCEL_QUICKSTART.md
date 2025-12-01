# Quick Start Guide - Nescomm ERP on Vercel Free Tier

## Your Current Setup ✅

- **Marketing Site**: https://nescomm.vercel.app
- **ERP Application**: https://web-nescomm.vercel.app
- **Database**: Supabase (same database for everything)
- **Hosting**: Vercel Free Tier

## Implementation Steps

### 1. Run Database Migration

Execute the admin portal schema in Supabase:

```sql
-- Go to Supabase Dashboard > SQL Editor
-- Copy and paste contents from: database/admin-portal-schema.sql
-- Click "Run"
```

This adds:
- `school_instances` table (tracks schools)
- `admin_activity_logs` table (audit trail)
- Uses existing `superadmin` role for Nescomm employees
- Uses existing `admin` role for school administrators
- RLS policies

**Storage Impact**: < 1 MB additional storage ✅

### 2. Create Your First Company Admin

In Supabase Dashboard:

1. **Authentication > Users** → Create new user
   - Email: `your-admin@nescomm.com`
   - Password: (your choice)
   - Confirm email (or disable email confirmation)

2. **SQL Editor** → Run this (replace the IDs):

```sql
-- Get the user ID (copy from Auth > Users)
-- Get Nescomm tenant ID
SELECT id FROM tenants WHERE domain = 'nescomm.com';
-- Get superadmin role ID
SELECT id FROM roles WHERE name = 'superadmin';

-- Create member record
INSERT INTO members (user_id, tenant_id, role_id, status)
VALUES (
  'your-user-id-here',
  'nescomm-tenant-id-here',
  'superadmin-role-id-here',
  'approved'
);
```

### 3. Deploy to Vercel

Your repo is already connected. Just:

```bash
git add .
git commit -m "Add admin portal"
git push
```

Vercel auto-deploys to `web-nescomm.vercel.app` ✅

### 4. Test the Admin Portal

1. Go to: `https://web-nescomm.vercel.app/admin`
2. Login with your company admin credentials
3. Create a test school:
   - Click "Schools" → "Create New School"
   - Fill in details
   - Click "Create School"

### 5. Test School Login

1. Use the school admin credentials you just created
2. Go to: `https://web-nescomm.vercel.app/auth/login`
3. Login → Should redirect to `/dashboard`
4. All existing ERP features work! (students, staff, admissions, etc.)

## How Tenant Isolation Works

### Single Domain, Multiple Schools

Instead of subdomains (dpsranchi.nescomm.com), you use:
- **Path-based routing**: All schools use `web-nescomm.vercel.app/dashboard`
- **Session-based tenant**: User's tenant determined by login
- **RLS filtering**: Database automatically filters by tenant_id

### Example Flow:

```
User: john@dpsranchi.com logs in
  ↓
System queries: members table
  ↓
Finds: user belongs to tenant "DPS Ranchi" (tenant_id: xxx)
  ↓
Stores in session/context
  ↓
All subsequent queries filtered by tenant_id
  ↓
User only sees DPS Ranchi data ✅
```

## Database Capacity Check

Your Supabase Free Tier has:
- **500 MB database storage**
- **2 GB bandwidth/month**

### Current Usage Estimate:

| Component | Storage |
|-----------|---------|
| Base schema (tenants, roles, members) | ~1 MB |
| Admin portal additions | ~1 MB |
| Per school (1000 students) | ~25-50 MB |
| **10 schools total** | **~300 MB** |

**You're good!** ✅ Can easily handle 10-15 schools on free tier.

## Access URLs

| User Type | Login URL | Dashboard | Role |
|-----------|-----------|-----------|------|
| Nescomm Employee (Superadmin) | `web-nescomm.vercel.app/auth/admin-login` | `/admin` | `superadmin` |
| School Admin | `web-nescomm.vercel.app/auth/login` | `/dashboard` | `admin` |
| Teachers | `web-nescomm.vercel.app/auth/login` | `/dashboard` | `teacher` |
| Students | `web-nescomm.vercel.app/auth/login` | `/dashboard` | `student` |

## Files to Create/Update

✅ **Already Created:**
- `database/admin-portal-schema.sql`
- `lib/types/admin.ts`
- `lib/helpers/admin.ts`
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/schools/new/page.tsx`
- `components/admin/create-school-form.tsx`

📝 **Still Need:**
- [ ] `app/admin/schools/page.tsx` (list all schools)
- [ ] `app/auth/admin-login/page.tsx` (company admin login)
- [ ] Tenant selector (if user belongs to multiple schools)

## Monitoring & Limits

### Supabase Dashboard
Monitor usage at: https://supabase.com/dashboard/project/_/settings/database

Watch:
- Database size
- Active connections
- Bandwidth usage

### When to Upgrade

Upgrade to Supabase Pro ($25/mo) when:
- Database > 400 MB (80% of 500 MB limit)
- > 15 schools
- Need more bandwidth

## Troubleshooting

### "Can't access /admin"
- Check user has `superadmin` role in members table
- Check RLS policies are enabled
- Check `isSuperAdmin()` helper function

### "School admin can't login"
- Verify email is confirmed in Supabase Auth
- Check member record exists with `school_admin` role
- Check status = 'approved'

### "Data from other schools visible"
- RLS policies not working
- Check all tables have tenant_id filtering
- Verify helper function `user_tenant_id()` exists

## Cost Breakdown (When Scaling)

| Tier | Database | Bandwidth | Price |
|------|----------|-----------|-------|
| **Free (Current)** | 500 MB | 2 GB | $0 |
| Supabase Pro | 8 GB | 50 GB | $25 |
| Vercel Pro | - | 100 GB | $20 |
| **Total Pro** | - | - | **$45/mo** |

Start free, upgrade when needed! 🚀

## Support

Questions? Check:
1. `docs/ADMIN_PORTAL_GUIDE.md` - Full documentation
2. Your existing schema: `database/complete-schema.sql`
3. RLS policies in Supabase Dashboard

---

**You're all set!** Your setup is perfect for starting with multiple schools on a single database. The architecture is solid and scalable. 🎉
