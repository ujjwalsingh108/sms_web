export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          name: string;
          display_name: string | null;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          display_name?: string | null;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          display_name?: string | null;
          description?: string | null;
          created_at?: string | null;
        };
      };
      tenants: {
        Row: {
          id: string;
          name: string;
          domain: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          domain?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      members: {
        Row: {
          id: string;
          user_id: string;
          tenant_id: string;
          role_id: string;
          status: "pending" | "approved" | "rejected";
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          tenant_id: string;
          role_id: string;
          status?: "pending" | "approved" | "rejected";
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          tenant_id?: string;
          role_id?: string;
          status?: "pending" | "approved" | "rejected";
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      students: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string | null;
          admission_no: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: "male" | "female" | "other";
          blood_group: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          pincode: string | null;
          phone: string | null;
          email: string | null;
          parent_id: string | null;
          class_id: string | null;
          section_id: string | null;
          admission_date: string;
          status: "active" | "inactive" | "graduated" | "withdrawn";
          photo_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id?: string | null;
          admission_no: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: "male" | "female" | "other";
          blood_group?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          phone?: string | null;
          email?: string | null;
          parent_id?: string | null;
          class_id?: string | null;
          section_id?: string | null;
          admission_date: string;
          status?: "active" | "inactive" | "graduated" | "withdrawn";
          photo_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string | null;
          admission_no?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string;
          gender?: "male" | "female" | "other";
          blood_group?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          phone?: string | null;
          email?: string | null;
          parent_id?: string | null;
          class_id?: string | null;
          section_id?: string | null;
          admission_date?: string;
          status?: "active" | "inactive" | "graduated" | "withdrawn";
          photo_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      staff: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string | null;
          employee_id: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: "male" | "female" | "other";
          blood_group: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          pincode: string | null;
          phone: string;
          email: string;
          designation: string;
          department: string | null;
          qualification: string | null;
          experience_years: number | null;
          joining_date: string;
          salary: number | null;
          status: "active" | "inactive" | "on_leave";
          photo_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id?: string | null;
          employee_id: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: "male" | "female" | "other";
          blood_group?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          phone: string;
          email: string;
          designation: string;
          department?: string | null;
          qualification?: string | null;
          experience_years?: number | null;
          joining_date: string;
          salary?: number | null;
          status?: "active" | "inactive" | "on_leave";
          photo_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string | null;
          employee_id?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string;
          gender?: "male" | "female" | "other";
          blood_group?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          phone?: string;
          email?: string;
          designation?: string;
          department?: string | null;
          qualification?: string | null;
          experience_years?: number | null;
          joining_date?: string;
          salary?: number | null;
          status?: "active" | "inactive" | "on_leave";
          photo_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      classes: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string | null;
        };
      };
      sections: {
        Row: {
          id: string;
          tenant_id: string;
          class_id: string;
          name: string;
          capacity: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          class_id: string;
          name: string;
          capacity?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          class_id?: string;
          name?: string;
          capacity?: number | null;
          created_at?: string | null;
        };
      };
      subjects: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          code: string;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          code: string;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          created_at?: string | null;
        };
      };
      timetable: {
        Row: {
          id: string;
          tenant_id: string;
          class_id: string;
          section_id: string;
          subject_id: string;
          staff_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          room_no: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          class_id: string;
          section_id: string;
          subject_id: string;
          staff_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          room_no?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          class_id?: string;
          section_id?: string;
          subject_id?: string;
          staff_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          room_no?: string | null;
          created_at?: string | null;
        };
      };
      fee_structures: {
        Row: {
          id: string;
          tenant_id: string;
          class_id: string;
          name: string;
          amount: number;
          frequency:
            | "monthly"
            | "quarterly"
            | "half_yearly"
            | "yearly"
            | "one_time";
          due_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          class_id: string;
          name: string;
          amount: number;
          frequency:
            | "monthly"
            | "quarterly"
            | "half_yearly"
            | "yearly"
            | "one_time";
          due_date?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          class_id?: string;
          name?: string;
          amount?: number;
          frequency?:
            | "monthly"
            | "quarterly"
            | "half_yearly"
            | "yearly"
            | "one_time";
          due_date?: string | null;
          created_at?: string | null;
        };
      };
      fee_payments: {
        Row: {
          id: string;
          tenant_id: string;
          student_id: string;
          fee_structure_id: string;
          amount_paid: number;
          payment_date: string;
          payment_method: "cash" | "card" | "upi" | "bank_transfer" | "cheque";
          transaction_id: string | null;
          receipt_no: string;
          status: "pending" | "completed" | "failed";
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          student_id: string;
          fee_structure_id: string;
          amount_paid: number;
          payment_date: string;
          payment_method: "cash" | "card" | "upi" | "bank_transfer" | "cheque";
          transaction_id?: string | null;
          receipt_no: string;
          status?: "pending" | "completed" | "failed";
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          student_id?: string;
          fee_structure_id?: string;
          amount_paid?: number;
          payment_date?: string;
          payment_method?: "cash" | "card" | "upi" | "bank_transfer" | "cheque";
          transaction_id?: string | null;
          receipt_no?: string;
          status?: "pending" | "completed" | "failed";
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      library_books: {
        Row: {
          id: string;
          tenant_id: string;
          title: string;
          author: string;
          isbn: string | null;
          category: string;
          publisher: string | null;
          publication_year: number | null;
          total_copies: number;
          available_copies: number;
          rack_no: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          title: string;
          author: string;
          isbn?: string | null;
          category: string;
          publisher?: string | null;
          publication_year?: number | null;
          total_copies: number;
          available_copies: number;
          rack_no?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          title?: string;
          author?: string;
          isbn?: string | null;
          category?: string;
          publisher?: string | null;
          publication_year?: number | null;
          total_copies?: number;
          available_copies?: number;
          rack_no?: string | null;
          created_at?: string | null;
        };
      };
      library_transactions: {
        Row: {
          id: string;
          tenant_id: string;
          book_id: string;
          student_id: string | null;
          staff_id: string | null;
          issue_date: string;
          due_date: string;
          return_date: string | null;
          fine_amount: number | null;
          status: "issued" | "returned" | "overdue";
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          book_id: string;
          student_id?: string | null;
          staff_id?: string | null;
          issue_date: string;
          due_date: string;
          return_date?: string | null;
          fine_amount?: number | null;
          status?: "issued" | "returned" | "overdue";
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          book_id?: string;
          student_id?: string | null;
          staff_id?: string | null;
          issue_date?: string;
          due_date?: string;
          return_date?: string | null;
          fine_amount?: number | null;
          status?: "issued" | "returned" | "overdue";
          created_at?: string | null;
        };
      };
      exams: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          exam_type: "unit_test" | "mid_term" | "final" | "practical" | "other";
          class_id: string;
          start_date: string;
          end_date: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          exam_type: "unit_test" | "mid_term" | "final" | "practical" | "other";
          class_id: string;
          start_date: string;
          end_date: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          exam_type?:
            | "unit_test"
            | "mid_term"
            | "final"
            | "practical"
            | "other";
          class_id?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string | null;
        };
      };
      exam_results: {
        Row: {
          id: string;
          tenant_id: string;
          exam_id: string;
          student_id: string;
          subject_id: string;
          marks_obtained: number;
          total_marks: number;
          grade: string | null;
          remarks: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          exam_id: string;
          student_id: string;
          subject_id: string;
          marks_obtained: number;
          total_marks: number;
          grade?: string | null;
          remarks?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          exam_id?: string;
          student_id?: string;
          subject_id?: string;
          marks_obtained?: number;
          total_marks?: number;
          grade?: string | null;
          remarks?: string | null;
          created_at?: string | null;
        };
      };
      transport_routes: {
        Row: {
          id: string;
          tenant_id: string;
          route_name: string;
          route_number: string;
          starting_point: string;
          ending_point: string;
          total_distance: number | null;
          fare: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          route_name: string;
          route_number: string;
          starting_point: string;
          ending_point: string;
          total_distance?: number | null;
          fare: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          route_name?: string;
          route_number?: string;
          starting_point?: string;
          ending_point?: string;
          total_distance?: number | null;
          fare?: number;
          created_at?: string | null;
        };
      };
      vehicles: {
        Row: {
          id: string;
          tenant_id: string;
          vehicle_number: string;
          vehicle_type: "bus" | "van" | "car";
          capacity: number;
          driver_name: string;
          driver_phone: string;
          route_id: string | null;
          status: "active" | "maintenance" | "inactive";
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          vehicle_number: string;
          vehicle_type: "bus" | "van" | "car";
          capacity: number;
          driver_name: string;
          driver_phone: string;
          route_id?: string | null;
          status?: "active" | "maintenance" | "inactive";
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          vehicle_number?: string;
          vehicle_type?: "bus" | "van" | "car";
          capacity?: number;
          driver_name?: string;
          driver_phone?: string;
          route_id?: string | null;
          status?: "active" | "maintenance" | "inactive";
          created_at?: string | null;
        };
      };
      transport_allocations: {
        Row: {
          id: string;
          tenant_id: string;
          student_id: string;
          route_id: string;
          pickup_point: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          student_id: string;
          route_id: string;
          pickup_point: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          student_id?: string;
          route_id?: string;
          pickup_point?: string;
          created_at?: string | null;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          tenant_id: string;
          item_name: string;
          category: string;
          quantity: number;
          unit: string;
          reorder_level: number | null;
          price_per_unit: number;
          supplier: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          item_name: string;
          category: string;
          quantity: number;
          unit: string;
          reorder_level?: number | null;
          price_per_unit: number;
          supplier?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          item_name?: string;
          category?: string;
          quantity?: number;
          unit?: string;
          reorder_level?: number | null;
          price_per_unit?: number;
          supplier?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      purchase_orders: {
        Row: {
          id: string;
          tenant_id: string;
          order_number: string;
          supplier: string;
          order_date: string;
          total_amount: number;
          status: "pending" | "approved" | "received" | "cancelled";
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          order_number: string;
          supplier: string;
          order_date: string;
          total_amount: number;
          status?: "pending" | "approved" | "received" | "cancelled";
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          order_number?: string;
          supplier?: string;
          order_date?: string;
          total_amount?: number;
          status?: "pending" | "approved" | "received" | "cancelled";
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      hostel_buildings: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          type: "boys" | "girls" | "staff";
          total_rooms: number;
          warden_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          type: "boys" | "girls" | "staff";
          total_rooms: number;
          warden_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          type?: "boys" | "girls" | "staff";
          total_rooms?: number;
          warden_id?: string | null;
          created_at?: string | null;
        };
      };
      hostel_rooms: {
        Row: {
          id: string;
          tenant_id: string;
          building_id: string;
          room_number: string;
          capacity: number;
          occupied: number;
          floor: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          building_id: string;
          room_number: string;
          capacity: number;
          occupied?: number;
          floor: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          building_id?: string;
          room_number?: string;
          capacity?: number;
          occupied?: number;
          floor?: number;
          created_at?: string | null;
        };
      };
      hostel_allocations: {
        Row: {
          id: string;
          tenant_id: string;
          student_id: string;
          room_id: string;
          allocation_date: string;
          checkout_date: string | null;
          status: "active" | "checkout";
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          student_id: string;
          room_id: string;
          allocation_date: string;
          checkout_date?: string | null;
          status?: "active" | "checkout";
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          student_id?: string;
          room_id?: string;
          allocation_date?: string;
          checkout_date?: string | null;
          status?: "active" | "checkout";
          created_at?: string | null;
        };
      };
      attendance: {
        Row: {
          id: string;
          tenant_id: string;
          student_id: string | null;
          staff_id: string | null;
          date: string;
          status: "present" | "absent" | "half_day" | "leave";
          remarks: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          student_id?: string | null;
          staff_id?: string | null;
          date: string;
          status: "present" | "absent" | "half_day" | "leave";
          remarks?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          student_id?: string | null;
          staff_id?: string | null;
          date?: string;
          status?: "present" | "absent" | "half_day" | "leave";
          remarks?: string | null;
          created_at?: string | null;
        };
      };
      accounts: {
        Row: {
          id: string;
          tenant_id: string;
          transaction_date: string;
          type: "income" | "expense";
          category: string;
          amount: number;
          description: string | null;
          payment_method: "cash" | "card" | "upi" | "bank_transfer" | "cheque";
          reference_no: string | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          transaction_date: string;
          type: "income" | "expense";
          category: string;
          amount: number;
          description?: string | null;
          payment_method: "cash" | "card" | "upi" | "bank_transfer" | "cheque";
          reference_no?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          transaction_date?: string;
          type?: "income" | "expense";
          category?: string;
          amount?: number;
          description?: string | null;
          payment_method?: "cash" | "card" | "upi" | "bank_transfer" | "cheque";
          reference_no?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      visitors: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          phone: string;
          purpose: string;
          whom_to_meet: string;
          check_in: string;
          check_out: string | null;
          id_proof_type: string | null;
          id_proof_number: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          phone: string;
          purpose: string;
          whom_to_meet: string;
          check_in: string;
          check_out?: string | null;
          id_proof_type?: string | null;
          id_proof_number?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          phone?: string;
          purpose?: string;
          whom_to_meet?: string;
          check_in?: string;
          check_out?: string | null;
          id_proof_type?: string | null;
          id_proof_number?: string | null;
          created_at?: string | null;
        };
      };
      medical_records: {
        Row: {
          id: string;
          tenant_id: string;
          student_id: string | null;
          staff_id: string | null;
          date: string;
          complaint: string;
          diagnosis: string | null;
          treatment: string | null;
          medicines_prescribed: string | null;
          doctor_name: string | null;
          follow_up_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          student_id?: string | null;
          staff_id?: string | null;
          date: string;
          complaint: string;
          diagnosis?: string | null;
          treatment?: string | null;
          medicines_prescribed?: string | null;
          doctor_name?: string | null;
          follow_up_date?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          student_id?: string | null;
          staff_id?: string | null;
          date?: string;
          complaint?: string;
          diagnosis?: string | null;
          treatment?: string | null;
          medicines_prescribed?: string | null;
          doctor_name?: string | null;
          follow_up_date?: string | null;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
