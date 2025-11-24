export interface AdmissionApplication {
  id: string;
  tenant_id: string;
  application_no: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  previous_school: string | null;
  previous_class: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  guardian_email: string | null;
  guardian_relation: "father" | "mother" | "guardian" | "other" | null;
  guardian_occupation: string | null;
  applied_class_id: string | null;
  academic_year_id: string | null;
  status: "pending" | "approved" | "rejected" | "waitlisted";
  applied_date: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string;
}

export interface AcademicYear {
  id: string;
  name: string;
}

export interface AdmissionApplicationWithRelations
  extends AdmissionApplication {
  class: Class | null;
  academic_year: AcademicYear | null;
}

export type AdmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "waitlisted";

// Insert type - fields required when creating a new admission
export type AdmissionApplicationInsert = Omit<
  AdmissionApplication,
  "id" | "created_at" | "updated_at"
>;

// Update type - partial fields for updating
export type AdmissionApplicationUpdate = Partial<
  Omit<AdmissionApplication, "id" | "created_at" | "updated_at">
>;
