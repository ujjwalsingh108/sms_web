# School ERP - Comprehensive School Management System

A modern, full-featured Enterprise Resource Planning (ERP) system built specifically for schools using Next.js 15, Supabase, and TypeScript.

## 🎯 Features

### Core Modules

1. **Admission Management** - Student admission forms, application tracking and approval workflows
2. **Student Management** - Comprehensive student profiles and academic records
3. **Staff Management** - Employee records, salary, qualifications
4. **Transport Management** - Route management, vehicle tracking, transport allocation
5. **Fee Management** - Fee collection, receipts, payment tracking
6. **Library Management** - Book cataloging, issue/return tracking, fine calculation
7. **Examination Management** - Exam scheduling, marks entry, result generation
8. **Attendance Management** - Daily attendance for students and staff
9. **Timetable Management** - Class-wise timetable creation
10. **Inventory & Purchase** - Stock management, purchase orders
11. **Accounts Management** - Income/expense tracking, financial reporting
12. **Hostel Management** - Room allocation, capacity management
13. **Infirmary** - Health records and medical management
14. **Security & Reception** - Visitor management and tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod

## 🚀 Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Supabase

1. Create a new project in [Supabase](https://supabase.com)
2. Run the SQL schema from \`database/schema.sql\`
3. Insert default roles (see schema.sql)

### 3. Configure Environment

Create \`.env.local\`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 👥 User Roles

- **Super Admin**: Full system access
- **Admin**: School administrator
- **Teacher**: Attendance, marks, timetable
- **Accountant**: Fees and accounts
- **Librarian**: Library management
- **Parent**: View child's records
- **Student**: View own records
- **Driver**: Transport routes

## 📄 License

MIT License - **Ujjwal Singh** for **Nescomm**

