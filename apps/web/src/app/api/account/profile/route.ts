import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@holiday-jug/db";
import { requireSession } from "@/lib/api-auth";

const schema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  addressLine1: z.string().trim().max(200).optional().or(z.literal("")),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  postcode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  preferredCurrency: z.string().trim().max(10).optional(),
  marketingOptIn: z.boolean().optional(),
});

export async function GET() {
  const { session, response } = await requireSession();
  if (response) return response;

  const userId = (session!.user as { id?: string }).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}

export async function PATCH(request: NextRequest) {
  const { session, response } = await requireSession();
  if (response) return response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const userId = (session!.user as { id?: string }).id;
  const updated = await prisma.user.update({
    where: { id: userId },
    data: parsed.data,
  });

  const { passwordHash: _passwordHash, ...safeUser } = updated;
  return NextResponse.json({ user: safeUser });
}
