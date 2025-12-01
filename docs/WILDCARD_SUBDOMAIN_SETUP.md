# Wildcard Subdomain Setup - smartschoolerp.xyz

## 🎯 Architecture Overview

Your ERP system uses **per-school subdomains** for true multi-tenant isolation:

```
admin.smartschoolerp.xyz          → Nescomm Superadmins
dps-ranchi.smartschoolerp.xyz     → DPS Ranchi School
st-josephs.smartschoolerp.xyz     → St. Joseph's School
mount-carmel.smartschoolerp.xyz   → Mount Carmel School
```

Each school gets its own unique subdomain!

---

## 📋 Prerequisites

1. **Domain**: smartschoolerp.xyz (purchased from Hostinger)
2. **Vercel Account**: For hosting the Next.js application
3. **Supabase Account**: For database
4. **Vercel Pro Plan**: **REQUIRED** for wildcard subdomain support

> ⚠️ **Important**: Vercel's free tier does NOT support wildcard subdomains. You MUST upgrade to Vercel Pro ($20/month) to use `*.smartschoolerp.xyz`.

---

## Step 1: Configure DNS (Hostinger)

### DNS Records

Login to Hostinger → Domains → smartschoolerp.xyz → DNS Zone

```
Type    Name    Value                   TTL     Purpose
──────────────────────────────────────────────────────────────────────────────────
A       @       76.76.21.21            3600    Root domain
A       www     76.76.21.21            3600    www subdomain
CNAME   admin   cname.vercel-dns.com   3600    Admin portal
CNAME   *       cname.vercel-dns.com   3600    WILDCARD for all schools
```

### ⚠️ Critical: Wildcard CNAME

The wildcard CNAME record (`*`) is what enables per-school subdomains:
- `dps-ranchi.smartschoolerp.xyz` → Automatically routes to Vercel
- `any-school.smartschoolerp.xyz` → Automatically routes to Vercel
- **No need to add DNS for each new school!**

### Verification

Wait 5-30 minutes for DNS propagation, then test:

```powershell
nslookup admin.smartschoolerp.xyz
nslookup dps-ranchi.smartschoolerp.xyz  
nslookup test.smartschoolerp.xyz

# All should return: 76.76.21.21
```

---

## Step 2: Upgrade to Vercel Pro

### Why Pro is Required

Vercel pricing tiers for wildcard subdomains:
- ❌ **Hobby (Free)**: Max 50 domains, NO wildcard support
- ✅ **Pro ($20/month)**: Unlimited domains, wildcard subdomain support
- ✅ **Enterprise**: Custom pricing

### Upgrade Steps

1. Go to Vercel Dashboard → Settings → Billing
2. Click "Upgrade to Pro"
3. Enter payment details
4. Confirm upgrade

**Cost**: $20/month (billed monthly)

---

## Step 3: Configure Vercel Domains

### Add Wildcard Domain

1. Go to Your Project → Settings → Domains
2. Click "Add Domain"
3. Add these domains one by one:

```
smartschoolerp.xyz          (root domain for homepage)
www.smartschoolerp.xyz      (www subdomain)
admin.smartschoolerp.xyz    (admin portal)
*.smartschoolerp.xyz        (wildcard for all schools)
```

**⚠️ Critical**: The wildcard domain `*.smartschoolerp.xyz` is what enables per-school routing.

### Verify DNS

Vercel will automatically verify DNS. You should see:
- ✅ smartschoolerp.xyz - Valid Configuration
- ✅ www.smartschoolerp.xyz - Valid Configuration  
- ✅ admin.smartschoolerp.xyz - Valid Configuration
- ✅ *.smartschoolerp.xyz - Valid Configuration

Wait 5-10 minutes for SSL certificates to provision.

---

## Step 4: Environment Variables

Add to Vercel Project → Settings → Environment Variables:

```env
# Domain configuration
NEXT_PUBLIC_HOMEPAGE_URL=https://smartschoolerp.xyz
NEXT_PUBLIC_ADMIN_URL=https://admin.smartschoolerp.xyz

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Apply to: **Production, Preview, Development**

---

## Step 5: Run Database Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `database/admin-portal-schema.sql`
3. Click **Run**

This creates:
- `school_instances` table (with subdomain column)
- `admin_activity_logs` table
- RLS policies
- Indexes
- Nescomm parent tenant

---

## Step 6: Create First Superadmin

### Method 1: Supabase Dashboard (Recommended)

1. **Create Auth User**:
   - Supabase → Authentication → Users → "Add user"
   - Email: `your-email@smartschoolerp.xyz`
   - Password: Choose strong password
   - Auto Confirm User: ✅ ON
   - Copy the **User ID**

2. **Link to Nescomm Tenant**:
   - Go to SQL Editor
   - Run this SQL (replace IDs):

```sql
-- Get IDs
SELECT id FROM tenants WHERE domain = 'smartschoolerp.xyz';
SELECT id FROM roles WHERE name = 'superadmin';

-- Create member (replace with your IDs)
INSERT INTO members (user_id, tenant_id, role_id, status)
VALUES (
  'user-id-from-auth',
  'nescomm-tenant-id',
  'superadmin-role-id',
  'approved'
);
```

---

## Step 7: Deploy to Vercel

```powershell
# Commit changes
git add .
git commit -m "Add wildcard subdomain support"
git push origin staging

# Vercel auto-deploys
```

---

## Step 8: Test the Setup

### Test 1: Admin Portal

1. Visit `https://admin.smartschoolerp.xyz`
2. Should redirect to login
3. Login with superadmin credentials
4. Should see admin dashboard

### Test 2: Create a School

1. In admin portal, go to "Schools" → "Create School"
2. Fill in:
   - School Name: `DPS Ranchi`
   - Subdomain: `dps-ranchi`
   - Admin Email: `admin@dpsranchi.com`
   - Password: `test123`
3. Click "Create School"

### Test 3: Access School Subdomain

1. Visit `https://dps-ranchi.smartschoolerp.xyz`
2. Should redirect to login page
3. Login with school admin credentials
4. Should see school dashboard with DPS Ranchi data only

### Test 4: Create Another School

1. Back to admin portal
2. Create another school:
   - School Name: `St. Joseph's`
   - Subdomain: `st-josephs`
3. Visit `https://st-josephs.smartschoolerp.xyz`
4. Each school is completely isolated!

---

## How It Works

### URL Routing

```
┌─────────────────────────────────────────────────────────────┐
│  smartschoolerp.xyz → Homepage (marketing)                  │
├─────────────────────────────────────────────────────────────┤
│  admin.smartschoolerp.xyz → /admin (Nescomm portal)         │
├─────────────────────────────────────────────────────────────┤
│  dps-ranchi.smartschoolerp.xyz → /dashboard (DPS Ranchi)    │
│  └─ Middleware detects subdomain: "dps-ranchi"              │
│  └─ Sets header: x-school-subdomain=dps-ranchi              │
│  └─ getCurrentTenant() looks up tenant by subdomain         │
│  └─ RLS automatically filters by tenant_id                  │
├─────────────────────────────────────────────────────────────┤
│  st-josephs.smartschoolerp.xyz → /dashboard (St. Joseph's)  │
│  └─ Same process, different subdomain                       │
└─────────────────────────────────────────────────────────────┘
```

### Middleware Logic

```typescript
// middleware.ts extracts subdomain from hostname
const subdomain = hostname.split(".")[0];

if (subdomain === "admin") {
  // Route to /admin pages
} else if (subdomain !== "www") {
  // It's a school subdomain
  // Add to headers: x-school-subdomain
  // Route to /dashboard
}
```

### Tenant Detection

```typescript
// lib/helpers/tenant.ts
export async function getCurrentTenant() {
  const subdomain = headers().get("x-school-subdomain");
  
  if (subdomain) {
    // Lookup school by subdomain
    const school = await getTenantBySubdomain(subdomain);
    
    // Verify user belongs to this school
    // Return tenant info
  }
}
```

### RLS Isolation

```sql
-- Automatic tenant filtering
-- When user from dps-ranchi.smartschoolerp.xyz queries:
SELECT * FROM students;

-- RLS automatically adds:
WHERE tenant_id = 'dps-ranchi-tenant-id'

-- User only sees their school's data!
```

---

## Cost Breakdown

| Service | Plan | Cost | Reason |
|---------|------|------|--------|
| Hostinger Domain | Annual | $9.99/year | smartschoolerp.xyz |
| **Vercel Pro** | **Monthly** | **$20/month** | **Wildcard subdomain support** |
| Supabase | Free | $0/month | 500 MB database |
| **Total** | | **$250/year** | $10 domain + $240 Vercel Pro |

### When to Upgrade Supabase

- **Free tier**: 500 MB database, 2 GB bandwidth → ~10 schools
- **Pro tier** ($25/month): 8 GB database, 50 GB bandwidth → 100+ schools

---

## Subdomain Rules

### Valid Subdomains

✅ `dps-ranchi` → dps-ranchi.smartschoolerp.xyz  
✅ `st-josephs` → st-josephs.smartschoolerp.xyz  
✅ `mount-carmel-school` → mount-carmel-school.smartschoolerp.xyz  
✅ `school123` → school123.smartschoolerp.xyz  

### Invalid Subdomains

❌ `DPS Ranchi` (spaces not allowed)  
❌ `dps_ranchi` (underscores not allowed)  
❌ `-dps` (cannot start with hyphen)  
❌ `dps-` (cannot end with hyphen)  
❌ `admin` (reserved)  
❌ `www` (reserved)  
❌ `api` (reserved)  

### Validation

```typescript
// Enforced in validateSubdomain()
- Length: 3-63 characters
- Characters: lowercase letters, numbers, hyphens
- Format: must start/end with alphanumeric
- Reserved: admin, www, api, mail, ftp, etc.
```

---

## Troubleshooting

### Wildcard domain not working

**Error**: `*.smartschoolerp.xyz` shows "Domain not configured"

**Solution**:
1. Verify you're on Vercel Pro (check Settings → Billing)
2. Ensure wildcard DNS record exists in Hostinger (`*` → `cname.vercel-dns.com`)
3. Re-add the wildcard domain in Vercel
4. Wait 10 minutes for DNS + SSL propagation

### School subdomain shows 404

**Error**: `dps-ranchi.smartschoolerp.xyz` returns 404

**Solution**:
1. Check if wildcard domain is added to Vercel (`*.smartschoolerp.xyz`)
2. Verify DNS wildcard record exists
3. Clear browser cache
4. Check middleware.ts is deployed

### User can't login to school

**Error**: User logs in but sees "No tenant access"

**Solution**:
1. Check school_instances table - verify subdomain exists
2. Check members table - verify user is linked to tenant
3. Verify RLS policies are enabled
4. Check `x-school-subdomain` header is being set (dev tools → Network)

### SSL certificate error

**Error**: Browser shows "Not Secure" for school subdomain

**Solution**:
1. Vercel Pro provisions SSL for wildcard domains automatically
2. Wait 10-15 minutes after adding domain
3. If stuck, remove and re-add `*.smartschoolerp.xyz` in Vercel
4. Check Vercel Dashboard → Domains → SSL Status

---

## FAQ

### Q: Do I need to add DNS for each new school?

**A**: No! The wildcard DNS (`*`) handles ALL school subdomains automatically. Just create the school in the admin portal, and the subdomain works immediately.

### Q: Can I use Vercel free tier?

**A**: No. Wildcard subdomains (`*.smartschoolerp.xyz`) require Vercel Pro ($20/month). The free tier only supports specific domains.

### Q: How many schools can I have?

**A**: Unlimited! Wildcard DNS supports infinite subdomains. Limits are:
- Database: Supabase free tier ~10 schools, Pro tier ~100 schools
- Bandwidth: Based on your usage

### Q: Can I use a different domain provider?

**A**: Yes! The DNS setup works with any provider (Namecheap, GoDaddy, Cloudflare, etc.). Just add the same DNS records.

### Q: What if I already have schools created?

**A**: Your existing schools will work immediately. Each school's tenant already has a domain field. The middleware will detect the subdomain and route correctly.

### Q: Can users belong to multiple schools?

**A**: Yes! A user can have multiple entries in the `members` table (different tenants). The subdomain determines which school's data they see.

---

## Next Steps

1. ✅ Configure wildcard DNS in Hostinger
2. ✅ Upgrade to Vercel Pro
3. ✅ Add wildcard domain to Vercel
4. ✅ Run database migration
5. ✅ Create first superadmin
6. ✅ Deploy to Vercel
7. 🎉 Create schools with unique subdomains!

---

## Support Resources

- **Vercel Wildcard Domains**: https://vercel.com/docs/concepts/projects/domains/wildcard-domains
- **Hostinger DNS**: https://support.hostinger.com/en/articles/1583227
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security

---

✅ **You're all set!** Each school now gets its own professional subdomain like `school-name.smartschoolerp.xyz`. Perfect for true SaaS multi-tenancy!
