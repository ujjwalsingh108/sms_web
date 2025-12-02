-- ============================================
-- SALES EXECUTIVE SYSTEM SCHEMA
-- ============================================
-- This schema handles sales executives who sell school subscriptions
-- Features: tracking, commissions, sales metrics, soft delete

-- ============================================
-- 1. SALES EXECUTIVES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales_executives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_code TEXT UNIQUE NOT NULL, -- e.g., SE001, SE002
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  alternate_phone TEXT,
  
  -- Address Information
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  
  -- Territory/Region Assignment
  assigned_region TEXT, -- e.g., "North India", "Mumbai", "Delhi NCR"
  assigned_states TEXT[], -- Array of states they cover
  
  -- Commission Settings
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Percentage (e.g., 10.00 for 10%)
  commission_type TEXT DEFAULT 'percentage' CHECK (commission_type IN ('percentage', 'fixed')),
  fixed_commission_amount DECIMAL(10,2), -- If commission_type is 'fixed'
  
  -- Bank Details for Commission Payment
  bank_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  account_holder_name TEXT,
  
  -- Employment Details
  joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
  employment_status TEXT DEFAULT 'active' CHECK (employment_status IN ('active', 'inactive', 'on_leave', 'terminated')),
  manager_id UUID REFERENCES sales_executives(id), -- Reporting manager (if hierarchy exists)
  
  -- Performance Metrics (Cached for quick access)
  total_sales_count INT DEFAULT 0,
  active_subscriptions_count INT DEFAULT 0,
  total_commission_earned DECIMAL(12,2) DEFAULT 0.00,
  total_revenue_generated DECIMAL(15,2) DEFAULT 0.00,
  
  -- Soft Delete
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES auth.users(id),
  
  -- Metadata
  notes TEXT, -- Admin notes about this executive
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes for sales_executives
CREATE INDEX IF NOT EXISTS idx_sales_executives_user_id ON sales_executives(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_executives_employee_code ON sales_executives(employee_code);
CREATE INDEX IF NOT EXISTS idx_sales_executives_email ON sales_executives(email);
CREATE INDEX IF NOT EXISTS idx_sales_executives_region ON sales_executives(assigned_region);
CREATE INDEX IF NOT EXISTS idx_sales_executives_status ON sales_executives(employment_status);
CREATE INDEX IF NOT EXISTS idx_sales_executives_active ON sales_executives(is_deleted, employment_status) WHERE is_deleted = false;

-- ============================================
-- 2. SALES TRANSACTIONS TABLE
-- ============================================
-- Tracks each school subscription sale
CREATE TABLE IF NOT EXISTS sales_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Sales Executive Info
  sales_executive_id UUID NOT NULL REFERENCES sales_executives(id) ON DELETE RESTRICT,
  
  -- School Info
  school_id UUID NOT NULL REFERENCES school_instances(id) ON DELETE RESTRICT,
  
  -- Sale Details
  subscription_plan TEXT NOT NULL, -- 'basic', 'premium', 'enterprise'
  subscription_duration_months INT NOT NULL, -- 1, 3, 6, 12, 24
  subscription_start_date DATE NOT NULL,
  subscription_end_date DATE NOT NULL,
  
  -- Pricing
  plan_price DECIMAL(10,2) NOT NULL, -- Original price per month
  discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  final_amount DECIMAL(10,2) NOT NULL, -- Amount after discount
  
  -- Commission Calculation
  commission_rate DECIMAL(5,2) NOT NULL, -- Rate at time of sale
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'approved', 'paid', 'cancelled')),
  commission_paid_date DATE,
  commission_payment_reference TEXT,
  
  -- Sale Status
  sale_status TEXT DEFAULT 'active' CHECK (sale_status IN ('active', 'expired', 'cancelled', 'renewed')),
  is_renewal BOOLEAN DEFAULT false,
  parent_transaction_id UUID REFERENCES sales_transactions(id), -- If this is a renewal
  
  -- Payment Info
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'failed', 'refunded')),
  payment_method TEXT, -- 'bank_transfer', 'upi', 'cheque', 'online'
  payment_reference TEXT,
  payment_date DATE,
  
  -- Approval Workflow
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Additional Info
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for sales_transactions
CREATE INDEX IF NOT EXISTS idx_sales_transactions_executive ON sales_transactions(sales_executive_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_school ON sales_transactions(school_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_status ON sales_transactions(sale_status);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_commission ON sales_transactions(commission_status);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_date ON sales_transactions(subscription_start_date);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_active ON sales_transactions(sales_executive_id, sale_status) WHERE sale_status = 'active';

-- ============================================
-- 3. COMMISSION PAYMENTS TABLE
-- ============================================
-- Tracks commission payments made to sales executives
CREATE TABLE IF NOT EXISTS commission_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Sales Executive
  sales_executive_id UUID NOT NULL REFERENCES sales_executives(id) ON DELETE RESTRICT,
  
  -- Payment Details
  payment_amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'upi', 'cheque', 'cash')),
  payment_reference TEXT NOT NULL,
  
  -- Period Covered
  period_start_date DATE NOT NULL,
  period_end_date DATE NOT NULL,
  
  -- Transactions Included
  transaction_ids UUID[] NOT NULL, -- Array of sales_transactions.id
  transaction_count INT NOT NULL,
  total_sales_amount DECIMAL(15,2) NOT NULL,
  
  -- Payment Status
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Admin Info
  processed_by UUID NOT NULL REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  
  -- Additional Info
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for commission_payments
CREATE INDEX IF NOT EXISTS idx_commission_payments_executive ON commission_payments(sales_executive_id);
CREATE INDEX IF NOT EXISTS idx_commission_payments_date ON commission_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_commission_payments_status ON commission_payments(status);

-- ============================================
-- 4. SALES TARGETS TABLE
-- ============================================
-- Monthly/Quarterly targets for sales executives
CREATE TABLE IF NOT EXISTS sales_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Sales Executive
  sales_executive_id UUID NOT NULL REFERENCES sales_executives(id) ON DELETE CASCADE,
  
  -- Target Period
  target_period TEXT NOT NULL CHECK (target_period IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Targets
  target_sales_count INT NOT NULL, -- Number of schools
  target_revenue DECIMAL(15,2) NOT NULL, -- Revenue in rupees
  
  -- Achievement (Auto-calculated)
  achieved_sales_count INT DEFAULT 0,
  achieved_revenue DECIMAL(15,2) DEFAULT 0.00,
  achievement_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Incentives
  incentive_amount DECIMAL(10,2), -- Bonus if target achieved
  incentive_status TEXT DEFAULT 'pending' CHECK (incentive_status IN ('pending', 'achieved', 'paid', 'not_achieved')),
  
  -- Metadata
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Unique constraint to prevent duplicate targets
  UNIQUE(sales_executive_id, target_period, start_date, end_date)
);

-- Indexes for sales_targets
CREATE INDEX IF NOT EXISTS idx_sales_targets_executive ON sales_targets(sales_executive_id);
CREATE INDEX IF NOT EXISTS idx_sales_targets_period ON sales_targets(start_date, end_date);

-- ============================================
-- 5. SALES ACTIVITIES LOG TABLE
-- ============================================
-- Track all activities by sales executives
CREATE TABLE IF NOT EXISTS sales_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Sales Executive
  sales_executive_id UUID NOT NULL REFERENCES sales_executives(id) ON DELETE CASCADE,
  
  -- Activity Details
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'lead_created', 'lead_contacted', 'meeting_scheduled', 'demo_given', 
    'proposal_sent', 'negotiation', 'sale_closed', 'sale_lost',
    'follow_up', 'renewal_reminder', 'customer_visit', 'other'
  )),
  
  -- Related Entities
  school_id UUID REFERENCES school_instances(id),
  transaction_id UUID REFERENCES sales_transactions(id),
  
  -- Activity Info
  title TEXT NOT NULL,
  description TEXT,
  activity_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Follow-up
  requires_follow_up BOOLEAN DEFAULT false,
  follow_up_date DATE,
  follow_up_notes TEXT,
  is_completed BOOLEAN DEFAULT true,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for sales_activities
CREATE INDEX IF NOT EXISTS idx_sales_activities_executive ON sales_activities(sales_executive_id);
CREATE INDEX IF NOT EXISTS idx_sales_activities_type ON sales_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_sales_activities_date ON sales_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_sales_activities_follow_up ON sales_activities(requires_follow_up, follow_up_date) WHERE requires_follow_up = true;

-- ============================================
-- 6. ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE sales_executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_activities ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. RLS POLICIES - SALES EXECUTIVES
-- ============================================

-- Superadmins can do everything
CREATE POLICY "Superadmins can view all sales executives"
  ON sales_executives FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

CREATE POLICY "Superadmins can insert sales executives"
  ON sales_executives FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

CREATE POLICY "Superadmins can update sales executives"
  ON sales_executives FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

-- Sales executives can view their own profile
CREATE POLICY "Sales executives can view own profile"
  ON sales_executives FOR SELECT
  USING (user_id = auth.uid());

-- Sales executives can update their own limited fields
CREATE POLICY "Sales executives can update own profile"
  ON sales_executives FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- 8. RLS POLICIES - SALES TRANSACTIONS
-- ============================================

-- Superadmins can view all transactions
CREATE POLICY "Superadmins can view all sales transactions"
  ON sales_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

-- Superadmins can manage all transactions
CREATE POLICY "Superadmins can insert sales transactions"
  ON sales_transactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

CREATE POLICY "Superadmins can update sales transactions"
  ON sales_transactions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

-- Sales executives can view their own transactions
CREATE POLICY "Sales executives can view own transactions"
  ON sales_transactions FOR SELECT
  USING (
    sales_executive_id IN (
      SELECT id FROM sales_executives WHERE user_id = auth.uid()
    )
  );

-- Sales executives can create transactions (pending approval)
CREATE POLICY "Sales executives can create transactions"
  ON sales_transactions FOR INSERT
  WITH CHECK (
    sales_executive_id IN (
      SELECT id FROM sales_executives WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 9. RLS POLICIES - COMMISSION PAYMENTS
-- ============================================

-- Superadmins can manage all commission payments
CREATE POLICY "Superadmins can view all commission payments"
  ON commission_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

CREATE POLICY "Superadmins can insert commission payments"
  ON commission_payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

-- Sales executives can view their own commission payments
CREATE POLICY "Sales executives can view own commission payments"
  ON commission_payments FOR SELECT
  USING (
    sales_executive_id IN (
      SELECT id FROM sales_executives WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 10. RLS POLICIES - SALES TARGETS
-- ============================================

-- Superadmins can manage all targets
CREATE POLICY "Superadmins can view all sales targets"
  ON sales_targets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

CREATE POLICY "Superadmins can manage sales targets"
  ON sales_targets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

-- Sales executives can view their own targets
CREATE POLICY "Sales executives can view own targets"
  ON sales_targets FOR SELECT
  USING (
    sales_executive_id IN (
      SELECT id FROM sales_executives WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 11. RLS POLICIES - SALES ACTIVITIES
-- ============================================

-- Superadmins can view all activities
CREATE POLICY "Superadmins can view all sales activities"
  ON sales_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid() AND r.name = 'superadmin'
    )
  );

-- Sales executives can manage their own activities
CREATE POLICY "Sales executives can manage own activities"
  ON sales_activities FOR ALL
  USING (
    sales_executive_id IN (
      SELECT id FROM sales_executives WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    sales_executive_id IN (
      SELECT id FROM sales_executives WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 12. HELPER FUNCTIONS
-- ============================================

-- Function to update sales executive metrics
CREATE OR REPLACE FUNCTION update_sales_executive_metrics(exec_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE sales_executives
  SET 
    total_sales_count = (
      SELECT COUNT(*) FROM sales_transactions 
      WHERE sales_executive_id = exec_id
    ),
    active_subscriptions_count = (
      SELECT COUNT(*) FROM sales_transactions 
      WHERE sales_executive_id = exec_id AND sale_status = 'active'
    ),
    total_commission_earned = (
      SELECT COALESCE(SUM(commission_amount), 0) 
      FROM sales_transactions 
      WHERE sales_executive_id = exec_id AND commission_status = 'paid'
    ),
    total_revenue_generated = (
      SELECT COALESCE(SUM(final_amount), 0) 
      FROM sales_transactions 
      WHERE sales_executive_id = exec_id
    ),
    updated_at = now()
  WHERE id = exec_id;
END;
$$;

-- Function to calculate commission
CREATE OR REPLACE FUNCTION calculate_commission(
  plan_price DECIMAL,
  duration_months INT,
  discount_amount DECIMAL,
  commission_rate DECIMAL,
  commission_type TEXT DEFAULT 'percentage',
  fixed_amount DECIMAL DEFAULT NULL
)
RETURNS DECIMAL
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  total_amount DECIMAL;
  commission DECIMAL;
BEGIN
  -- Calculate total amount after discount
  total_amount := (plan_price * duration_months) - discount_amount;
  
  -- Calculate commission based on type
  IF commission_type = 'percentage' THEN
    commission := total_amount * (commission_rate / 100);
  ELSE
    commission := COALESCE(fixed_amount, 0);
  END IF;
  
  RETURN ROUND(commission, 2);
END;
$$;

-- Function to update target achievement
CREATE OR REPLACE FUNCTION update_target_achievement(target_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_record RECORD;
  achieved_count INT;
  achieved_revenue DECIMAL;
BEGIN
  -- Get target details
  SELECT * INTO target_record FROM sales_targets WHERE id = target_id;
  
  -- Calculate achievements
  SELECT 
    COUNT(*),
    COALESCE(SUM(final_amount), 0)
  INTO achieved_count, achieved_revenue
  FROM sales_transactions
  WHERE sales_executive_id = target_record.sales_executive_id
    AND subscription_start_date BETWEEN target_record.start_date AND target_record.end_date
    AND sale_status != 'cancelled';
  
  -- Update target
  UPDATE sales_targets
  SET 
    achieved_sales_count = achieved_count,
    achieved_revenue = achieved_revenue,
    achievement_percentage = ROUND(
      LEAST(100, (achieved_revenue / NULLIF(target_revenue, 0)) * 100), 
      2
    ),
    incentive_status = CASE 
      WHEN achieved_revenue >= target_revenue THEN 'achieved'
      ELSE 'not_achieved'
    END,
    updated_at = now()
  WHERE id = target_id;
END;
$$;

-- ============================================
-- 13. TRIGGERS
-- ============================================

-- Auto-update sales executive metrics when transaction changes
CREATE OR REPLACE FUNCTION trigger_update_exec_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM update_sales_executive_metrics(NEW.sales_executive_id);
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM update_sales_executive_metrics(NEW.sales_executive_id);
    IF OLD.sales_executive_id != NEW.sales_executive_id THEN
      PERFORM update_sales_executive_metrics(OLD.sales_executive_id);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM update_sales_executive_metrics(OLD.sales_executive_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trigger_update_sales_exec_metrics
AFTER INSERT OR UPDATE OR DELETE ON sales_transactions
FOR EACH ROW
EXECUTE FUNCTION trigger_update_exec_metrics();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_timestamp_sales_executives
BEFORE UPDATE ON sales_executives
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_sales_transactions
BEFORE UPDATE ON sales_transactions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_commission_payments
BEFORE UPDATE ON commission_payments
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_sales_targets
BEFORE UPDATE ON sales_targets
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- ============================================
-- 14. VIEWS FOR REPORTING
-- ============================================

-- Sales Executive Dashboard View
CREATE OR REPLACE VIEW sales_executive_dashboard AS
SELECT 
  se.id,
  se.employee_code,
  se.full_name,
  se.email,
  se.phone,
  se.assigned_region,
  se.employment_status,
  se.total_sales_count,
  se.active_subscriptions_count,
  se.total_commission_earned,
  se.total_revenue_generated,
  
  -- Current month stats
  (SELECT COUNT(*) FROM sales_transactions st 
   WHERE st.sales_executive_id = se.id 
   AND st.subscription_start_date >= date_trunc('month', CURRENT_DATE)) as current_month_sales,
  
  (SELECT COALESCE(SUM(final_amount), 0) FROM sales_transactions st 
   WHERE st.sales_executive_id = se.id 
   AND st.subscription_start_date >= date_trunc('month', CURRENT_DATE)) as current_month_revenue,
  
  -- Pending commission
  (SELECT COALESCE(SUM(commission_amount), 0) FROM sales_transactions st 
   WHERE st.sales_executive_id = se.id 
   AND st.commission_status IN ('pending', 'approved')) as pending_commission,
  
  se.created_at,
  se.joining_date
FROM sales_executives se
WHERE se.is_deleted = false;

-- Sales Performance Report
CREATE OR REPLACE VIEW sales_performance_report AS
SELECT 
  se.id as executive_id,
  se.employee_code,
  se.full_name,
  se.assigned_region,
  COUNT(st.id) as total_transactions,
  COUNT(st.id) FILTER (WHERE st.sale_status = 'active') as active_sales,
  COUNT(st.id) FILTER (WHERE st.sale_status = 'expired') as expired_sales,
  COUNT(st.id) FILTER (WHERE st.sale_status = 'cancelled') as cancelled_sales,
  COALESCE(SUM(st.final_amount), 0) as total_revenue,
  COALESCE(SUM(st.commission_amount), 0) as total_commission,
  COALESCE(SUM(st.commission_amount) FILTER (WHERE st.commission_status = 'paid'), 0) as paid_commission,
  COALESCE(SUM(st.commission_amount) FILTER (WHERE st.commission_status IN ('pending', 'approved')), 0) as pending_commission
FROM sales_executives se
LEFT JOIN sales_transactions st ON st.sales_executive_id = se.id
WHERE se.is_deleted = false
GROUP BY se.id, se.employee_code, se.full_name, se.assigned_region;

-- ============================================
-- DONE! Sales Executive System Ready
-- ============================================
-- Next steps:
-- 1. Run this schema in Supabase SQL Editor
-- 2. Create the sales_executive role in the roles table
-- 3. Build admin forms to manage sales executives
-- 4. Build sales executive portal/dashboard
-- 5. Set up commission payment workflows
