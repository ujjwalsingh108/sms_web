-- ============================================
-- SALES EXECUTIVE ROLE SETUP
-- ============================================
-- Run this AFTER sales-executive-schema.sql

-- 1. Insert sales_executive role if it doesn't exist
INSERT INTO roles (name, description)
VALUES ('sales_executive', 'Sales person who sells school subscriptions')
ON CONFLICT (name) DO NOTHING;

-- 2. Verify role created
SELECT id, name, description, created_at 
FROM roles 
WHERE name = 'sales_executive';

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- This will help you test the system
-- Replace the email/password with real values when creating actual sales executives

-- Note: Sales executives will be created through the admin form
-- This is just to show the structure

DO $$
DECLARE
  test_user_id UUID;
  sales_role_id UUID;
  test_exec_id UUID;
BEGIN
  -- Get sales_executive role id
  SELECT id INTO sales_role_id FROM roles WHERE name = 'sales_executive';
  
  RAISE NOTICE 'Sales Executive Role ID: %', sales_role_id;
  RAISE NOTICE 'Use this role_id when creating sales executives';
  RAISE NOTICE 'Sales executives must be created through Supabase Auth first';
  RAISE NOTICE 'Then add them to sales_executives table';
END $$;

-- ============================================
-- USEFUL QUERIES FOR SUPERADMIN
-- ============================================

-- Get all sales executives with their stats
SELECT 
  employee_code,
  full_name,
  email,
  phone,
  assigned_region,
  employment_status,
  total_sales_count,
  active_subscriptions_count,
  total_commission_earned,
  total_revenue_generated,
  joining_date
FROM sales_executive_dashboard
ORDER BY total_revenue_generated DESC;

-- Get sales transactions for a specific executive
-- Replace 'SE001' with actual employee code
SELECT 
  st.id,
  si.school_name,
  st.subscription_plan,
  st.subscription_duration_months,
  st.final_amount,
  st.commission_amount,
  st.commission_status,
  st.sale_status,
  st.subscription_start_date,
  st.subscription_end_date
FROM sales_transactions st
JOIN sales_executives se ON st.sales_executive_id = se.id
JOIN school_instances si ON st.school_id = si.id
WHERE se.employee_code = 'SE001'
ORDER BY st.created_at DESC;

-- Get pending commissions by executive
SELECT 
  se.employee_code,
  se.full_name,
  COUNT(st.id) as pending_transactions,
  SUM(st.commission_amount) as total_pending_commission
FROM sales_executives se
JOIN sales_transactions st ON st.sales_executive_id = se.id
WHERE st.commission_status IN ('pending', 'approved')
  AND se.is_deleted = false
GROUP BY se.id, se.employee_code, se.full_name
ORDER BY total_pending_commission DESC;

-- Monthly sales performance
SELECT 
  se.employee_code,
  se.full_name,
  DATE_TRUNC('month', st.subscription_start_date) as month,
  COUNT(st.id) as sales_count,
  SUM(st.final_amount) as revenue,
  SUM(st.commission_amount) as commission
FROM sales_executives se
JOIN sales_transactions st ON st.sales_executive_id = se.id
WHERE se.is_deleted = false
GROUP BY se.id, se.employee_code, se.full_name, DATE_TRUNC('month', st.subscription_start_date)
ORDER BY month DESC, revenue DESC;

-- Top performing sales executives (last 3 months)
SELECT 
  se.employee_code,
  se.full_name,
  se.assigned_region,
  COUNT(st.id) as total_sales,
  SUM(st.final_amount) as total_revenue,
  SUM(st.commission_amount) as total_commission
FROM sales_executives se
JOIN sales_transactions st ON st.sales_executive_id = se.id
WHERE st.subscription_start_date >= CURRENT_DATE - INTERVAL '3 months'
  AND se.is_deleted = false
GROUP BY se.id, se.employee_code, se.full_name, se.assigned_region
ORDER BY total_revenue DESC
LIMIT 10;

-- Commission payment summary
SELECT 
  se.employee_code,
  se.full_name,
  COUNT(cp.id) as payment_count,
  SUM(cp.payment_amount) as total_paid,
  MAX(cp.payment_date) as last_payment_date
FROM sales_executives se
LEFT JOIN commission_payments cp ON cp.sales_executive_id = se.id
WHERE se.is_deleted = false
GROUP BY se.id, se.employee_code, se.full_name
ORDER BY total_paid DESC;

-- ============================================
-- COMMISSION CALCULATION EXAMPLE
-- ============================================

-- Example: Calculate commission for a sale
SELECT calculate_commission(
  5000.00,  -- plan_price (per month)
  12,       -- duration_months
  2000.00,  -- discount_amount
  10.00,    -- commission_rate (10%)
  'percentage', -- commission_type
  NULL      -- fixed_amount (not used for percentage)
) as calculated_commission;

-- Result: 5600.00 
-- Calculation: (5000 * 12 - 2000) * 0.10 = 5600

-- ============================================
-- TARGETS EXAMPLE
-- ============================================

-- Create a monthly target for a sales executive
-- (Replace the sales_executive_id with actual ID)
/*
INSERT INTO sales_targets (
  sales_executive_id,
  target_period,
  start_date,
  end_date,
  target_sales_count,
  target_revenue,
  incentive_amount,
  created_by
)
VALUES (
  'YOUR_SALES_EXEC_ID',
  'monthly',
  '2025-01-01',
  '2025-01-31',
  10,           -- Target: 10 school subscriptions
  500000.00,    -- Target: 5 lakh rupees revenue
  25000.00,     -- Incentive: 25k bonus if achieved
  auth.uid()
);
*/

-- ============================================
-- ACTIVITY LOG EXAMPLE
-- ============================================

-- Log a sales activity
/*
INSERT INTO sales_activities (
  sales_executive_id,
  activity_type,
  school_id,
  title,
  description,
  requires_follow_up,
  follow_up_date
)
VALUES (
  'YOUR_SALES_EXEC_ID',
  'demo_given',
  'SCHOOL_ID',
  'Product demo at XYZ School',
  'Demonstrated student management and attendance modules. Principal interested in premium plan.',
  true,
  CURRENT_DATE + INTERVAL '3 days'
);
*/

-- ============================================
-- SETUP COMPLETE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Sales Executive role setup complete!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create sales executives through admin panel';
  RAISE NOTICE '2. Assign regions and commission rates';
  RAISE NOTICE '3. Set monthly targets';
  RAISE NOTICE '4. Track sales and approve commissions';
END $$;
