"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// Helper function to generate random password
function generatePassword(length: number = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Get admin client with service role key
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createAdminClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// =====================================================
// STAFF MANAGEMENT
// =====================================================

export interface CreateStaffInput {
  salutation?: "Mr." | "Mrs." | "Miss" | "Ms." | "Dr." | "Prof.";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  qualification?: string;
  designation?: string;
  department?: string;
  staffType: string;
  dateOfJoining?: string;
  salary?: number;
  employeeId: string;
}

export async function createStaffMember(input: CreateStaffInput) {
  try {
    const supabase = await createClient();
    const adminClient = getAdminClient();

    // Get current user and verify they're a school admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // Get user's tenant
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("tenant_id, role:role_id(name)")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    if (memberError || !memberData) {
      return { error: "No tenant found for user" };
    }

    const tenantId = (memberData as any).tenant_id;
    const roleName = (memberData as any).role?.name;

    // Verify user is admin
    if (roleName !== "admin" && roleName !== "superadmin") {
      return { error: "Only admins can create staff members" };
    }

    // Generate password
    const generatedPassword = generatePassword();

    // Create user in auth.users using service role
    const { data: authUser, error: authError } =
      await adminClient.auth.admin.createUser({
        email: input.email,
        password: generatedPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: `${input.firstName} ${input.lastName}`,
          role: "staff",
        },
      });

    if (authError || !authUser.user) {
      console.error("Auth error:", authError);
      return { error: authError?.message || "Failed to create user account" };
    }

    // Get staff role
    const { data: staffRole } = await adminClient
      .from("roles")
      .select("id")
      .eq("name", "staff")
      .single();

    if (!staffRole) {
      // Clean up auth user if role not found
      await adminClient.auth.admin.deleteUser(authUser.user.id);
      return { error: "Staff role not found in database" };
    }

    // Create staff record using admin client to bypass RLS
    const { data: staff, error: staffError } = await adminClient
      .from("staff")
      .insert({
        tenant_id: tenantId,
        user_id: authUser.user.id,
        employee_id: input.employeeId,
        salutation: input.salutation,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
        date_of_birth: input.dateOfBirth,
        gender: input.gender,
        address: input.address,
        qualification: input.qualification,
        designation: input.designation,
        department: input.department,
        staff_type: input.staffType,
        date_of_joining: input.dateOfJoining,
        salary: input.salary,
        status: "active",
      })
      .select()
      .single();

    if (staffError) {
      console.error("Staff creation error:", staffError);
      // Clean up auth user
      await adminClient.auth.admin.deleteUser(authUser.user.id);
      return { error: staffError.message };
    }

    // Create member record using admin client
    const { error: newMemberError } = await adminClient.from("members").insert({
      user_id: authUser.user.id,
      tenant_id: tenantId,
      role_id: (staffRole as any).id,
      status: "approved",
    });

    if (newMemberError) {
      console.error("Member creation error:", newMemberError);
      // Clean up staff and auth user
      await supabase
        .from("staff")
        .delete()
        .eq("id", (staff as any).id);
      await adminClient.auth.admin.deleteUser(authUser.user.id);
      return { error: newMemberError.message };
    }

    return {
      success: true,
      data: {
        staff,
        credentials: {
          email: input.email,
          password: generatedPassword,
        },
      },
    };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

// =====================================================
// STUDENT MANAGEMENT
// =====================================================

export interface CreateStudentInput {
  admissionNo: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  bloodGroup?: string;
  email?: string;
  phone?: string;
  address?: string;
  classId?: string;
  sectionId?: string;
  admissionDate?: string;
  createLoginAccess?: boolean; // Whether to create login credentials
}

export async function createStudent(input: CreateStudentInput) {
  try {
    const supabase = await createClient();
    const adminClient = getAdminClient();

    // Get current user and verify they're a school admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // Get user's tenant
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("tenant_id, role:role_id(name)")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    if (memberError || !memberData) {
      return { error: "No tenant found for user" };
    }

    const tenantId = (memberData as any).tenant_id;
    const roleName = (memberData as any).role?.name;

    // Verify user is admin
    if (roleName !== "admin" && roleName !== "superadmin") {
      return { error: "Only admins can create students" };
    }

    let authUserId = null;
    let generatedPassword = null;

    // Create login access if requested and email is provided
    if (input.createLoginAccess && input.email) {
      generatedPassword = generatePassword();

      const { data: authUser, error: authError } =
        await adminClient.auth.admin.createUser({
          email: input.email,
          password: generatedPassword,
          email_confirm: true,
          user_metadata: {
            full_name: `${input.firstName} ${input.lastName}`,
            role: "student",
          },
        });

      if (authError || !authUser.user) {
        console.error("Auth error:", authError);
        return {
          error: authError?.message || "Failed to create user account",
        };
      }

      authUserId = authUser.user.id;
    }

    // Create student record using admin client to bypass RLS
    const { data: student, error: studentError } = await adminClient
      .from("students")
      .insert({
        tenant_id: tenantId,
        user_id: authUserId,
        admission_no: input.admissionNo,
        first_name: input.firstName,
        last_name: input.lastName,
        date_of_birth: input.dateOfBirth,
        gender: input.gender,
        blood_group: input.bloodGroup,
        email: input.email,
        phone: input.phone,
        address: input.address,
        class_id: input.classId,
        section_id: input.sectionId,
        admission_date: input.admissionDate,
        status: "active",
      })
      .select()
      .single();

    if (studentError) {
      console.error("Student creation error:", studentError);
      // Clean up auth user if created
      if (authUserId) {
        await adminClient.auth.admin.deleteUser(authUserId);
      }
      return { error: studentError.message };
    }

    // Create member record if login access was created
    if (authUserId) {
      const { data: studentRole } = await adminClient
        .from("roles")
        .select("id")
        .eq("name", "student")
        .single();

      if (studentRole) {
        const { error: newMemberError } = await adminClient
          .from("members")
          .insert({
            user_id: authUserId,
            tenant_id: tenantId,
            role_id: (studentRole as any).id,
            status: "approved",
          });

        if (newMemberError) {
          console.error("Member creation error:", newMemberError);
          // Clean up student and auth user
          await supabase
            .from("students")
            .delete()
            .eq("id", (student as any).id);
          await adminClient.auth.admin.deleteUser(authUserId);
          return { error: newMemberError.message };
        }
      }
    }

    return {
      success: true,
      data: {
        student,
        credentials: generatedPassword
          ? {
              email: input.email!,
              password: generatedPassword,
            }
          : null,
      },
    };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

// =====================================================
// GUARDIAN MANAGEMENT
// =====================================================

export interface CreateGuardianInput {
  studentId: string;
  name: string;
  relationship?: string;
  phone?: string;
  email?: string;
  occupation?: string;
  address?: string;
  isPrimary?: boolean;
  createLoginAccess?: boolean; // Whether to create login credentials
}

export async function createGuardian(input: CreateGuardianInput) {
  try {
    const supabase = await createClient();
    const adminClient = getAdminClient();

    // Get current user and verify they're a school admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // Get user's tenant
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("tenant_id, role:role_id(name)")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    if (memberError || !memberData) {
      return { error: "No tenant found for user" };
    }

    const tenantId = (memberData as any).tenant_id;
    const roleName = (memberData as any).role?.name;

    // Verify user is admin
    if (roleName !== "admin" && roleName !== "superadmin") {
      return { error: "Only admins can create guardians" };
    }

    let authUserId = null;
    let generatedPassword = null;

    // Create login access if requested and email is provided
    if (input.createLoginAccess && input.email) {
      generatedPassword = generatePassword();

      const { data: authUser, error: authError } =
        await adminClient.auth.admin.createUser({
          email: input.email,
          password: generatedPassword,
          email_confirm: true,
          user_metadata: {
            full_name: input.name,
            role: "parent",
          },
        });

      if (authError || !authUser.user) {
        console.error("Auth error:", authError);
        return {
          error: authError?.message || "Failed to create user account",
        };
      }

      authUserId = authUser.user.id;
    }

    // Create guardian record using admin client to bypass RLS
    const { data: guardian, error: guardianError } = await adminClient
      .from("guardians")
      .insert({
        tenant_id: tenantId,
        student_id: input.studentId,
        user_id: authUserId,
        name: input.name,
        relationship: input.relationship,
        phone: input.phone,
        email: input.email,
        occupation: input.occupation,
        address: input.address,
        is_primary: input.isPrimary,
      })
      .select()
      .single();

    if (guardianError) {
      console.error("Guardian creation error:", guardianError);
      // Clean up auth user if created
      if (authUserId) {
        await adminClient.auth.admin.deleteUser(authUserId);
      }
      return { error: guardianError.message };
    }

    // Create member record if login access was created
    if (authUserId) {
      const { data: parentRole } = await adminClient
        .from("roles")
        .select("id")
        .eq("name", "parent")
        .single();

      if (parentRole) {
        const { error: newMemberError } = await adminClient
          .from("members")
          .insert({
            user_id: authUserId,
            tenant_id: tenantId,
            role_id: (parentRole as any).id,
            status: "approved",
          });

        if (newMemberError) {
          console.error("Member creation error:", newMemberError);
          // Clean up guardian and auth user
          await supabase
            .from("guardians")
            .delete()
            .eq("id", (guardian as any).id);
          await adminClient.auth.admin.deleteUser(authUserId);
          return { error: newMemberError.message };
        }
      }
    }

    return {
      success: true,
      data: {
        guardian,
        credentials: generatedPassword
          ? {
              email: input.email!,
              password: generatedPassword,
            }
          : null,
      },
    };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

// =====================================================
// FETCH FUNCTIONS
// =====================================================

export async function getStaffMembers() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const { data: memberData } = await supabase
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    if (!memberData) {
      return { error: "No tenant found" };
    }

    const tenantId = (memberData as any).tenant_id;

    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getStudents() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const { data: memberData } = await supabase
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    if (!memberData) {
      return { error: "No tenant found" };
    }

    const tenantId = (memberData as any).tenant_id;

    const { data, error } = await supabase
      .from("students")
      .select(
        `
        *,
        class:class_id(id, name),
        section:section_id(id, name)
      `
      )
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}
