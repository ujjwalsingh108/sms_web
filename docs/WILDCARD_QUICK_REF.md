# Quick Reference - Per-School Subdomains

## 🎯 URL Structure

```
smartschoolerp.xyz                    → Homepage
admin.smartschoolerp.xyz              → Nescomm Superadmins
[school-name].smartschoolerp.xyz      → Individual School Login
```

## 🚀 Quick Setup (4 Steps)

### 1️⃣ DNS Configuration (Hostinger)
```
Type    Name    Value
──────────────────────────────────────────
A       @       76.76.21.21
A       www     76.76.21.21
CNAME   admin   cname.vercel-dns.com
CNAME   *       cname.vercel-dns.com  ← WILDCARD!
```

### 2️⃣ Upgrade Vercel to Pro
**Required**: Vercel Pro ($20/month) for wildcard subdomain support
- Vercel Dashboard → Settings → Billing → Upgrade to Pro

### 3️⃣ Add Domains to Vercel
```
smartschoolerp.xyz
www.smartschoolerp.xyz
admin.smartschoolerp.xyz
*.smartschoolerp.xyz  ← WILDCARD!
```

### 4️⃣ Deploy & Test
```powershell
git push origin staging
# Visit: admin.smartschoolerp.xyz
# Create school with subdomain: dps-ranchi
# Visit: dps-ranchi.smartschoolerp.xyz
```

---

## 📊 How It Works

### School Creation Flow

```
1. Superadmin creates school at admin.smartschoolerp.xyz
   ↓
2. Chooses subdomain: "dps-ranchi"
   ↓
3. Database creates:
   - Tenant (DPS Ranchi)
   - School instance (subdomain: dps-ranchi)
   - Admin user
   ↓
4. School is immediately accessible at:
   https://dps-ranchi.smartschoolerp.xyz
```

### User Login Flow

```
1. User visits: dps-ranchi.smartschoolerp.xyz
   ↓
2. Middleware extracts subdomain: "dps-ranchi"
   ↓
3. Sets header: x-school-subdomain=dps-ranchi
   ↓
4. getCurrentTenant() looks up tenant by subdomain
   ↓
5. RLS filters all queries by tenant_id
   ↓
6. User only sees DPS Ranchi's data
```

---

## 💰 Cost

| Service | Cost | Required |
|---------|------|----------|
| Domain (Hostinger) | $10/year | ✅ Yes |
| **Vercel Pro** | **$20/month** | **✅ Required for wildcard** |
| Supabase Free | $0/month | ✅ Yes (start here) |
| **Total** | **~$250/year** | |

**Upgrade Supabase to Pro ($25/month) when you have 10+ schools**

---

## 🔧 Key Files

```
database/
  └─ admin-portal-schema.sql      # Has subdomain column

lib/
  ├─ helpers/
  │   ├─ admin.ts                 # validateSubdomain(), getTenantBySubdomain()
  │   └─ tenant.ts                # getCurrentTenant() with subdomain detection
  └─ types/admin.ts               # SchoolInstance with subdomain field

middleware.ts                     # Wildcard subdomain routing

components/
  └─ admin/
      └─ create-school-form.tsx   # Subdomain input field
```

---

## ✅ Testing Checklist

### DNS & Vercel Setup
- [ ] Wildcard DNS added (`*` → `cname.vercel-dns.com`)
- [ ] Upgraded to Vercel Pro
- [ ] Wildcard domain added to Vercel (`*.smartschoolerp.xyz`)
- [ ] SSL certificates provisioned (🔒)

### Database & Auth
- [ ] Database migration completed
- [ ] First superadmin created
- [ ] Can login at `admin.smartschoolerp.xyz`

### School Creation
- [ ] Create test school (subdomain: test-school)
- [ ] School accessible at `test-school.smartschoolerp.xyz`
- [ ] School admin can login
- [ ] School admin sees only their data

### Isolation Testing
- [ ] Create 2 schools with different subdomains
- [ ] Login to School A → sees only School A data
- [ ] Login to School B → sees only School B data
- [ ] Data is completely isolated

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Wildcard domain not working | Upgrade to Vercel Pro ($20/month) |
| School subdomain shows 404 | Check wildcard DNS (`*`) exists |
| SSL error on school subdomain | Wait 10 mins for SSL provisioning |
| User sees wrong school's data | Check `x-school-subdomain` header |
| "No tenant access" error | Verify user in members table for that tenant |

---

## 📝 Subdomain Rules

### ✅ Valid
- `dps-ranchi` (lowercase, hyphens)
- `st-josephs` (lowercase, hyphens)
- `school123` (alphanumeric)

### ❌ Invalid
- `DPS Ranchi` (spaces not allowed)
- `dps_ranchi` (underscores not allowed)
- `admin` (reserved)
- `-dps` (cannot start with hyphen)

---

## 🎓 Example Schools

```
DPS Ranchi          → dps-ranchi.smartschoolerp.xyz
St. Joseph's        → st-josephs.smartschoolerp.xyz
Mount Carmel        → mount-carmel.smartschoolerp.xyz
Delhi Public School → delhi-public-school.smartschoolerp.xyz
```

---

## 🔗 Documentation

- **Full Setup**: `docs/WILDCARD_SUBDOMAIN_SETUP.md`
- **Schema Changes**: `docs/SCHEMA_CHANGES.md`
- **Role System**: `docs/ROLE_IMPLEMENTATION.md`

---

✨ **Each school gets its own professional subdomain!** Perfect for true SaaS multi-tenancy.
