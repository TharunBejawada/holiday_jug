import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@holiday-jug/db";
import { createSignupOtp, isOtpRequestRateLimited } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/ses";

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    return NextResponse.json(
      { error: "An account with this email already exists. Try signing in instead." },
      { status: 409 }
    );
  }

  if (await isOtpRequestRateLimited(email)) {
    return NextResponse.json(
      { error: "Too many codes requested. Please try again in an hour." },
      { status: 429 }
    );
  }

  const code = await createSignupOtp(email);
  await sendOtpEmail(email, code);

  return NextResponse.json({ ok: true });
}
