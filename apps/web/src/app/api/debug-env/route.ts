import { NextResponse } from "next/server";

// Temporary diagnostic route — lists which env var KEYS (never values) are
// actually present in the deployed runtime, to debug why console-configured
// Amplify env vars aren't reaching process.env at request time. Safe to
// deploy (leaks no secrets) but should be removed once resolved.
export async function GET() {
  const ourKeys = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "API_INTERNAL_SECRET",
    "SES_REGION",
    "SES_FROM_EMAIL",
    "S3_REGION",
    "S3_BUCKET_NAME",
  ];

  const present = ourKeys.filter((k) => process.env[k] !== undefined);
  const missing = ourKeys.filter((k) => process.env[k] === undefined);

  const allEnvKeys = Object.keys(process.env).sort();

  return NextResponse.json({
    present,
    missing,
    totalEnvKeyCount: allEnvKeys.length,
    allEnvKeys,
    nodeEnv: process.env.NODE_ENV,
  });
}
