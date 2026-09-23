import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { PlaceForm } from "@/components/admin/destinations/PlaceForm";

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <Link
        href="/admin/destinations/places"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline mb-4"
      >
        <FiArrowLeft /> Back to places
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit place</h1>
      <PlaceForm placeId={id} />
    </div>
  );
}
