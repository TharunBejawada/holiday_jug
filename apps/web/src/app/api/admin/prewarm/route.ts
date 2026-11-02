import { NextResponse } from "next/server";
import { prisma } from "@holiday-jug/db";

export const dynamic = "force-dynamic";

// Pre-warms the Prisma database connection pool in the background while
// the admin is typing their credentials on the login page. This eliminates
// the ~3,000ms cold TLS/TCP connection penalty to AWS London.
export async function GET() {
  try {
    await prisma.user.findFirst({
      select: { id: true },
    });
    return NextResponse.json({ ok: true, warmed: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 200 });
  }
}

