import { NextRequest, NextResponse } from "next/server";
import { saveContactSubmission, getContactSubmissions } from "@/lib/contact-service";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const { fullName, email, phone, bookingRef, subject, message } = body;

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json({ error: "Please select an enquiry subject." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Please enter your message." }, { status: 400 });
    }

    const saved = await saveContactSubmission({
      fullName,
      email,
      phone,
      bookingRef,
      subject,
      message,
    });

    const shortRef = `HJ-INQ-${saved.id.slice(-5).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! We have received your message.",
      submission: saved,
      referenceCode: shortRef,
    });
  } catch (err: any) {
    console.error("Error processing contact submission:", err);
    return NextResponse.json(
      { error: "Failed to process your message. Please try again or call us at 0330 165 8879." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";

    const items = await getContactSubmissions({ status, search });

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (err: any) {
    console.error("Error fetching contact submissions:", err);
    return NextResponse.json({ error: "Failed to fetch contact submissions." }, { status: 500 });
  }
}

