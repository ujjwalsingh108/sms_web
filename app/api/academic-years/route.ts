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

    const { data: academicYears, error } = await supabase
      .from("academic_years")
      .select("id, name, start_date, end_date, is_current")
      .eq("tenant_id", tenant.tenant_id)
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching academic years:", error);
      return NextResponse.json(
        { error: "Failed to fetch academic years" },
        { status: 500 }
      );
    }

    return NextResponse.json(academicYears || []);
  } catch (error) {
    console.error("Error in academic years API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
