// Shared by the admin image-picker fields and the RTE's image-upload
// button: requests a presigned S3 URL, PUTs the file directly, then
// records it in the asset library. Returns the public URL to use in
// content/img src.
export async function uploadAssetImage(file: File): Promise<string> {
  const presignRes = await fetch("/api/assets/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });
  if (!presignRes.ok) {
    throw new Error("Could not get an upload URL.");
  }
  const { key, uploadUrl, publicUrl } = await presignRes.json();

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error("Upload to storage failed.");
  }

  await fetch("/api/assets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key,
      url: publicUrl,
      type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
      mimeType: file.type,
      sizeBytes: file.size,
    }),
  });

  return publicUrl;
}
