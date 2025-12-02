// Student Module Types

export interface Student {
  id: string;
  tenant_id: string;
  admission_no: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  blood_group: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  photo_url: string | null;
  class_id: string | null;
  section_id: string | null;
  admission_date: string | null;
  status: "active" | "inactive" | "graduated" | "transferred";
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentWithDetails extends Student {
  class: {
    id: string;
    name: string;
  } | null;
  section: {
    id: string;
    name: string;
  } | null;
  guardians?: Guardian[];
}

export interface CreateFeePaymentData {
  student_id: string;
  fee_structure_id?: string;
  amount_paid: number;
  payment_date: string;
  payment_method:
    | "cash"
    | "card"
    | "upi"
    | "cheque"
    | "bank_transfer"
    | "other";
  transaction_id?: string;
  notes?: string;
  status: "pending" | "completed" | "failed";
}

export interface Guardian {
  id: string;
  tenant_id: string;
  student_id: string;
  name: string;
  relationship: string | null;
  phone: string | null;
  email: string | null;
  occupation: string | null;
  address: string | null;
  is_primary: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_at: string;
}

export interface CreateStudentData {
  admission_no: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  blood_group?: string;
  email?: string;
  phone?: string;
  address?: string;
  photo_url?: string;
  class_id?: string;
  section_id?: string;
  admission_date?: string;
  status?: "active" | "inactive" | "graduated" | "transferred";
  guardians?: Omit<
    Guardian,
    | "id"
    | "tenant_id"
    | "student_id"
    | "created_at"
    | "is_deleted"
    | "deleted_at"
    | "deleted_by"
  >[];
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  id: string;
}

// Fee Module Types

export interface FeeStructure {
  id: string;
  tenant_id: string;
  name: string;
  class_id: string | null;
  amount: number;
  frequency: "monthly" | "quarterly" | "yearly" | "one_time";
  academic_year_id: string | null;
  status: "active" | "inactive";
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_at: string;
}

export interface FeeStructureWithDetails extends FeeStructure {
  class: {
    id: string;
    name: string;
  } | null;
  academic_year: {
    id: string;
    name: string;
  } | null;
}

export interface FeePayment {
  id: string;
  tenant_id: string;
  student_id: string;
  fee_structure_id: string | null;
  amount_paid: number;
  payment_date: string;
  payment_method: "cash" | "cheque" | "online" | "card" | "upi" | null;
  transaction_id: string | null;
  status: "pending" | "completed" | "failed" | "refunded";
  remarks: string | null;
  created_by: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_at: string;
}

export interface FeePaymentWithDetails extends FeePayment {
  student: {
    id: string;
    admission_no: string;
    first_name: string;
    last_name: string;
  };
  fee_structure: {
    id: string;
    name: string;
    amount: number;
  } | null;
}

export interface FeeDiscount {
  id: string;
  tenant_id: string;
  student_id: string;
  fee_structure_id: string;
  discount_percentage: number | null;
  discount_amount: number | null;
  reason: string | null;
  approved_by: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_at: string;
}

export interface CreateFeePaymentData {
  student_id: string;
  fee_structure_id?: string;
  amount_paid: number;
  payment_date?: string;
  payment_method?: "cash" | "cheque" | "online" | "card" | "upi";
  transaction_id?: string;
  status?: "pending" | "completed" | "failed" | "refunded";
  remarks?: string;
}

// Attendance Module Types

export interface StudentAttendance {
  id: string;
  tenant_id: string;
  student_id: string;
  class_id: string;
  section_id: string | null;
  date: string;
  status: "present" | "absent" | "half_day" | "late";
  remarks: string | null;
  marked_by: string | null;
  created_at: string;
}

export interface StudentAttendanceWithDetails extends StudentAttendance {
  student: {
    id: string;
    admission_no: string;
    first_name: string;
    last_name: string;
  };
}

export interface AttendanceMarkingData {
  student_id: string;
  status: "present" | "absent" | "half_day" | "late";
  remarks?: string;
}

export interface BulkAttendanceData {
  class_id: string;
  section_id?: string;
  date: string;
  attendance: AttendanceMarkingData[];
}

export interface AttendanceStats {
  total_days: number;
  present: number;
  absent: number;
  half_day: number;
  late: number;
  attendance_percentage: number;
}

// Academic Structure Types (needed for students and fees)

export interface Class {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  is_deleted: boolean;
  created_at: string;
}

export interface Section {
  id: string;
  tenant_id: string;
  class_id: string;
  name: string;
  room_number: string | null;
  capacity: number | null;
  is_deleted: boolean;
  created_at: string;
}

export interface AcademicYear {
  id: string;
  tenant_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
}
