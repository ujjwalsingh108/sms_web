# Sales Executive System Documentation

## Overview
Complete sales tracking and commission management system for sales executives who sell school subscriptions.

## Features

### For Superadmin
- ✅ Create/Edit/Delete sales executives
- ✅ Track all sales performance metrics
- ✅ Approve sales transactions
- ✅ Process commission payments
- ✅ Set monthly/quarterly targets
- ✅ View comprehensive reports
- ✅ Monitor sales activities
- ✅ Soft delete with history

### For Sales Executive
- ✅ Personal dashboard with metrics
- ✅ View own sales transactions
- ✅ Track active/expired subscriptions
- ✅ View commission earned/pending
- ✅ Update profile (limited fields)
- ✅ Log sales activities
- ✅ View assigned targets
- ✅ Change phone number and name

## Database Schema

### Tables Created
1. **sales_executives** - Sales executive profiles
2. **sales_transactions** - Each school subscription sale
3. **commission_payments** - Payment records
4. **sales_targets** - Monthly/quarterly goals
5. **sales_activities** - Activity tracking log

### Key Fields in sales_executives

#### Personal Info
- `employee_code` - Unique ID (SE001, SE002, etc.)
- `full_name`, `email`, `phone`
- `address_line1`, `city`, `state`, `postal_code`

#### Territory
- `assigned_region` - Sales territory
- `assigned_states` - Array of states covered

#### Commission
- `commission_rate` - Percentage (default 10%)
- `commission_type` - 'percentage' or 'fixed'
- `bank_name`, `account_number`, `ifsc_code`

#### Performance Metrics (Auto-calculated)
- `total_sales_count` - Total schools sold
- `active_subscriptions_count` - Currently active
- `total_commission_earned` - Total paid commission
- `total_revenue_generated` - Total sales value

#### Status
- `employment_status` - active/inactive/on_leave/terminated
- `is_deleted` - Soft delete flag

### sales_transactions Table

Tracks each sale with:
- Sales executive reference
- School reference
- Subscription plan and duration
- Pricing and discounts
- Commission calculation
- Sale status (active/expired/cancelled/renewed)
- Payment status
- Approval workflow

### Commission Calculation

**Formula for Percentage:**
```
Total Amount = (Plan Price × Duration) - Discount
Commission = Total Amount × (Rate / 100)
```

**Example:**
- Plan: ₹5,000/month
- Duration: 12 months
- Discount: ₹2,000
- Rate: 10%

```
Total = (5000 × 12) - 2000 = ₹58,000
Commission = 58,000 × 0.10 = ₹5,800
```

## Setup Instructions

### 1. Database Setup
```sql
-- Run in Supabase SQL Editor (in this order):
1. database/sales-executive-schema.sql
2. database/sales-executive-role-setup.sql
```

### 2. Create Sales Executive Role
The role is auto-created, verify with:
```sql
SELECT * FROM roles WHERE name = 'sales_executive';
```

### 3. Create First Sales Executive

**Step 1: Create Auth User**
```typescript
// In admin panel
const { data, error } = await supabase.auth.admin.createUser({
  email: 'sales@example.com',
  password: 'SecurePassword123!',
  email_confirm: true
});
```

**Step 2: Get Role ID**
```sql
SELECT id FROM roles WHERE name = 'sales_executive';
```

**Step 3: Add to Members Table**
```sql
INSERT INTO members (user_id, role_id)
VALUES ('USER_ID_FROM_STEP_1', 'ROLE_ID_FROM_STEP_2');
```

**Step 4: Create Sales Executive Profile**
```sql
INSERT INTO sales_executives (
  user_id, employee_code, full_name, email, phone,
  address_line1, city, state, postal_code,
  assigned_region, commission_rate, joining_date,
  created_by
) VALUES (
  'USER_ID',
  'SE001',
  'John Doe',
  'sales@example.com',
  '+91-9876543210',
  '123 Main Street',
  'Mumbai',
  'Maharashtra',
  '400001',
  'West India',
  10.00,
  CURRENT_DATE,
  auth.uid()
);
```

## Admin Panel Features

### Sales Executive Management

**List View:**
- Employee code
- Name, email, phone
- Region assigned
- Total sales count
- Active subscriptions
- Total commission earned
- Employment status
- Actions (Edit, View Details, Delete)

**Create/Edit Form:**
```typescript
{
  // Personal Details
  fullName: string
  email: string
  password: string // Only on create
  phone: string
  alternatePhone?: string
  
  // Address
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  
  // Territory
  assignedRegion: string
  assignedStates: string[]
  
  // Commission
  commissionRate: number
  commissionType: 'percentage' | 'fixed'
  fixedCommissionAmount?: number
  
  // Bank Details
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  accountHolderName?: string
  
  // Employment
  joiningDate: Date
  employmentStatus: 'active' | 'inactive'
  managerId?: UUID
  
  // Notes
  notes?: string
}
```

**Detail View:**
- Profile information
- Performance metrics dashboard
- Sales transactions list
- Commission payments history
- Targets and achievements
- Recent activities

### Sales Transaction Management

**Create Transaction Form:**
```typescript
{
  salesExecutiveId: UUID
  schoolId: UUID
  subscriptionPlan: 'basic' | 'premium' | 'enterprise'
  durationMonths: 1 | 3 | 6 | 12 | 24
  startDate: Date
  planPrice: number
  discountPercentage: number
  discountAmount: number // Auto-calculated
  finalAmount: number // Auto-calculated
  commissionAmount: number // Auto-calculated
  paymentStatus: 'pending' | 'paid' | 'partial'
  paymentMethod?: string
  paymentReference?: string
  notes?: string
}
```

**List View:**
- Filter by: executive, school, status, date range
- Columns: School, Executive, Plan, Amount, Commission, Status
- Actions: Approve, Reject, Edit, View

### Commission Payment Processing

**Create Payment:**
```typescript
{
  salesExecutiveId: UUID
  periodStart: Date
  periodEnd: Date
  transactionIds: UUID[] // Selected transactions
  paymentAmount: number // Auto-calculated
  paymentDate: Date
  paymentMethod: 'bank_transfer' | 'upi' | 'cheque'
  paymentReference: string
  notes?: string
}
```

**Workflow:**
1. Select sales executive
2. Choose date range
3. System shows all approved, unpaid transactions
4. Select transactions to pay
5. Enter payment details
6. Process payment
7. Auto-updates transaction commission_status to 'paid'

### Reports & Analytics

**Executive Performance Report:**
- Total sales, active/expired/cancelled breakdown
- Revenue generated
- Commission earned vs pending
- Target achievement percentage

**Monthly Sales Report:**
- Sales by month
- Revenue trends
- Top performing executives
- Region-wise breakdown

**Commission Report:**
- Pending commissions
- Paid commissions history
- Payment schedule

## Sales Executive Portal

### Dashboard
```
┌─────────────────────────────────────────┐
│  Welcome, John Doe (SE001)              │
├─────────────────────────────────────────┤
│  Stats Cards:                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 45   │ │ 38   │ │ ₹2.5L│ │ ₹45K │  │
│  │Sales │ │Active│ │Revenue│ │Earned│  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│  Current Month:                         │
│  Sales: 8 | Revenue: ₹45,000           │
│  Target: 10 sales | ₹50,000            │
│  Achievement: 80% | 90%                 │
├─────────────────────────────────────────┤
│  Recent Transactions:                   │
│  [List of last 10 sales]               │
├─────────────────────────────────────────┤
│  Pending Commission: ₹12,000           │
│  Last Payment: ₹15,000 on 15-Nov-2025  │
└─────────────────────────────────────────┘
```

### Features for Sales Executive
- View all their sales transactions
- See which schools have active subscriptions
- Track commission earned and pending
- View payment history
- Update profile (name, phone, address)
- Log sales activities
- View targets and progress

### Restricted Actions
Sales executives CANNOT:
- Change their commission rate
- Change employment status
- Delete their account
- View other executives' data
- Approve their own transactions
- Process commission payments

## API Examples

### Get Executive Dashboard Data
```typescript
const { data: executive } = await supabase
  .from('sales_executive_dashboard')
  .select('*')
  .eq('id', executiveId)
  .single();
```

### Get Executive's Transactions
```typescript
const { data: transactions } = await supabase
  .from('sales_transactions')
  .select(`
    *,
    school:school_instances(school_name, subdomain),
    executive:sales_executives(full_name, employee_code)
  `)
  .eq('sales_executive_id', executiveId)
  .order('created_at', { ascending: false });
```

### Get Pending Commissions
```typescript
const { data: pending } = await supabase
  .from('sales_transactions')
  .select('*')
  .eq('sales_executive_id', executiveId)
  .in('commission_status', ['pending', 'approved'])
  .order('created_at', { ascending: false });
```

### Update Executive Profile (Sales Executive)
```typescript
// Only allowed fields
const { data, error } = await supabase
  .from('sales_executives')
  .update({
    full_name: newName,
    phone: newPhone,
    alternate_phone: newAltPhone,
    address_line1: newAddress1,
    address_line2: newAddress2,
    city: newCity,
    state: newState,
    postal_code: newPostalCode
  })
  .eq('user_id', userId);
```

## Security (RLS)

### Superadmin Access
- Full access to all tables
- Can create, read, update, delete everything

### Sales Executive Access
- **sales_executives**: Read own profile, update limited fields
- **sales_transactions**: Read own, create new (pending approval)
- **commission_payments**: Read own payment history
- **sales_targets**: Read own targets
- **sales_activities**: Full access to own activities

## Workflow Examples

### 1. New Sale Process
1. Sales executive closes deal with school
2. Sales executive or admin creates transaction (status: pending)
3. Superadmin reviews and approves transaction
4. Transaction becomes active
5. Commission status: pending
6. Monthly: Admin processes commission payment
7. Commission status: paid

### 2. Target Achievement
1. Admin sets monthly target (10 sales, ₹5L revenue)
2. Sales executive makes sales
3. System auto-updates achievement percentage
4. End of month: If target achieved, incentive_status = 'achieved'
5. Admin processes incentive payment

### 3. Renewal Process
1. Subscription nearing expiry
2. Sales executive follows up (logged in activities)
3. School renews
4. Create new transaction with:
   - `is_renewal = true`
   - `parent_transaction_id = original_transaction_id`
5. Commission earned on renewal

## Testing Queries

See `sales-executive-role-setup.sql` for:
- List all executives with stats
- Get transactions for an executive
- View pending commissions
- Monthly performance reports
- Top performers
- Commission payment summaries

## Next Steps

1. ✅ Run database schema
2. ✅ Create sales_executive role
3. 🔄 Build admin forms (Create/Edit Sales Executive)
4. 🔄 Build sales transaction management
5. 🔄 Build commission payment interface
6. 🔄 Build sales executive portal/dashboard
7. 🔄 Build reports and analytics
8. 🔄 Set up automated email notifications
9. 🔄 Add target tracking dashboard
10. 🔄 Build activity log interface
