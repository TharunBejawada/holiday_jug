import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Gate a route handler behind an authenticated session. Use for endpoints
// that read or write on behalf of a signed-in user (bookings, profile).
export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}

// Gate a route handler behind an authenticated ADMIN session. Use for
// content-management endpoints like asset uploads.
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return { session: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, response: null };
}

// Gate server-to-server routes (e.g. called from admin tooling or another
// service) behind a shared secret instead of a browser session.
export function requireInternalSecret(request: NextRequest) {
  const provided = request.headers.get("x-internal-api-key");
  const expected = process.env.API_INTERNAL_SECRET;

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
