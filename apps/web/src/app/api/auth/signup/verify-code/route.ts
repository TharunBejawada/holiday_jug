import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureEnvLoaded } from "@holiday-jug/db";
import { verifySignupOtp } from "@/lib/otp";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const ERROR_MESSAGES: Record<string, string> = {
  not_found: "No verification code found for this email. Please request a new one.",
  expired: "This code has expired. Please request a new one.",
  locked: "Too many incorrect attempts. Please request a new code.",
  invalid: "Incorrect code. Please try again.",
};

export async function POST(request: NextRequest) {
  await ensureEnvLoaded();

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid email and 6-digit code are required." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  const result = await verifySignupOtp(email, parsed.data.code);
  if (result !== "ok") {
    return NextResponse.json({ error: ERROR_MESSAGES[result] }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
