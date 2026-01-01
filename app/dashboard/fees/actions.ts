"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CreateFeePaymentData } from "@/lib/types/modules";

// Fee Structures
export async function getFeeStructures(filters?: {
  class_id?: string;
  status?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  let query = supabase
    .from("fee_structures")
    .select(
      `
      *,
      class:classes(id, name),
      academic_year:academic_years(id, name)
    `
    )
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (filters?.class_id) {
    query = query.eq("class_id", filters.class_id);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data: feeStructures, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: feeStructures };
}

export async function createFeeStructure(data: any) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { data: feeStructure, error } = await supabase
    .from("fee_structures")
    .insert({
      ...data,
      tenant_id: (member as { tenant_id: string }).tenant_id,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/fees");
  return { success: true, data: feeStructure };
}

export async function updateFeeStructure(id: string, data: Partial<any>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: feeStructure, error } = await supabase
    .from("fee_structures")
    // @ts-expect-error - Supabase type inference issue with update
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/fees");
  return { success: true, data: feeStructure };
}

export async function deleteFeeStructure(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("fee_structures")
    // @ts-expect-error - Supabase type inference issue with update
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/fees");
  return { success: true };
}

// Fee Payments
export async function getFeePayments(filters?: {
  student_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  let query = supabase
    .from("fee_payments")
    .select(
      `
      *,
      student:students!inner(id, admission_no, first_name, last_name),
      fee_structure:fee_structures(id, name, amount)
    `
    )
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("is_deleted", false)
    .order("payment_date", { ascending: false });

  if (filters?.student_id) {
    query = query.eq("student_id", filters.student_id);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.date_from) {
    query = query.gte("payment_date", filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte("payment_date", filters.date_to);
  }

  const { data: payments, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  // Calculate due amount for each payment
  const paymentsWithDue = await Promise.all(
    (payments || []).map(async (payment: any) => {
      if (!payment.fee_structure_id || !payment.student_id) {
        return { ...payment, dueAmount: 0 };
      }

      // Get all completed payments for this student and fee structure
      const { data: allPayments } = await supabase
        .from("fee_payments")
        .select("amount_paid")
        .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
        .eq("student_id", payment.student_id)
        .eq("fee_structure_id", payment.fee_structure_id)
        .eq("status", "completed")
        .eq("is_deleted", false);

      const totalPaid =
        allPayments?.reduce(
          (sum: number, p: any) => sum + Number(p.amount_paid),
          0
        ) || 0;
      const totalDue = payment.fee_structure?.amount
        ? Number(payment.fee_structure.amount)
        : 0;
      const dueAmount = totalDue - totalPaid;

      return {
        ...payment,
        dueAmount: dueAmount > 0 ? dueAmount : 0,
        totalDue,
        totalPaid,
      };
    })
  );

  return { success: true, data: paymentsWithDue };
}

export async function createFeePayment(data: CreateFeePaymentData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { data: payment, error } = await supabase
    .from("fee_payments")
    // @ts-expect-error - Supabase type inference issue with insert
    .insert({
      ...data,
      tenant_id: (member as { tenant_id: string }).tenant_id,
      created_by: user.id,
      payment_date: data.payment_date || new Date().toISOString().split("T")[0],
      status: data.status || "completed",
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/fees");
  return { success: true, data: payment };
}

export async function updateFeePayment(id: string, data: Partial<any>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: payment, error } = await supabase
    .from("fee_payments")
    // @ts-expect-error - Supabase type inference issue with update
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/fees");
  return { success: true, data: payment };
}

export async function deleteFeePayment(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("fee_payments")
    // @ts-expect-error - Supabase type inference issue with update
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/fees");
  return { success: true };
}

// Get student fee summary
export async function getStudentFeeSummary(studentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  // Get student details
  const { data: student } = await supabase
    .from("students")
    .select("*, class:classes(id, name)")
    .eq("id", studentId)
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .single();

  if (!student) {
    return { success: false, error: "Student not found" };
  }

  // Get fee structure for student's class
  const { data: feeStructure } = await supabase
    .from("fee_structures")
    .select("*")
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("class_id", (student as any).class_id)
    .eq("status", "active")
    .eq("is_deleted", false)
    .single();

  // Get all payments for this student
  const { data: payments } = await supabase
    .from("fee_payments")
    .select("*")
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("student_id", studentId)
    .eq("is_deleted", false)
    .eq("status", "completed");

  const totalPaid =
    payments?.reduce((sum: number, p: any) => sum + Number(p.amount_paid), 0) ||
    0;
  const totalDue = feeStructure ? Number((feeStructure as any).amount) : 0;
  const balance = totalDue - totalPaid;

  return {
    success: true,
    data: {
      student,
      feeStructure,
      payments,
      summary: {
        totalDue,
        totalPaid,
        balance,
      },
    },
  };
}

// Get students for dropdown
export async function getStudentsForFees() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { data: students, error } = await supabase
    .from("students")
    .select("id, admission_no, first_name, last_name, class:classes(name)")
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("status", "active")
    .eq("is_deleted", false)
    .order("first_name");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: students };
}

// Get classes (reuse from students)
export async function getClasses() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { data: classes, error } = await supabase
    .from("classes")
    .select("id, name")
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("is_deleted", false)
    .order("name");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: classes };
}

// Helper function: Calculate due amount for a student and fee structure
export async function calculateDueAmount(
  studentId: string,
  feeStructureId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  // Get fee structure total
  const { data: feeStructure } = await supabase
    .from("fee_structures")
    .select("amount")
    .eq("id", feeStructureId)
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("is_deleted", false)
    .single();

  if (!feeStructure) {
    return { success: false, error: "Fee structure not found" };
  }

  // Get all completed payments for this student and fee structure
  const { data: payments } = await supabase
    .from("fee_payments")
    .select("amount_paid")
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("student_id", studentId)
    .eq("fee_structure_id", feeStructureId)
    .eq("status", "completed")
    .eq("is_deleted", false);

  const totalPaid =
    payments?.reduce((sum: number, p: any) => sum + Number(p.amount_paid), 0) ||
    0;
  const totalDue = Number((feeStructure as any).amount);
  const dueAmount = totalDue - totalPaid;

  return {
    success: true,
    data: {
      totalDue,
      totalPaid,
      dueAmount: dueAmount > 0 ? dueAmount : 0,
    },
  };
}
