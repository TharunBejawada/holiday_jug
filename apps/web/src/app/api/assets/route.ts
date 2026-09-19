import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { isAllowedUploadType } from "@/lib/s3";

const bodySchema = z.object({
  key: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["IMAGE", "VIDEO"]),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
});

// Step 2 of uploading: once the browser's direct-to-S3 PUT succeeds, record
// the file here so it shows up in the asset library (and can be attached to
// a destination/hotel/package).
export async function POST(request: NextRequest) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { key, url, type, mimeType, sizeBytes } = parsed.data;
  if (!isAllowedUploadType(mimeType)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const asset = await prisma.asset.create({
    data: { key, url, type, mimeType, sizeBytes, uploadedBy: session!.user!.email ?? undefined },
  });

  return NextResponse.json(asset, { status: 201 });
}

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const assets = await prisma.asset.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ items: assets });
}
