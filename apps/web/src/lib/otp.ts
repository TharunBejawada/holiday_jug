import { randomInt } from "crypto";
import { hash, compare } from "bcryptjs";
import { prisma } from "@holiday-jug/db";

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_CODES_PER_HOUR = 5;

export function generateOtpCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

// Simple per-email throttle so a single address can't be used to spam
// itself (or a victim's inbox) with verification emails.
export async function isOtpRequestRateLimited(email: string): Promise<boolean> {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.emailOtp.count({
    where: { email, purpose: "SIGNUP", createdAt: { gte: since } },
  });
  return count >= MAX_CODES_PER_HOUR;
}

export async function createSignupOtp(email: string): Promise<string> {
  const code = generateOtpCode();
  const codeHash = await hash(code, 10);

  await prisma.emailOtp.create({
    data: {
      email,
      codeHash,
      purpose: "SIGNUP",
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
    },
  });

  return code;
}

export type VerifyOtpResult = "ok" | "invalid" | "expired" | "locked" | "not_found";

export async function verifySignupOtp(email: string, code: string): Promise<VerifyOtpResult> {
  const otp = await prisma.emailOtp.findFirst({
    where: { email, purpose: "SIGNUP", consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return "not_found";
  if (otp.attempts >= MAX_ATTEMPTS) return "locked";
  if (otp.expiresAt < new Date()) return "expired";

  const valid = await compare(code, otp.codeHash);
  if (!valid) {
    await prisma.emailOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return "invalid";
  }

  await prisma.emailOtp.update({
    where: { id: otp.id },
    data: { consumedAt: new Date() },
  });
  return "ok";
}

// The "complete signup" step re-checks this instead of trusting a client
// flag, so an account can't be created without a verified code.
export async function hasRecentVerifiedOtp(email: string): Promise<boolean> {
  const since = new Date(Date.now() - 15 * 60 * 1000);
  const otp = await prisma.emailOtp.findFirst({
    where: {
      email,
      purpose: "SIGNUP",
      consumedAt: { gte: since },
    },
    orderBy: { consumedAt: "desc" },
  });
  return !!otp;
}
