import { NextRequest, NextResponse } from "next/server";
import { searchPackages, searchPackagesSchema } from "@holiday-jug/core";

// Public search endpoint — rate limited by middleware.ts, no auth required
// so the home page and search results can hit it directly from the client.
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);

  const parsed = searchPackagesSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await searchPackages(parsed.data);
  return NextResponse.json(result);
}
