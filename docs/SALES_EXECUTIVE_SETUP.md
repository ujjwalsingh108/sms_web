# Sales Executive System - Setup & Usage Guide

## 🎉 Implementation Complete!

The complete sales executive management system has been implemented with both superadmin and sales executive interfaces.

## 📁 Files Created

### Database
- `database/sales-executive-schema.sql` - Complete database schema
- `database/sales-executive-role-setup.sql` - Role creation and examples

### Superadmin Interface (Admin Panel)

**Server Actions:**
- `app/admin/sales-executives/actions.ts` - CRUD operations and transaction management

**Pages:**
- `app/admin/sales-executives/page.tsx` - List view with stats
- `app/admin/sales-executives/new/page.tsx` - Create new sales executive
- `app/admin/sales-executives/[id]/page.tsx` - Detail view with tabs
- `app/admin/sales-executives/[id]/edit/page.tsx` - Edit sales executive

**Components:**
- `components/admin/create-sales-executive-form.tsx` - Creation form
- `components/admin/edit-sales-executive-form.tsx` - Edit form
- `components/admin/sales-executive-table.tsx` - List table with search
- `components/admin/sales-transaction-table.tsx` - Transaction list
- `components/admin/commission-payment-table.tsx` - Payment history
- `components/admin/delete-sales-executive-button.tsx` - Delete dialog

### Sales Executive Portal

**Pages:**
- `app/sales/login/page.tsx` - Separate login portal
- `app/sales/dashboard/page.tsx` - Sales exec dashboard
- `app/sales/profile/page.tsx` - Profile management

**Components:**
- `components/sales/sales-login-form.tsx` - Login form
- `components/sales/sales-transaction-list.tsx` - Transaction list
- `components/sales/sales-profile-edit-form.tsx` - Profile edit

### Navigation
- Updated `components/admin/admin-sidebar.tsx` - Added "Sales Executives" menu item

## 🚀 Setup Instructions

### 1. Database Setup

Run these SQL files in Supabase SQL Editor (in order):

```sql
-- Step 1: Run schema
database/sales-executive-schema.sql

-- Step 2: Run role setup
database/sales-executive-role-setup.sql
```

This creates:
- 5 tables (sales_executives, sales_transactions, commission_payments, sales_targets, sales_activities)
- RLS policies
- Triggers for auto-updating metrics
- Helper functions
- Views for reporting
- sales_executive role

### 2. Verify Setup

```sql
-- Check if role exists
SELECT * FROM roles WHERE name = 'sales_executive';

-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('sales_executives', 'sales_transactions', 'commission_payments', 'sales_targets', 'sales_activities');
```

### 3. Create First Sales Executive

#### Using the Admin Panel (Recommended):

1. Login as superadmin at `/admin`
2. Click "Sales Executives" in sidebar
3. Click "Add Sales Executive"
4. Fill in the form:
   - Personal info (name, email, password, phone)
   - Address (full address required)
   - Territory & Commission (region, rate/type)
   - Bank details (optional)
   - Employment details (status, joining date)
5. Click "Create Sales Executive"

#### Manual Database Creation:

```sql
-- 1. Create auth user
-- (Use Supabase Dashboard > Authentication > Users > Add User)

-- 2. Get role ID
SELECT id FROM roles WHERE name = 'sales_executive';

-- 3. Add to members
INSERT INTO members (user_id, role_id)
VALUES ('USER_ID', 'ROLE_ID');

-- 4. Create sales executive profile
INSERT INTO sales_executives (
  user_id, employee_code, full_name, email, phone,
  address_line1, city, state, postal_code,
  assigned_region, commission_rate, joining_date,
  created_by
) VALUES (
  'USER_ID', 'SE001', 'John Doe', 'sales@example.com', '+91-9876543210',
  '123 Main St', 'Mumbai', 'Maharashtra', '400001',
  'West India', 10.00, CURRENT_DATE, auth.uid()
);
```

## 🎯 Features Overview

### For Superadmin

#### Sales Executive Management
- **List View**: View all executives with stats (sales, revenue, commission)
- **Create**: Create new sales executive with complete profile
- **Edit**: Update executive details, commission rates, territories
- **Delete**: Soft delete (preserves data)
- **Detail View**: See complete profile, performance metrics, transactions

#### Dashboard Stats
- Total executives count
- Active subscriptions across all executives
- Total revenue generated
- Total commission paid

#### Transactions
- View all sales transactions
- Approve/reject pending sales
- Track commission status
- See payment history

### For Sales Executive

#### Login Portal (`/sales/login`)
- Separate login page
- Validates employment status
- Checks if account is active

#### Dashboard (`/sales/dashboard`)
- **Performance Cards**:
  - Total sales count
  - Total revenue generated
  - Commission earned (paid)
  - Pending commission

- **Current Month Stats**:
  - Monthly sales count vs target
  - Monthly revenue vs target
  - Monthly commission earned
  - Achievement percentage

- **Transaction Tabs**:
  - All Transactions
  - Active Subscriptions
  - Pending Approval

#### Profile Management (`/sales/profile`)
- Update name, phone numbers
- Update address
- View (but not change) commission rate, region

**Restricted**: Sales executives cannot change:
- Email
- Employee code
- Commission rate
- Employment status
- Assigned region

## 📊 Usage Examples

### Creating a Sales Transaction

```typescript
// In admin panel or sales exec portal
const result = await createSalesTransaction({
  salesExecutiveId: "exec-uuid",
  schoolId: "school-uuid",
  subscriptionPlan: "premium",
  subscriptionDurationMonths: 12,
  subscriptionStartDate: "2025-01-01",
  planPrice: 5000, // per month
  discountPercentage: 10,
  paymentStatus: "paid",
  paymentMethod: "bank_transfer",
  paymentReference: "TXN123456",
  notes: "Negotiated 10% discount"
});
```

**Auto-calculated**:
- Discount amount: ₹6,000 (10% of ₹60,000)
- Final amount: ₹54,000
- Commission: ₹5,400 (10% of ₹54,000)

### Processing Commission Payment

```typescript
// Superadmin only
const result = await processCommissionPayment(
  "exec-uuid",
  ["transaction-id-1", "transaction-id-2"],
  {
    paymentAmount: 12500,
    paymentDate: "2025-12-01",
    paymentMethod: "bank_transfer",
    paymentReference: "COMM-DEC-001",
    periodStartDate: "2025-11-01",
    periodEndDate: "2025-11-30",
    notes: "November commission"
  }
);
```

## 🔐 Security (RLS)

### Superadmin
- ✅ Full access to all tables
- ✅ Create, read, update, delete everything
- ✅ Approve transactions
- ✅ Process payments

### Sales Executive
- ✅ Read own profile
- ✅ Update own profile (limited fields)
- ✅ Read own transactions
- ✅ Create new transactions (pending approval)
- ✅ Read own commission payments
- ✅ Read own targets
- ✅ Manage own activities
- ❌ Cannot change commission rate
- ❌ Cannot change employment status
- ❌ Cannot view other executives' data
- ❌ Cannot approve own transactions

## 📱 URLs

### Admin Panel
- List: `/admin/sales-executives`
- Create: `/admin/sales-executives/new`
- View: `/admin/sales-executives/[id]`
- Edit: `/admin/sales-executives/[id]/edit`

### Sales Portal
- Login: `/sales/login`
- Dashboard: `/sales/dashboard`
- Profile: `/sales/profile`

## 🎨 UI Components Used

- shadcn/ui components:
  - Card, CardHeader, CardContent
  - Table, TableHeader, TableBody
  - Button, Input, Label
  - Select, SelectTrigger, SelectContent
  - Badge (for status indicators)
  - Tabs, TabsList, TabsContent
  - AlertDialog (for delete confirmation)
- Lucide icons for visual indicators
- Toast notifications (sonner)
- Responsive design (mobile & desktop)

## 📈 Metrics & Reporting

### Auto-Updated Metrics (Triggers)
- Total sales count
- Active subscriptions count
- Total revenue generated
- Total commission earned

### Available Reports
- Sales performance by executive
- Monthly sales trends
- Commission pending/paid
- Top performers
- Region-wise breakdown
- Target achievement

## 🔄 Workflow

### 1. New Sale Process
1. Sales exec closes deal with school
2. Sales exec or admin creates transaction → status: `pending`
3. Superadmin reviews → approves/rejects
4. If approved → transaction becomes `active`
5. Commission status → `pending`
6. Monthly: Admin processes payment → status: `paid`

### 2. Commission Payment
1. Admin selects sales executive
2. Chooses date range (e.g., monthly)
3. System shows all approved, unpaid transactions
4. Admin selects transactions to pay
5. Enters payment details (amount, method, reference)
6. Processes payment
7. Transaction commission_status → `paid`

### 3. Target Tracking
1. Admin sets monthly/quarterly target
2. As sales happen, metrics auto-update
3. System calculates achievement percentage
4. If target met → incentive_status: `achieved`

## 🧪 Testing

### Test Scenarios

1. **Create Sales Executive**
   - Fill all required fields
   - Verify auto-generated employee code (SE001, SE002, etc.)
   - Check email for login credentials

2. **Sales Executive Login**
   - Go to `/sales/login`
   - Login with created credentials
   - Verify dashboard loads with stats

3. **Create Transaction**
   - Add a sale with discount
   - Verify auto-calculated amounts
   - Check if commission is correct

4. **Approve Transaction**
   - Login as superadmin
   - Go to sales executive detail page
   - Approve pending transaction
   - Verify status changes

5. **Process Payment**
   - Select transactions
   - Enter payment details
   - Verify commission status updates to "paid"

## 📝 Next Steps

1. ✅ Database schema created
2. ✅ Superadmin interface complete
3. ✅ Sales executive portal complete
4. ✅ Transaction management ready
5. ✅ Commission tracking ready

### Optional Enhancements
- 📧 Email notifications (sale created, commission paid)
- 📊 Advanced analytics dashboard
- 📅 Activity log interface
- 🎯 Target tracking dashboard
- 📱 Mobile app
- 💬 Chat/messaging system
- 📄 PDF invoice generation
- 📈 Sales funnel visualization

## 🐛 Troubleshooting

### Sales Executive Can't Login
- Check employment_status is "active"
- Check is_deleted is false
- Verify user exists in auth.users
- Check member record with correct role

### Transactions Not Showing
- Verify RLS policies
- Check sales_executive_id matches
- Ensure transaction created successfully

### Commission Not Calculating
- Check commission_rate in sales_executives table
- Verify commission_type (percentage vs fixed)
- Check if formula is correct in actions.ts

## 📚 Documentation

- Full schema: `database/sales-executive-schema.sql`
- Setup examples: `database/sales-executive-role-setup.sql`
- System overview: `docs/SALES_EXECUTIVE_SYSTEM.md`

---

## ✨ System is Ready!

You can now:
1. Run the database setup
2. Create sales executives via admin panel
3. Sales executives can login at `/sales/login`
4. Track sales, commissions, and performance
5. Process payments and manage territories

Enjoy your new sales executive management system! 🚀
