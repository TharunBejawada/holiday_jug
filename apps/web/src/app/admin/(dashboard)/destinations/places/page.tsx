import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { DestinationsSubNav } from "@/components/admin/DestinationsSubNav";
import { PlacesList } from "@/components/admin/destinations/PlacesList";

export default function AdminPlacesPage() {
  return (
    <div>
      <DestinationsSubNav />
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Places</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cities and resorts (Antalya, Bodrum...) shown as cards on a destination page.
          </p>
        </div>
        <Link
          href="/admin/destinations/places/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <FiPlus /> New place
        </Link>
      </div>
      <PlacesList />
    </div>
  );
}
