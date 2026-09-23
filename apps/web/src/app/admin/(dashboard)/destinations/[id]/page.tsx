import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { CountryForm } from "@/components/admin/destinations/CountryForm";

export default async function EditCountryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <Link
        href="/admin/destinations"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline mb-4"
      >
        <FiArrowLeft /> Back to destinations
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit destination</h1>
      <CountryForm countryId={id} />
    </div>
  );
}
