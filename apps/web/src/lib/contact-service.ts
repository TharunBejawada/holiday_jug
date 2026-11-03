import fs from "fs";
import path from "path";
import { prisma, ContactStatus } from "@holiday-jug/db";

export interface ContactSubmissionData {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  bookingRef?: string | null;
  subject: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_FILE = path.join(
  process.cwd(),
  "src",
  "lib",
  "data",
  "contact-submissions.json"
);

function getLocalSubmissions(): ContactSubmissionData[] {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const raw = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading local contact submissions:", err);
  }
  return [];
}

function saveLocalSubmissions(submissions: ContactSubmissionData[]) {
  try {
    const dir = path.dirname(LOCAL_STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local contact submissions:", err);
  }
}

export async function saveContactSubmission(input: {
  fullName: string;
  email: string;
  phone?: string;
  bookingRef?: string;
  subject: string;
  message: string;
}): Promise<ContactSubmissionData> {
  const now = new Date();
  const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const submissionObj: ContactSubmissionData = {
    id,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    bookingRef: input.bookingRef?.trim() || null,
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: "NEW",
    adminNotes: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  // Always back up locally so submissions are never lost
  const localList = getLocalSubmissions();
  localList.unshift(submissionObj);
  saveLocalSubmissions(localList);

  // Attempt database persistence via Prisma
  try {
    const dbRecord = await prisma.contactSubmission.create({
      data: {
        id,
        fullName: submissionObj.fullName,
        email: submissionObj.email,
        phone: submissionObj.phone,
        bookingRef: submissionObj.bookingRef,
        subject: submissionObj.subject,
        message: submissionObj.message,
        status: ContactStatus.NEW,
      },
    });

    return {
      id: dbRecord.id,
      fullName: dbRecord.fullName,
      email: dbRecord.email,
      phone: dbRecord.phone,
      bookingRef: dbRecord.bookingRef,
      subject: dbRecord.subject,
      message: dbRecord.message,
      status: dbRecord.status,
      adminNotes: dbRecord.adminNotes,
      createdAt: dbRecord.createdAt.toISOString(),
      updatedAt: dbRecord.updatedAt.toISOString(),
    };
  } catch (err) {
    console.warn("DB save for contact submission deferred (persisted to local backup):", err);
    return submissionObj;
  }
}

export async function getContactSubmissions(filter?: {
  status?: string;
  search?: string;
}): Promise<ContactSubmissionData[]> {
  let items: ContactSubmissionData[] = [];

  try {
    const dbRecords = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbRecords && dbRecords.length > 0) {
      items = dbRecords.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        email: r.email,
        phone: r.phone,
        bookingRef: r.bookingRef,
        subject: r.subject,
        message: r.message,
        status: r.status,
        adminNotes: r.adminNotes,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("Prisma query for contact submissions failed, falling back to local file:", err);
  }

  // Merge with any local submissions not yet in DB
  const localItems = getLocalSubmissions();
  const existingIds = new Set(items.map((i) => i.id));
  for (const local of localItems) {
    if (!existingIds.has(local.id)) {
      items.push(local);
    }
  }

  // Sort newest first
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (filter?.status && filter.status !== "ALL") {
    items = items.filter((i) => i.status === filter.status);
  }

  if (filter?.search) {
    const s = filter.search.toLowerCase();
    items = items.filter(
      (i) =>
        i.fullName.toLowerCase().includes(s) ||
        i.email.toLowerCase().includes(s) ||
        (i.phone && i.phone.toLowerCase().includes(s)) ||
        (i.bookingRef && i.bookingRef.toLowerCase().includes(s)) ||
        i.subject.toLowerCase().includes(s) ||
        i.message.toLowerCase().includes(s)
    );
  }

  return items;
}

export async function updateContactSubmissionStatus(
  id: string,
  status: "NEW" | "IN_PROGRESS" | "RESOLVED",
  adminNotes?: string | null
): Promise<ContactSubmissionData | null> {
  // Update local
  const localList = getLocalSubmissions();
  const index = localList.findIndex((i) => i.id === id);
  let updatedLocal: ContactSubmissionData | null = null;
  if (index !== -1) {
    localList[index].status = status;
    if (adminNotes !== undefined) {
      localList[index].adminNotes = adminNotes;
    }
    localList[index].updatedAt = new Date().toISOString();
    updatedLocal = localList[index];
    saveLocalSubmissions(localList);
  }

  // Update DB
  try {
    const dbRecord = await prisma.contactSubmission.update({
      where: { id },
      data: {
        status: ContactStatus[status],
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    });

    return {
      id: dbRecord.id,
      fullName: dbRecord.fullName,
      email: dbRecord.email,
      phone: dbRecord.phone,
      bookingRef: dbRecord.bookingRef,
      subject: dbRecord.subject,
      message: dbRecord.message,
      status: dbRecord.status,
      adminNotes: dbRecord.adminNotes,
      createdAt: dbRecord.createdAt.toISOString(),
      updatedAt: dbRecord.updatedAt.toISOString(),
    };
  } catch (err) {
    console.warn("Prisma update for contact submission deferred (updated local backup):", err);
    return updatedLocal;
  }
}

