import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { PlaceForm } from "@/components/admin/destinations/PlaceForm";

export default async function NewPlacePage({
  searchParams,
}: {
  searchParams: Promise<{ countryId?: string }>;
}) {
  const { countryId } = await searchParams;
  return (
    <div>
      <Link
        href="/admin/destinations/places"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline mb-4"
      >
        <FiArrowLeft /> Back to places
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">New place</h1>
      <PlaceForm initialCountryId={countryId} />
    </div>
  );
}
