import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentSession } from "@/lib/api-auth";
import { FiCalendar, FiArrowLeft } from "react-icons/fi";

export default async function MyBookingsPage() {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline mb-6">
        <FiArrowLeft /> Back to dashboard
      </Link>
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
        <FiCalendar className="text-4xl text-brand-500 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-gray-900">Your bookings</h1>
        <p className="text-gray-500 mt-1">Booking history is coming soon.</p>
      </div>
    </div>
  );
}
