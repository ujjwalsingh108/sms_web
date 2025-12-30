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

    const { data: routes, error } = await supabase
      .from("routes")
      .select("id, route_name, route_number")
      .eq("tenant_id", tenant.tenant_id)
      .eq("status", "active")
      .order("route_name", { ascending: true });

    if (error) {
      console.error("Error fetching routes:", error);
      return NextResponse.json(
        { error: "Failed to fetch routes" },
        { status: 500 }
      );
    }

    return NextResponse.json(routes || []);
  } catch (error) {
    console.error("Error in routes API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
