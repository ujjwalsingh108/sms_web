# Role Assignment Summary

## ✅ Implementation Complete

The system now correctly uses your existing roles from the roles table:

### Role Mapping

| User Type | Role Name | Display Name | Description |
|-----------|-----------|--------------|-------------|
| **Nescomm Employees** | `superadmin` | Super Admin | Full system access - can manage all schools |
| **School Administrators** | `admin` | Admin | School administrator - full access to their school's ERP |
| Teachers | `teacher` | Teacher | Teaching staff |
| Students | `student` | Student | Student user |
| Parents | `parent` | Parent | Student parent/guardian |
| Accountants | `accountant` | Accountant | Finance and accounts |
| Drivers | `driver` | Driver | Transport driver |
| Librarians | `librarian` | Librarian | Library management |

## How It Works

### 1. Nescomm Employee Registration
When a Nescomm employee registers on the admin portal:
- They are assigned the **`superadmin`** role
- This gives them access to `/admin` portal
- They can create and manage all schools

### 2. School Creation by Superadmin
When a superadmin creates a new school:
```typescript
// Creates new user with these credentials
Email: school-admin@example.com
Password: (provided by superadmin)

// Assigns role: 'admin' (NOT 'school_admin')
Role: admin

// Links to school's tenant
Tenant: DPS Ranchi (or whichever school)
```

### 3. School Admin Login
When the school admin logs in:
- Uses credentials provided by Nescomm superadmin
- Has **`admin`** role (full access to their school)
- Can manage students, teachers, staff, etc.
- Cannot see other schools' data (tenant isolation)

## Code Implementation

### Database Schema (`admin-portal-schema.sql`)
```sql
-- Uses existing 'superadmin' role for Nescomm employees
-- Uses existing 'admin' role for school administrators

-- RLS Policies use 'superadmin' role
CREATE POLICY "Superadmins can view all schools"
  ON school_instances FOR SELECT
  WHERE role.name = 'superadmin';
```

### School Creation Form (`create-school-form.tsx`)
```typescript
// Get 'admin' role for school administrator
const { data: adminRole } = await supabase
  .from("roles")
  .select("id")
  .eq("name", "admin")  // Uses 'admin' role
  .single();

// Create member with admin role
await supabase.from("members").insert({
  user_id: authData.user.id,
  tenant_id: tenant.id,
  role_id: adminRole.id,  // admin role ID
  status: "approved",
});
```

### Helper Functions (`lib/helpers/admin.ts`)
```typescript
// Check if user is superadmin (Nescomm employee)
export async function isSuperAdmin(): Promise<boolean> {
  // ...
  return member.role.name === "superadmin";
}

// Alias for backward compatibility
export async function isCompanyAdmin(): Promise<boolean> {
  return isSuperAdmin();
}
```

## Access Control

### Superadmin Access
```typescript
// In admin layout
const isAdmin = await isCompanyAdmin(); // checks for 'superadmin' role
if (!isAdmin) {
  redirect("/dashboard");
}
```

### Admin Access
School admins automatically get access based on:
1. Having `admin` role in members table
2. Being linked to their school's tenant
3. RLS policies filtering data by tenant_id

## Testing

### Test Superadmin Creation
```sql
-- 1. Create user in Supabase Auth
-- 2. Get IDs
SELECT id FROM tenants WHERE domain = 'nescomm.com';
SELECT id FROM roles WHERE name = 'superadmin';

-- 3. Create member record
INSERT INTO members (user_id, tenant_id, role_id, status)
VALUES (
  'user-id-from-auth',
  'nescomm-tenant-id',
  'superadmin-role-id',
  'approved'
);
```

### Test School Admin Creation
1. Login as superadmin
2. Go to `/admin/schools/new`
3. Create school with admin credentials
4. System automatically assigns `admin` role
5. School admin can login and access their school

## Migration Notes

If you had any test data with old roles:
```sql
-- Update old company_admin to superadmin
UPDATE members m
SET role_id = (SELECT id FROM roles WHERE name = 'superadmin')
WHERE role_id IN (SELECT id FROM roles WHERE name = 'company_admin');

-- Update old school_admin to admin
UPDATE members m
SET role_id = (SELECT id FROM roles WHERE name = 'admin')
WHERE role_id IN (SELECT id FROM roles WHERE name = 'school_admin');

-- Clean up old roles (if they exist)
DELETE FROM roles WHERE name IN ('company_admin', 'school_admin');
```

## Summary

✅ **Superadmins**: Nescomm employees managing the platform  
✅ **Admins**: School administrators with full school ERP access  
✅ **Other roles**: Teachers, students, etc. remain unchanged  
✅ **No new roles created**: Uses your existing role structure  
✅ **RLS policies updated**: Use 'superadmin' instead of 'company_admin'  
✅ **Forms updated**: Assign 'admin' role to school administrators  
✅ **Helper functions updated**: Check for 'superadmin' role  

The implementation now correctly matches your existing roles table! 🎉
