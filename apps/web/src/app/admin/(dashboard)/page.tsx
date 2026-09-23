import { getCurrentSession } from "@/lib/api-auth";
import { FiPackage, FiCalendar, FiUsers, FiImage } from "react-icons/fi";

const STAT_CARDS = [
  { label: "Active packages", value: "—", icon: FiPackage },
  { label: "Bookings this month", value: "—", icon: FiCalendar },
  { label: "Registered users", value: "—", icon: FiUsers },
  { label: "Assets uploaded", value: "—", icon: FiImage },
];

export default async function AdminDashboardPage() {
  const session = await getCurrentSession();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
      </h2>
      <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with Holiday Jug.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
              <card.icon className="text-brand-500 text-lg" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Package, booking and user management tools will appear here as they&apos;re built.
        </p>
      </div>
    </div>
  );
}
