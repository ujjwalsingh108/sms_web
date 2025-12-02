// Sales Executive Types and Interfaces

export interface SalesExecutive {
  id: string;
  user_id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  assigned_region?: string;
  assigned_states?: string[];
  commission_rate: number;
  commission_type: "percentage" | "fixed";
  fixed_commission_amount?: number;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  account_holder_name?: string;
  joining_date: string;
  employment_status: "active" | "inactive" | "on_leave" | "terminated";
  manager_id?: string;
  total_sales_count: number;
  active_subscriptions_count: number;
  total_commission_earned: number;
  total_revenue_generated: number;
  is_deleted: boolean;
  deleted_at?: string;
  deleted_by?: string;
  notes?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface SalesTransaction {
  id: string;
  sales_executive_id: string;
  school_id: string;
  subscription_plan: "basic" | "premium" | "enterprise";
  subscription_duration_months: number;
  subscription_start_date: string;
  subscription_end_date: string;
  plan_price: number;
  discount_percentage: number;
  discount_amount: number;
  final_amount: number;
  commission_rate: number;
  commission_amount: number;
  commission_status: "pending" | "approved" | "paid" | "cancelled";
  commission_paid_date?: string;
  commission_payment_reference?: string;
  sale_status: "active" | "expired" | "cancelled" | "renewed";
  payment_status: "pending" | "paid" | "partial" | "failed";
  payment_method?: string;
  payment_reference?: string;
  approval_status: "pending" | "approved" | "rejected";
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  notes?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface SalesTransactionWithSchool extends SalesTransaction {
  school: {
    school_name: string;
    subdomain: string;
  };
}

export interface CommissionPayment {
  id: string;
  sales_executive_id: string;
  payment_amount: number;
  payment_date: string;
  payment_method: string;
  payment_reference: string;
  period_start_date: string;
  period_end_date: string;
  transaction_ids: string[];
  transaction_count: number;
  total_sales_amount: number;
  payment_status: "pending" | "paid" | "failed";
  processed_by?: string;
  approved_by?: string;
  notes?: string;
  metadata?: any;
  created_at: string;
}

export interface SalesTarget {
  id: string;
  sales_executive_id: string;
  target_period: "monthly" | "quarterly" | "yearly";
  start_date: string;
  end_date: string;
  target_sales_count: number;
  target_revenue: number;
  actual_sales_count: number;
  actual_revenue: number;
  achievement_percentage: number;
  incentive_amount?: number;
  is_achieved: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface SalesExecutiveDashboard {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  assigned_region?: string;
  employment_status: string;
  total_sales_count: number;
  active_subscriptions_count: number;
  total_commission_earned: number;
  total_revenue_generated: number;
  joining_date: string;
}
