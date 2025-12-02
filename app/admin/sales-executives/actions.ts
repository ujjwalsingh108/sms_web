"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { revalidatePath } from "next/cache";

// ============================================
// TYPES
// ============================================

export interface SalesExecutiveFormData {
  fullName: string;
  email: string;
  password?: string; // Only for creation
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  assignedRegion: string;
  assignedStates?: string[];
  commissionRate: number;
  commissionType: "percentage" | "fixed";
  fixedCommissionAmount?: number;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  joiningDate: string;
  employmentStatus: "active" | "inactive" | "on_leave" | "terminated";
  managerId?: string;
  notes?: string;
}

export interface SalesTransactionFormData {
  salesExecutiveId: string;
  schoolId: string;
  subscriptionPlan: "basic" | "premium" | "enterprise";
  subscriptionDurationMonths: number;
  subscriptionStartDate: string;
  planPrice: number;
  discountPercentage: number;
  paymentStatus?: "pending" | "paid" | "partial" | "failed";
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
}

// ============================================
// SALES EXECUTIVE CRUD
// ============================================

export async function createSalesExecutive(formData: SalesExecutiveFormData) {
  const supabase = await createClient();

  try {
    // Check if user is superadmin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: member } = await supabase
      .from("members")
      .select("role:roles(name)")
      .eq("user_id", user.id)
      .single<{ role: { name: string } }>();

    if (!member || member.role?.name !== "superadmin") {
      return {
        success: false,
        error: "Only superadmins can create sales executives",
      };
    }

    // Generate employee code
    const { data: lastExec } = await supabase
      .from("sales_executives")
      .select("employee_code")
      .order("created_at", { ascending: false })
      .limit(1)
      .single<{ employee_code: string }>();

    let employeeCode = "SE001";
    if (lastExec?.employee_code) {
      const lastNumber = parseInt(lastExec.employee_code.replace("SE", ""));
      employeeCode = `SE${String(lastNumber + 1).padStart(3, "0")}`;
    }

    // Create auth user using service role client
    const supabaseAdmin = createServiceRoleClient();
    const { data: authData, error: createAuthError } =
      await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password:
          formData.password || `Temp${Math.random().toString(36).slice(-8)}!`,
        email_confirm: true,
      });

    if (createAuthError || !authData.user) {
      return {
        success: false,
        error: createAuthError?.message || "Failed to create auth user",
      };
    }

    // Create sales executive profile
    const { data: salesExec, error: execError } = await (
      supabaseAdmin.from("sales_executives") as any
    )
      .insert({
        user_id: authData.user.id,
        employee_code: employeeCode,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        alternate_phone: formData.alternatePhone,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country || "India",
        assigned_region: formData.assignedRegion,
        assigned_states: formData.assignedStates,
        commission_rate: formData.commissionRate,
        commission_type: formData.commissionType,
        fixed_commission_amount: formData.fixedCommissionAmount,
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        ifsc_code: formData.ifscCode,
        account_holder_name: formData.accountHolderName,
        joining_date: formData.joiningDate,
        employment_status: formData.employmentStatus,
        manager_id: formData.managerId || null,
        notes: formData.notes,
        created_by: user.id,
      })
      .select()
      .single();

    if (execError) {
      return { success: false, error: execError.message };
    }

    revalidatePath("/admin/sales-executives");
    return { success: true, data: salesExec };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSalesExecutive(
  executiveId: string,
  formData: Partial<SalesExecutiveFormData>
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: salesExec, error } = await (
      supabase.from("sales_executives") as any
    )
      .update({
        full_name: formData.fullName,
        phone: formData.phone,
        alternate_phone: formData.alternatePhone,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
        assigned_region: formData.assignedRegion,
        assigned_states: formData.assignedStates,
        commission_rate: formData.commissionRate,
        commission_type: formData.commissionType,
        fixed_commission_amount: formData.fixedCommissionAmount,
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        ifsc_code: formData.ifscCode,
        account_holder_name: formData.accountHolderName,
        employment_status: formData.employmentStatus,
        manager_id: formData.managerId || null,
        notes: formData.notes,
      })
      .eq("id", executiveId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/sales-executives");
    revalidatePath(`/admin/sales-executives/${executiveId}`);
    return { success: true, data: salesExec };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSalesExecutive(executiveId: string) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Soft delete
    const { error } = await (supabase.from("sales_executives") as any)
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq("id", executiveId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/sales-executives");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// SALES TRANSACTIONS
// ============================================

export async function createSalesTransaction(
  formData: SalesTransactionFormData
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get sales executive commission rate
    const { data: executive } = await (supabase.from("sales_executives") as any)
      .select("commission_rate, commission_type, fixed_commission_amount")
      .eq("id", formData.salesExecutiveId)
      .single();

    if (!executive) {
      return { success: false, error: "Sales executive not found" };
    }

    // Calculate amounts
    const discountAmount =
      (formData.planPrice *
        formData.subscriptionDurationMonths *
        formData.discountPercentage) /
      100;
    const finalAmount =
      formData.planPrice * formData.subscriptionDurationMonths - discountAmount;

    let commissionAmount = 0;
    if (executive.commission_type === "percentage") {
      commissionAmount = (finalAmount * executive.commission_rate) / 100;
    } else {
      commissionAmount = executive.fixed_commission_amount || 0;
    }

    // Calculate dates
    const startDate = new Date(formData.subscriptionStartDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + formData.subscriptionDurationMonths);

    const { data: transaction, error } = await (
      supabase.from("sales_transactions") as any
    )
      .insert({
        sales_executive_id: formData.salesExecutiveId,
        school_id: formData.schoolId,
        subscription_plan: formData.subscriptionPlan,
        subscription_duration_months: formData.subscriptionDurationMonths,
        subscription_start_date: formData.subscriptionStartDate,
        subscription_end_date: endDate.toISOString().split("T")[0],
        plan_price: formData.planPrice,
        discount_percentage: formData.discountPercentage,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        commission_rate: executive.commission_rate,
        commission_amount: commissionAmount,
        payment_status: formData.paymentStatus || "pending",
        payment_method: formData.paymentMethod,
        payment_reference: formData.paymentReference,
        notes: formData.notes,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/sales-executives");
    revalidatePath("/admin/sales-transactions");
    return { success: true, data: transaction };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveSalesTransaction(transactionId: string) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await (supabase.from("sales_transactions") as any)
      .update({
        approval_status: "approved",
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", transactionId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/sales-transactions");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectSalesTransaction(
  transactionId: string,
  rejectionReason: string
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await (supabase.from("sales_transactions") as any)
      .update({
        approval_status: "rejected",
        rejection_reason: rejectionReason,
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", transactionId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/sales-transactions");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// COMMISSION PAYMENTS
// ============================================

export async function processCommissionPayment(
  executiveId: string,
  transactionIds: string[],
  paymentData: {
    paymentAmount: number;
    paymentDate: string;
    paymentMethod: string;
    paymentReference: string;
    periodStartDate: string;
    periodEndDate: string;
    notes?: string;
  }
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get total sales amount
    const { data: transactions } = await (
      supabase.from("sales_transactions") as any
    )
      .select("final_amount")
      .in("id", transactionIds);

    const totalSalesAmount =
      transactions?.reduce(
        (sum: number, t: any) => sum + (t.final_amount || 0),
        0
      ) || 0;

    // Create commission payment record
    const { data: payment, error: paymentError } = await (
      supabase.from("commission_payments") as any
    )
      .insert({
        sales_executive_id: executiveId,
        payment_amount: paymentData.paymentAmount,
        payment_date: paymentData.paymentDate,
        payment_method: paymentData.paymentMethod,
        payment_reference: paymentData.paymentReference,
        period_start_date: paymentData.periodStartDate,
        period_end_date: paymentData.periodEndDate,
        transaction_ids: transactionIds,
        transaction_count: transactionIds.length,
        total_sales_amount: totalSalesAmount,
        processed_by: user.id,
        approved_by: user.id,
        notes: paymentData.notes,
      })
      .select()
      .single();

    if (paymentError) {
      return { success: false, error: paymentError.message };
    }

    // Update transaction commission status to paid
    const { error: updateError } = await (
      supabase.from("sales_transactions") as any
    )
      .update({
        commission_status: "paid",
        commission_paid_date: paymentData.paymentDate,
        commission_payment_reference: paymentData.paymentReference,
      })
      .in("id", transactionIds);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/admin/sales-executives");
    revalidatePath("/admin/commission-payments");
    return { success: true, data: payment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// SALES EXECUTIVE SELF-UPDATE
// ============================================

export async function updateOwnProfile(formData: {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await (supabase.from("sales_executives") as any)
      .update({
        full_name: formData.fullName,
        phone: formData.phone,
        alternate_phone: formData.alternatePhone,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/sales/profile");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
