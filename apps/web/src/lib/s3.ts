import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

// Same pattern as SES: no static access keys — the Amplify compute role is
// granted s3:PutObject on this bucket directly (see docs/DEPLOYMENT.md).
const s3 = new S3Client({ region: process.env.S3_REGION ?? "eu-west-2" });

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
]);

export function isAllowedUploadType(contentType: string): boolean {
  return ALLOWED_CONTENT_TYPES.has(contentType);
}

export async function createPresignedUploadUrl(contentType: string, extension: string) {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) {
    throw new Error("S3_BUCKET_NAME is not set.");
  }

  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}${extension}`;

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: 300 } // 5 minutes to complete the upload
  );

  const publicUrl = process.env.S3_PUBLIC_BASE_URL
    ? `${process.env.S3_PUBLIC_BASE_URL}/${key}`
    : `https://${bucket}.s3.${process.env.S3_REGION ?? "eu-west-2"}.amazonaws.com/${key}`;

  return { key, uploadUrl, publicUrl };
}
