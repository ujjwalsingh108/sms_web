# School ERP Setup Guide

## Complete Installation and Setup Instructions

### Step 1: Prerequisites

Ensure you have the following installed:
- Node.js 18 or higher
- npm or yarn
- Git
- A Supabase account (free tier works)

### Step 2: Supabase Project Setup

1. **Create a New Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in the project details:
     - Name: "School ERP" (or your school name)
     - Database Password: Create a strong password
     - Region: Choose closest to your location
   - Click "Create new project"
   - Wait for the project to be provisioned (2-3 minutes)

2. **Run Database Schema**
   - Navigate to the SQL Editor in your Supabase dashboard
   - Copy the entire contents of `database/schema.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute
   - This will create all tables, indexes, and enable Row Level Security

3. **Insert Default Roles**
   Run this SQL separately to create initial roles:

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

4. **Get API Credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy the following:
     - Project URL
     - anon/public key

### Step 3: Local Development Setup

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials:
   
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - You should see the landing page

### Step 4: Create Your First User and Tenant

1. **Sign Up**
   - Click "Create Account" on the home page
   - Enter your email, name, and password
   - Check your email for verification link
   - Click the verification link

2. **Create a Tenant (School)**
   Run this SQL in Supabase SQL Editor (replace email with your signup email):

   \`\`\`sql
   -- First, get your user ID
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

   -- Create a tenant (school)
   INSERT INTO public.tenants (name, email, phone, address, created_by)
   VALUES (
     'Your School Name',
     'school@example.com',
     '+1234567890',
     'School Address',
     'your-user-id-from-above'
   )
   RETURNING id;

   -- Get the superadmin role ID
   SELECT id FROM public.roles WHERE name = 'superadmin';

   -- Link your user to the tenant as superadmin
   INSERT INTO public.members (user_id, tenant_id, role_id, status)
   VALUES (
     'your-user-id',
     'tenant-id-from-above',
     'superadmin-role-id',
     'approved'
   );
   \`\`\`

3. **Login**
   - Go to the login page
   - Enter your credentials
   - You should now have access to the full dashboard

### Step 5: Initial Data Setup

1. **Create Classes**
   \`\`\`sql
   INSERT INTO public.classes (tenant_id, name, description)
   VALUES 
     ('your-tenant-id', 'Class 1', 'First Grade'),
     ('your-tenant-id', 'Class 2', 'Second Grade'),
     ('your-tenant-id', 'Class 3', 'Third Grade');
   \`\`\`

2. **Create Sections**
   \`\`\`sql
   -- Get class IDs first
   SELECT id, name FROM public.classes WHERE tenant_id = 'your-tenant-id';

   -- Create sections for each class
   INSERT INTO public.sections (tenant_id, class_id, name, capacity)
   VALUES 
     ('your-tenant-id', 'class-1-id', 'A', 40),
     ('your-tenant-id', 'class-1-id', 'B', 40);
   \`\`\`

3. **Create Subjects**
   \`\`\`sql
   INSERT INTO public.subjects (tenant_id, name, code)
   VALUES 
     ('your-tenant-id', 'Mathematics', 'MATH'),
     ('your-tenant-id', 'English', 'ENG'),
     ('your-tenant-id', 'Science', 'SCI');
   \`\`\`

### Step 6: Configure Row Level Security Policies

For each table, you'll need to create RLS policies. Here's an example for the students table:

\`\`\`sql
-- Policy: Users can only access data from their tenant
CREATE POLICY "Users can view students from their tenant"
ON public.students
FOR SELECT
TO authenticated
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
    AND status = 'approved'
  )
);

CREATE POLICY "Admins can insert students"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id IN (
    SELECT m.tenant_id FROM public.members m
    JOIN public.roles r ON m.role_id = r.id
    WHERE m.user_id = auth.uid()
    AND m.status = 'approved'
    AND r.name IN ('superadmin', 'admin')
  )
);
\`\`\`

Repeat similar policies for all other tables.

### Step 7: Test the Application

1. **Login** as your superadmin user
2. **Navigate** to each module:
   - Dashboard - Should show statistics
   - Students - Add a test student
   - Staff - Add a test staff member
   - Fees - Create a fee structure and collect payment
   - Library - Add books
   - And so on...

## Common Issues and Solutions

### Issue 1: "User does not have access to any organization"
**Solution**: Make sure you've created a member record linking your user to a tenant with approved status.

### Issue 2: Cannot see any data in tables
**Solution**: Check that RLS policies are correctly configured and your user has the right role.

### Issue 3: Authentication errors
**Solution**: Verify that your Supabase URL and keys in `.env.local` are correct.

### Issue 4: Build errors
**Solution**: 
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Restart dev server: `npm run dev`

## Production Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

3. **Update Supabase Settings**
   - In Supabase: Authentication > URL Configuration
   - Add your Vercel domain to "Site URL"
   - Add your domain to "Redirect URLs"

## Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] RLS policies are enabled on all tables
- [ ] Email verification is enabled in Supabase
- [ ] Strong password policies are configured
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Database backups are scheduled

## Next Steps

1. Customize the application branding
2. Add school logo and colors
3. Configure email templates in Supabase
4. Set up automated backups
5. Train staff on using the system
6. Import existing student/staff data
7. Configure fee structures
8. Set up academic calendar
9. Create timetables
10. Begin day-to-day operations

## Support

For technical support or questions:
- Check the documentation in README.md
- Review the database schema in database/schema.sql
- Contact: Ujjwal Singh (Nescomm)

---

**Congratulations!** Your School ERP system is now set up and ready to use.
