import { NextRequest, NextResponse } from "next/server";
import { updateContactSubmissionStatus } from "@/lib/contact-service";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || !body.status) {
      return NextResponse.json({ error: "Missing required status field." }, { status: 400 });
    }

    const validStatuses = ["NEW", "IN_PROGRESS", "RESOLVED"];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const updated = await updateContactSubmissionStatus(
      id,
      body.status,
      body.adminNotes !== undefined ? body.adminNotes : undefined
    );

    if (!updated) {
      return NextResponse.json({ error: "Contact submission not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry status updated to ${body.status}`,
      submission: updated,
    });
  } catch (err: any) {
    console.error("Error updating contact submission:", err);
    return NextResponse.json({ error: "Failed to update submission status." }, { status: 500 });
  }
}
