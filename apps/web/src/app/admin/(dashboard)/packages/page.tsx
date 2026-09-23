import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { PackagesList } from "@/components/admin/packages/PackagesList";

export default function AdminPackagesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Deals</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Bookable itineraries — shown as &ldquo;Best Holiday Deals&rdquo; on destination pages.
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <FiPlus /> New deal
        </Link>
      </div>
      <PackagesList />
    </div>
  );
}
