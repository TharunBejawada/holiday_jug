import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-auth";
import { createPresignedUploadUrl, isAllowedUploadType } from "@/lib/s3";

const bodySchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

// Step 1 of uploading a destination/hotel image or promo video: get a
// short-lived presigned URL, then PUT the file straight to S3 from the
// browser (the file never passes through our server).
export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { filename, contentType } = parsed.data;
  if (!isAllowedUploadType(contentType)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const extension = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
  const { key, uploadUrl, publicUrl } = await createPresignedUploadUrl(contentType, extension);

  return NextResponse.json({ key, uploadUrl, publicUrl });
}
