import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // First, update the Supabase session
  const supabaseResponse = await updateSession(request);

  // Get hostname for subdomain routing
  const hostname = request.headers.get("host") || "";

  // Handle localhost development
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    // Allow testing subdomain routing on localhost via query params or paths
    // Examples:
    // - http://localhost:3000/admin → Admin portal
    // - http://localhost:3000/dashboard → School portal (default)
    // - http://localhost:3000/?subdomain=dps-ranchi → Test specific school

    const subdomain = request.nextUrl.searchParams.get("subdomain");

    if (subdomain) {
      // Add subdomain header for testing
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-school-subdomain", subdomain);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return supabaseResponse;
  }

  // Extract subdomain from hostname
  // Examples:
  // - admin.smartschoolerp.xyz → subdomain = "admin"
  // - dps-ranchi.smartschoolerp.xyz → subdomain = "dps-ranchi"
  // - www.smartschoolerp.xyz → subdomain = "www"
  // - smartschoolerp.xyz → no subdomain (root)

  const parts = hostname.split(".");

  // For smartschoolerp.xyz (root domain)
  if (parts.length < 3) {
    // Root domain - this is the marketing homepage
    // Block access to app routes
    if (
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return supabaseResponse;
  }

  const subdomain = parts[0];

  // Admin portal routing (admin.smartschoolerp.xyz)
  if (subdomain === "admin") {
    // If accessing root, rewrite to /admin
    if (request.nextUrl.pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }

    // Block access to non-admin routes from admin subdomain
    // Only allow /admin, /auth, /sales, /login, and system routes
    if (
      !request.nextUrl.pathname.startsWith("/admin") &&
      !request.nextUrl.pathname.startsWith("/auth") &&
      !request.nextUrl.pathname.startsWith("/sales") &&
      !request.nextUrl.pathname.startsWith("/login") &&
      !request.nextUrl.pathname.startsWith("/_next") &&
      !request.nextUrl.pathname.startsWith("/api")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // School subdomain routing (*.smartschoolerp.xyz)
  // Any subdomain that's not "admin" or "www" is a school subdomain
  if (subdomain !== "www") {
    // Add the subdomain to request headers so the app can identify the school
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-school-subdomain", subdomain);

    // If accessing root, rewrite to /dashboard
    if (request.nextUrl.pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Block access to /admin from school subdomains
    if (request.nextUrl.pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Pass the school subdomain in headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
