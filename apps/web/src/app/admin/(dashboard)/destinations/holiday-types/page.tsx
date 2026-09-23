import { DestinationsSubNav } from "@/components/admin/DestinationsSubNav";
import { HolidayTypesManager } from "@/components/admin/destinations/HolidayTypesManager";

export default function AdminHolidayTypesPage() {
  return (
    <div>
      <DestinationsSubNav />
      <h1 className="text-xl font-bold text-gray-900 mb-1">Holiday types</h1>
      <p className="text-sm text-gray-500 mb-5">
        Tags like Beach, All-Inclusive, Family — used as filters and on destination pages.
      </p>
      <HolidayTypesManager />
    </div>
  );
}
