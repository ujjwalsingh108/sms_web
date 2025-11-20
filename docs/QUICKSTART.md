# Quick Start Guide

This guide will help you set up your School ERP system in 10 minutes.

## Prerequisites
- ✅ Node.js 18+ installed
- ✅ A Supabase account (free)

## Step 1: Clone and Install (2 minutes)

\`\`\`bash
# Navigate to project
cd sms_web

# Install dependencies
npm install
\`\`\`

## Step 2: Set Up Supabase (3 minutes)

1. **Create Project**: Go to [supabase.com](https://supabase.com) → New Project
2. **Run Schema**: 
   - Open SQL Editor in Supabase
   - Copy & run: `database/schema.sql`
   - Copy & run: `database/rls-policies.sql`
3. **Create Roles**: Run this SQL:

\`\`\`sql
INSERT INTO public.roles (name, display_name, description) VALUES
  ('superadmin', 'Super Admin', 'Full system access'),
  ('admin', 'Admin', 'School administrator'),
  ('teacher', 'Teacher', 'Teaching staff'),
  ('accountant', 'Accountant', 'Finance and accounts'),
  ('librarian', 'Librarian', 'Library management'),
  ('parent', 'Parent', 'Student parent/guardian'),
  ('student', 'Student', 'Student user'),
  ('driver', 'Driver', 'Transport driver');
\`\`\`

## Step 3: Configure Environment (1 minute)

Create `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
\`\`\`

Get these from: Supabase Dashboard → Settings → API

## Step 4: Start Development Server (1 minute)

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Create First User (3 minutes)

### A. Sign Up
1. Click "Create Account"
2. Enter your email and password
3. Verify email (check inbox)

### B. Create School & Link User

Run this in Supabase SQL Editor:

\`\`\`sql
-- 1. Get your user ID (replace email)
SELECT id, email FROM auth.users WHERE email = 'youremail@example.com';
-- Copy the ID shown

-- 2. Create your school
INSERT INTO public.tenants (name, email, phone, created_by)
VALUES (
  'My School Name',
  'school@example.com',
  '+1234567890',
  'paste-user-id-here'
)
RETURNING id;
-- Copy the tenant ID shown

-- 3. Get superadmin role ID
SELECT id FROM public.roles WHERE name = 'superadmin';
-- Copy the role ID shown

-- 4. Link user as superadmin
INSERT INTO public.members (user_id, tenant_id, role_id, status)
VALUES (
  'paste-user-id-here',
  'paste-tenant-id-here',
  'paste-role-id-here',
  'approved'
);
\`\`\`

### C. Login
- Go to login page
- Enter your credentials
- You now have full admin access! 🎉

## Step 6: Add Sample Data (Optional)

### Create Classes
\`\`\`sql
INSERT INTO public.classes (tenant_id, name) VALUES
  ('your-tenant-id', 'Class 1'),
  ('your-tenant-id', 'Class 2'),
  ('your-tenant-id', 'Class 3');
\`\`\`

### Create Sections
\`\`\`sql
-- First get class ID
SELECT id FROM public.classes WHERE name = 'Class 1';

-- Then create sections
INSERT INTO public.sections (tenant_id, class_id, name, capacity) VALUES
  ('your-tenant-id', 'class-id', 'A', 40),
  ('your-tenant-id', 'class-id', 'B', 40);
\`\`\`

## Quick Reference

### Available Routes
- `/` - Home page
- `/login` - Login
- `/signup` - Sign up
- `/dashboard` - Main dashboard
- `/dashboard/students` - Student management
- `/dashboard/staff` - Staff management
- `/dashboard/fees` - Fee management
- `/dashboard/library` - Library management
- `/dashboard/transport` - Transport management
- `/dashboard/exams` - Examination management
- `/dashboard/attendance` - Attendance tracking
- `/dashboard/timetable` - Timetable management
- `/dashboard/inventory` - Inventory management
- `/dashboard/accounts` - Accounts management
- `/dashboard/hostel` - Hostel management
- `/dashboard/infirmary` - Medical records
- `/dashboard/security` - Visitor management

### User Roles Access Matrix

| Module | Super Admin | Admin | Teacher | Accountant | Librarian | Parent | Student | Driver |
|--------|------------|-------|---------|-----------|-----------|--------|---------|--------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Students | ✅ | ✅ | ✅ | ❌ | ❌ | View Own | View Own | ❌ |
| Staff | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Fees | ✅ | ✅ | ❌ | ✅ | ❌ | View Own | View Own | ❌ |
| Library | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Exams | ✅ | ✅ | ✅ | ❌ | ❌ | View Own | View Own | ❌ |
| Attendance | ✅ | ✅ | ✅ | ❌ | ❌ | View Own | View Own | ❌ |
| Transport | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Common Commands

\`\`\`bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
\`\`\`

## Troubleshooting

**Can't login?**
- Check if user is verified (check email)
- Verify member record exists with 'approved' status

**No data showing?**
- Ensure RLS policies are applied
- Check if user has correct role

**Build errors?**
- Delete `.next` folder
- Run `npm install` again

## Next Steps

1. ✅ Customize school name and branding
2. ✅ Add classes and sections
3. ✅ Create fee structures
4. ✅ Add staff members
5. ✅ Enroll students
6. ✅ Start using modules

## Support

- 📖 Full Documentation: `README.md`
- 🔧 Setup Guide: `SETUP_GUIDE.md`
- 💾 Database Schema: `database/schema.sql`

---

**You're all set! Start managing your school efficiently.** 🚀
