import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/helpers/tenant";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ routeId: string }> }
) {
  try {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();
    const { routeId } = await params;

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    const { data: stops, error } = await supabase
      .from("route_stops")
      .select("id, stop_name, stop_order, arrival_time, departure_time")
      .eq("tenant_id", tenant.tenant_id)
      .eq("route_id", routeId)
      .order("stop_order", { ascending: true });

    if (error) {
      console.error("Error fetching stops:", error);
      return NextResponse.json(
        { error: "Failed to fetch stops" },
        { status: 500 }
      );
    }

    return NextResponse.json(stops || []);
  } catch (error) {
    console.error("Error in stops API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
