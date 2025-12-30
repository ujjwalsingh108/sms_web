import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/helpers/tenant";

export async function GET() {
  try {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const { data: students, error } = await supabase
      .from("students")
      .select("id, first_name, last_name, admission_no")
      .eq("tenant_id", tenant.tenant_id)
      .order("first_name", { ascending: true });

    if (error) {
      console.error("Error fetching students:", error);
      return NextResponse.json(
        { error: "Failed to fetch students" },
        { status: 500 }
      );
    }

    return NextResponse.json(students || []);
  } catch (error) {
    console.error("Error in students API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
