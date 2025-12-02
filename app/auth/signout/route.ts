import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Get the referer to determine which login page to redirect to
  const referer = request.headers.get("referer") || "";

  // Check if the user is a sales executive before signing out
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isSalesExecutive = false;
  if (user) {
    const { data: salesExec } = await supabase
      .from("sales_executives")
      .select("id")
      .eq("user_id", user.id)
      .single();

    isSalesExecutive = !!salesExec;
  }

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect based on user type or referer
  if (isSalesExecutive || referer.includes("/sales")) {
    return NextResponse.redirect(new URL("/sales/login", request.url));
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
