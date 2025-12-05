"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// VEHICLE TYPES & ACTIONS
// =====================================================

export type Vehicle = {
  id: string;
  tenant_id: string;
  vehicle_number: string;
  vehicle_type: string | null;
  model: string | null;
  capacity: number | null;
  driver_name: string | null;
  driver_phone: string | null;
  driver_license: string | null;
  status: "active" | "inactive" | "maintenance";
  created_at: string;
};

export type Route = {
  id: string;
  tenant_id: string;
  route_name: string;
  route_number: string | null;
  starting_point: string | null;
  ending_point: string | null;
  distance_km: number | null;
  fare: number | null;
  status: "active" | "inactive";
  created_at: string;
};

export type RouteStop = {
  id: string;
  tenant_id: string;
  route_id: string;
  stop_name: string;
  stop_order: number;
  pickup_time: string | null;
  drop_time: string | null;
  created_at: string;
};

export type VehicleAssignment = {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  route_id: string;
  assigned_date: string;
  status: "active" | "inactive";
  created_at: string;
};

export type StudentTransport = {
  id: string;
  tenant_id: string;
  student_id: string;
  route_id: string;
  stop_id: string | null;
  academic_year_id: string | null;
  status: "active" | "inactive";
  created_at: string;
};

// =====================================================
// VEHICLE ACTIONS
// =====================================================

export async function getVehicles(filters?: {
  status?: string;
  search?: string;
}) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  let query = supabaseAny
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `vehicle_number.ilike.%${filters.search}%,driver_name.ilike.%${filters.search}%,model.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching vehicles:", error);
    throw new Error("Failed to fetch vehicles");
  }

  return data as Vehicle[];
}

export async function getVehicleById(id: string) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching vehicle:", error);
    throw new Error("Failed to fetch vehicle");
  }

  return data as Vehicle;
}

export async function createVehicle(formData: FormData) {
  const supabase = await createClient();

  const vehicleData = {
    vehicle_number: formData.get("vehicle_number") as string,
    vehicle_type: formData.get("vehicle_type") as string | null,
    model: formData.get("model") as string | null,
    capacity: formData.get("capacity")
      ? parseInt(formData.get("capacity") as string)
      : null,
    driver_name: formData.get("driver_name") as string | null,
    driver_phone: formData.get("driver_phone") as string | null,
    driver_license: formData.get("driver_license") as string | null,
    status:
      (formData.get("status") as "active" | "inactive" | "maintenance") ||
      "active",
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("vehicles")
    .insert([vehicleData])
    .select()
    .single();

  if (error) {
    console.error("Error creating vehicle:", error);
    throw new Error("Failed to create vehicle");
  }

  revalidatePath("/dashboard/transport");
  revalidatePath("/dashboard/transport/vehicles");
  return data as Vehicle;
}

export async function updateVehicle(id: string, formData: FormData) {
  const supabase = await createClient();

  const vehicleData = {
    vehicle_number: formData.get("vehicle_number") as string,
    vehicle_type: formData.get("vehicle_type") as string | null,
    model: formData.get("model") as string | null,
    capacity: formData.get("capacity")
      ? parseInt(formData.get("capacity") as string)
      : null,
    driver_name: formData.get("driver_name") as string | null,
    driver_phone: formData.get("driver_phone") as string | null,
    driver_license: formData.get("driver_license") as string | null,
    status:
      (formData.get("status") as "active" | "inactive" | "maintenance") ||
      "active",
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("vehicles")
    .update(vehicleData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating vehicle:", error);
    throw new Error("Failed to update vehicle");
  }

  revalidatePath("/dashboard/transport");
  revalidatePath("/dashboard/transport/vehicles");
  revalidatePath(`/dashboard/transport/vehicles/${id}`);
  return data as Vehicle;
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { error } = await supabaseAny.from("vehicles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting vehicle:", error);
    throw new Error("Failed to delete vehicle");
  }

  revalidatePath("/dashboard/transport");
  revalidatePath("/dashboard/transport/vehicles");
}

// =====================================================
// ROUTE ACTIONS
// =====================================================

export async function getRoutes(filters?: {
  status?: string;
  search?: string;
}) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  let query = supabaseAny
    .from("routes")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `route_name.ilike.%${filters.search}%,route_number.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching routes:", error);
    throw new Error("Failed to fetch routes");
  }

  return data as Route[];
}

export async function getRouteById(id: string) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("routes")
    .select(
      `
      *,
      stops:route_stops(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching route:", error);
    throw new Error("Failed to fetch route");
  }

  return data;
}

export async function createRoute(formData: FormData) {
  const supabase = await createClient();

  const routeData = {
    route_name: formData.get("route_name") as string,
    route_number: formData.get("route_number") as string | null,
    starting_point: formData.get("starting_point") as string | null,
    ending_point: formData.get("ending_point") as string | null,
    distance_km: formData.get("distance_km")
      ? parseFloat(formData.get("distance_km") as string)
      : null,
    fare: formData.get("fare")
      ? parseFloat(formData.get("fare") as string)
      : null,
    status: (formData.get("status") as "active" | "inactive") || "active",
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("routes")
    .insert([routeData])
    .select()
    .single();

  if (error) {
    console.error("Error creating route:", error);
    throw new Error("Failed to create route");
  }

  revalidatePath("/dashboard/transport");
  revalidatePath("/dashboard/transport/routes");
  return data as Route;
}

export async function updateRoute(id: string, formData: FormData) {
  const supabase = await createClient();

  const routeData = {
    route_name: formData.get("route_name") as string,
    route_number: formData.get("route_number") as string | null,
    starting_point: formData.get("starting_point") as string | null,
    ending_point: formData.get("ending_point") as string | null,
    distance_km: formData.get("distance_km")
      ? parseFloat(formData.get("distance_km") as string)
      : null,
    fare: formData.get("fare")
      ? parseFloat(formData.get("fare") as string)
      : null,
    status: (formData.get("status") as "active" | "inactive") || "active",
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("routes")
    .update(routeData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating route:", error);
    throw new Error("Failed to update route");
  }

  revalidatePath("/dashboard/transport");
  revalidatePath("/dashboard/transport/routes");
  revalidatePath(`/dashboard/transport/routes/${id}`);
  return data as Route;
}

export async function deleteRoute(id: string) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { error } = await supabaseAny.from("routes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting route:", error);
    throw new Error("Failed to delete route");
  }

  revalidatePath("/dashboard/transport");
  revalidatePath("/dashboard/transport/routes");
}

// =====================================================
// ROUTE STOPS ACTIONS
// =====================================================

export async function getRouteStops(routeId: string) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("route_stops")
    .select("*")
    .eq("route_id", routeId)
    .order("stop_order", { ascending: true });

  if (error) {
    console.error("Error fetching route stops:", error);
    throw new Error("Failed to fetch route stops");
  }

  return data as RouteStop[];
}

export async function createRouteStop(formData: FormData) {
  const supabase = await createClient();

  const stopData = {
    route_id: formData.get("route_id") as string,
    stop_name: formData.get("stop_name") as string,
    stop_order: parseInt(formData.get("stop_order") as string),
    pickup_time: formData.get("pickup_time") as string | null,
    drop_time: formData.get("drop_time") as string | null,
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("route_stops")
    .insert([stopData])
    .select()
    .single();

  if (error) {
    console.error("Error creating route stop:", error);
    throw new Error("Failed to create route stop");
  }

  revalidatePath(`/dashboard/transport/routes/${stopData.route_id}`);
  return data as RouteStop;
}

export async function deleteRouteStop(id: string, routeId: string) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { error } = await supabaseAny.from("route_stops").delete().eq("id", id);

  if (error) {
    console.error("Error deleting route stop:", error);
    throw new Error("Failed to delete route stop");
  }

  revalidatePath(`/dashboard/transport/routes/${routeId}`);
}

// =====================================================
// VEHICLE ASSIGNMENT ACTIONS
// =====================================================

export async function getVehicleAssignments() {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("vehicle_assignments")
    .select(
      `
      *,
      vehicle:vehicle_id(*),
      route:route_id(*)
    `
    )
    .order("assigned_date", { ascending: false });

  if (error) {
    console.error("Error fetching vehicle assignments:", error);
    throw new Error("Failed to fetch vehicle assignments");
  }

  return data;
}

export async function createVehicleAssignment(formData: FormData) {
  const supabase = await createClient();

  const assignmentData = {
    vehicle_id: formData.get("vehicle_id") as string,
    route_id: formData.get("route_id") as string,
    assigned_date: formData.get("assigned_date") as string,
    status: (formData.get("status") as "active" | "inactive") || "active",
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("vehicle_assignments")
    .insert([assignmentData])
    .select()
    .single();

  if (error) {
    console.error("Error creating vehicle assignment:", error);
    throw new Error("Failed to create vehicle assignment");
  }

  revalidatePath("/dashboard/transport");
  return data as VehicleAssignment;
}

export async function deleteVehicleAssignment(id: string) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { error } = await supabaseAny
    .from("vehicle_assignments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting vehicle assignment:", error);
    throw new Error("Failed to delete vehicle assignment");
  }

  revalidatePath("/dashboard/transport");
}

// =====================================================
// STUDENT TRANSPORT ACTIONS
// =====================================================

export async function getStudentTransport(filters?: {
  routeId?: string;
  studentId?: string;
}) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  let query = supabaseAny
    .from("student_transport")
    .select(
      `
      *,
      student:student_id(id, admission_no, first_name, last_name, class_id),
      route:route_id(id, route_name, route_number),
      stop:stop_id(id, stop_name)
    `
    )
    .order("created_at", { ascending: false });

  if (filters?.routeId) {
    query = query.eq("route_id", filters.routeId);
  }

  if (filters?.studentId) {
    query = query.eq("student_id", filters.studentId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching student transport:", error);
    throw new Error("Failed to fetch student transport");
  }

  return data;
}

export async function createStudentTransport(formData: FormData) {
  const supabase = await createClient();

  const transportData = {
    student_id: formData.get("student_id") as string,
    route_id: formData.get("route_id") as string,
    stop_id: formData.get("stop_id") as string | null,
    academic_year_id: formData.get("academic_year_id") as string | null,
    status: (formData.get("status") as "active" | "inactive") || "active",
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("student_transport")
    .insert([transportData])
    .select()
    .single();

  if (error) {
    console.error("Error creating student transport:", error);
    throw new Error("Failed to create student transport");
  }

  revalidatePath("/dashboard/transport");
  revalidatePath("/dashboard/transport/students");
  return data as StudentTransport;
}

export async function deleteStudentTransport(id: string) {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { error } = await supabaseAny
    .from("student_transport")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting student transport:", error);
    throw new Error("Failed to delete student transport");
  }

  revalidatePath("/dashboard/transport");
  revalidatePath("/dashboard/transport/students");
}

// =====================================================
// STATISTICS
// =====================================================

export async function getTransportStats() {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const [
    { count: totalVehicles },
    { count: activeVehicles },
    { count: totalRoutes },
    { count: activeRoutes },
    { count: totalStudents },
  ] = await Promise.all([
    supabaseAny.from("vehicles").select("*", { count: "exact", head: true }),
    supabaseAny
      .from("vehicles")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabaseAny.from("routes").select("*", { count: "exact", head: true }),
    supabaseAny
      .from("routes")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabaseAny
      .from("student_transport")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  return {
    totalVehicles: totalVehicles || 0,
    activeVehicles: activeVehicles || 0,
    totalRoutes: totalRoutes || 0,
    activeRoutes: activeRoutes || 0,
    totalStudents: totalStudents || 0,
  };
}
