import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@holiday-jug/db";
import { hasRecentVerifiedOtp } from "@/lib/otp";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(30).optional(),
  addressLine1: z.string().trim().max(200).optional(),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100).optional(),
  postcode: z.string().trim().max(20).optional(),
  country: z.string().trim().max(100).optional(),
  marketingOptIn: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const { email: rawEmail, password, ...profile } = parsed.data;
  const email = rawEmail.toLowerCase().trim();

  const verified = await hasRecentVerifiedOtp(email);
  if (!verified) {
    return NextResponse.json(
      { error: "Email not verified. Please verify your email again." },
      { status: 403 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 12);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      emailVerified: new Date(),
      ...profile,
    },
    create: {
      email,
      passwordHash,
      emailVerified: new Date(),
      signupIp: ip,
      ...profile,
    },
  });

  return NextResponse.json({ ok: true });
}
