// Admin Portal Types
export interface SchoolInstance {
  id: string;
  tenant_id: string;
  subdomain: string;
  school_name: string;
  admin_email: string;
  admin_user_id: string | null;
  status: "pending" | "active" | "suspended" | "cancelled";
  setup_completed: boolean;
  subscription_plan: "trial" | "basic" | "standard" | "premium";
  subscription_start: string | null;
  subscription_end: string | null;
  max_students: number;
  max_staff: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SchoolInstanceWithTenant extends SchoolInstance {
  tenant: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
}

export interface AdminActivityLog {
  id: string;
  admin_user_id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

export type SubscriptionPlan = "trial" | "basic" | "standard" | "premium";
export type SchoolStatus = "pending" | "active" | "suspended" | "cancelled";

export interface CreateSchoolInput {
  school_name: string;
  subdomain: string;
  admin_email: string;
  admin_password: string;
  phone?: string;
  address?: string;
  subscription_plan?: SubscriptionPlan;
  max_students?: number;
  max_staff?: number;
}

export interface SchoolStats {
  total_students: number;
  total_staff: number;
  total_classes: number;
  active_academic_year: string | null;
}
