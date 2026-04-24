import { NextResponse } from "next/server";
import { requireAdmin, requireSuperAdmin } from "./lib/auth.js";

export function middleware(request) {
  console.log("request to middlewere");
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApiPath =
    pathname === "/api/admin" || pathname.startsWith("/api/admin/");

  if (isAdminPath || isAdminApiPath) {
    console.log("This is admin path");
    if (pathname === "/admin/login") return NextResponse.next();
    console.log("Going to admin specific path");
    try {
      if (
        pathname === "/admin/admins" ||
        pathname.startsWith("/admin/admins/")
      ) {
        const user = requireSuperAdmin(request);
        console.log("Super Admin", user);
      } else {
        const user = requireAdmin(request);
        console.log("Super Admin", user);
      }

      return NextResponse.next();
    } catch (error) {
      if (isAdminApiPath) {
        const status = error.message === "Forbidden" ? 403 : 401;
        const message = status === 403 ? "Forbidden" : "Unauthorized";
        return NextResponse.json({ error: message }, { status });
      }

      if (error.message === "Forbidden") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin", "/api/admin/:path*", "/admin", "/admin/:path*"],
};
