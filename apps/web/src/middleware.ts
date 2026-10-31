import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isRateLimited } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static files & internal assets pass through directly
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. API routes: rate limiting and security headers
  if (pathname.startsWith("/api")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  }

  // 3. Admin Route Protection:
  // Admin dashboard (/admin/*) requires an authenticated ADMIN session.
  // Web application routes remain fully usable across other tabs.
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAdmin = token?.role === "ADMIN";

    if (!isAdmin) {
      // Guard all /admin routes except /admin/login
      if (pathname !== "/admin/login") {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // If already logged in as admin and visiting /admin/login, send to /admin dashboard
      if (pathname === "/admin/login") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  // 4. Web application pages (/, /hotels, /packages, etc.) pass through freely
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and assets
     */
    "/((?!_next/static|_next/image|assets|favicon.ico).*)",
  ],
};
