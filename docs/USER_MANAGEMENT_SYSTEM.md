# User Management System - Implementation Guide

## Overview
This system allows school admins to create user accounts (staff, students, parents) with auto-generated credentials without requiring email verification.

## Features Implemented

### 1. Database Schema Updates
**File:** `database/migrations/add-user-management-schema.sql`

Added:
- `user_id` column to `students` table for student portal access
- `user_id` column to `guardians` table for parent portal access  
- `staff_type` column to `staff` table (already had `user_id`)
- Staff types: teacher, principal, vice_principal, clerk, librarian, driver, security, nurse, accountant, lab_assistant, sports_coach, counselor, other

### 2. Server Actions
**File:** `lib/actions/user-management.ts`

Implemented server actions for:

#### Create Staff Member
```typescript
createStaffMember(input: CreateStaffInput)
```
- Creates auth user with service role key (no email verification)
- Auto-generates secure password
- Creates staff record with user_id link
- Creates member record for tenant access
- Returns credentials for admin to share

#### Create Student
```typescript
createStudent(input: CreateStudentInput)
```
- Optional login access creation
- Creates auth user if `createLoginAccess` is true
- Auto-generates secure password
- Creates student record with optional user_id link
- Creates member record if login access is created
- Returns credentials if login was created

#### Create Guardian/Parent
```typescript
createGuardian(input: CreateGuardianInput)
```
- Optional login access creation
- Links guardian to specific student
- Creates auth user if `createLoginAccess` is true
- Auto-generates secure password
- Creates guardian record with optional user_id link
- Returns credentials if login was created

### 3. UI Components

#### Staff Creation Form
**File:** `components/staff/create-staff-form.tsx`
- Full form for creating staff members
- All staff types supported
- Displays credentials after creation
- Copy to clipboard functionality
- Responsive dialog design

#### Credentials Display
**File:** `components/common/credentials-display.tsx`
- Reusable component for showing generated credentials
- Copy to clipboard for email and password
- Download credentials as text file
- Warning message about saving credentials

## Setup Instructions

### 1. Run Database Migration
```sql
-- Run this file in your Supabase SQL editor
database/migrations/add-user-management-schema.sql
```

### 2. Environment Variables
Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Required for user creation
```

⚠️ **Important:** Never expose the service role key in client-side code!

### 3. Ensure Required Roles Exist
Make sure these roles are in your `roles` table:
- `staff` - For all staff members
- `student` - For students with portal access
- `parent` - For guardians/parents with portal access
- `admin` - For school administrators
- `superadmin` - For company administrators

## Usage Examples

### Adding Staff from School Admin Dashboard

```tsx
import { CreateStaffForm } from "@/components/staff/create-staff-form";

function StaffManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCreateForm(true)}>
        Add Staff Member
      </Button>

      <CreateStaffForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSuccess={() => {
          // Refresh staff list
          router.refresh();
        }}
      />
    </>
  );
}
```

### Using Server Actions Directly

```tsx
import { createStaffMember } from "@/lib/actions/user-management";

const result = await createStaffMember({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@school.com",
  employeeId: "EMP001",
  staffType: "teacher",
  phone: "+1234567890",
  designation: "Mathematics Teacher",
  department: "Science",
});

if (result.success) {
  console.log("Staff created:", result.data.staff);
  console.log("Email:", result.data.credentials.email);
  console.log("Password:", result.data.credentials.password);
}
```

### Creating Student with Login Access

```tsx
import { createStudent } from "@/lib/actions/user-management";

const result = await createStudent({
  admissionNo: "STU2024001",
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@student.school.com",
  createLoginAccess: true,  // Enable login
  classId: "class-uuid",
  sectionId: "section-uuid",
});

if (result.success && result.data.credentials) {
  // Credentials available to share with student/parent
  console.log("Student credentials:", result.data.credentials);
}
```

### Creating Parent/Guardian with Portal Access

```tsx
import { createGuardian } from "@/lib/actions/user-management";

const result = await createGuardian({
  studentId: "student-uuid",
  name: "Robert Smith",
  relationship: "Father",
  email: "robert.smith@parent.com",
  phone: "+1234567890",
  createLoginAccess: true,  // Enable parent portal access
  isPrimary: true,
});

if (result.success && result.data.credentials) {
  // Share credentials with parent
  console.log("Parent credentials:", result.data.credentials);
}
```

## Security Considerations

### 1. Service Role Key
- Only used in server actions
- Never exposed to client
- Has full database access - handle with care

### 2. Password Generation
- Generates 12-character random passwords
- Includes uppercase, lowercase, numbers, and special characters
- Users can change password after first login (implement password change feature)

### 3. Auto-Confirmation
- `email_confirm: true` bypasses email verification
- Users can login immediately
- Consider implementing email verification for password resets

### 4. Permissions
- Only users with `admin` or `superadmin` roles can create users
- Checks tenant membership before creating users
- All created users are auto-approved in members table

## Integration Points

### Where to Add Forms

#### 1. Staff Management Page
**Path:** `app/dashboard/staff/page.tsx`
```tsx
import { CreateStaffForm } from "@/components/staff/create-staff-form";
// Add button to open form
```

#### 2. Student Management Page
**Path:** `app/dashboard/students/page.tsx`
```tsx
// Update existing create student workflow to use new actions
import { createStudent } from "@/lib/actions/user-management";
```

#### 3. Parent/Guardian Management
**Path:** Can be integrated into student details page
```tsx
import { createGuardian } from "@/lib/actions/user-management";
// Add "Add Parent" button on student detail page
```

## Next Steps

### 1. Implement Password Change Feature
Allow users to change their auto-generated password on first login.

### 2. Bulk Import
Create CSV import functionality using the same server actions:
```tsx
// Example bulk import
const results = await Promise.all(
  csvData.map(row => createStaffMember(row))
);
```

### 3. Notification System
- Email credentials to users (optional)
- SMS credentials (optional)
- In-app notifications

### 4. User Portal Pages
Create separate portal pages for:
- Staff portal (`/staff-portal`)
- Student portal (`/student-portal`)
- Parent portal (`/parent-portal`)

### 5. Audit Logging
Track who created which users and when.

## Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY is not set"
- Add the service role key to `.env.local`
- Restart your development server

### Error: "Staff role not found in database"
- Ensure roles table has required roles
- Check role names match exactly (case-sensitive)

### Error: "Only admins can create users"
- Verify current user has admin/superadmin role
- Check members table for proper role assignment

### Users can't login after creation
- Verify auth.users table has the user
- Check member record exists with correct tenant_id
- Ensure credentials were shared correctly

## API Reference

### CreateStaffInput
```typescript
interface CreateStaffInput {
  firstName: string;              // Required
  lastName: string;               // Required
  email: string;                  // Required (must be unique)
  phone?: string;
  dateOfBirth?: string;          // ISO date format
  gender?: "male" | "female" | "other";
  address?: string;
  qualification?: string;
  designation?: string;
  department?: string;
  staffType: string;             // Required (teacher, librarian, etc.)
  dateOfJoining?: string;        // ISO date format
  salary?: number;
  employeeId: string;            // Required (must be unique per tenant)
}
```

### CreateStudentInput
```typescript
interface CreateStudentInput {
  admissionNo: string;           // Required (unique per tenant)
  firstName: string;             // Required
  lastName: string;              // Required
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  bloodGroup?: string;
  email?: string;                // Required if createLoginAccess is true
  phone?: string;
  address?: string;
  classId?: string;
  sectionId?: string;
  admissionDate?: string;
  createLoginAccess?: boolean;   // Default: false
}
```

### CreateGuardianInput
```typescript
interface CreateGuardianInput {
  studentId: string;             // Required (must be valid student ID)
  name: string;                  // Required
  relationship?: string;
  phone?: string;
  email?: string;                // Required if createLoginAccess is true
  occupation?: string;
  address?: string;
  isPrimary?: boolean;           // Default: false
  createLoginAccess?: boolean;   // Default: false
}
```

## Support
For issues or questions, refer to:
- Database schema: `database/complete-schema.sql`
- RLS policies: `database/rls-policies-complete.sql`
- Admin portal docs: `docs/ADMIN_PORTAL_GUIDE.md`
