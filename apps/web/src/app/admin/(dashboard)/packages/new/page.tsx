import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { PackageForm } from "@/components/admin/packages/PackageForm";

export default async function NewPackagePage({
  searchParams,
}: {
  searchParams: Promise<{ destinationId?: string }>;
}) {
  const { destinationId } = await searchParams;
  return (
    <div>
      <Link
        href="/admin/packages"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline mb-4"
      >
        <FiArrowLeft /> Back to deals
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">New deal</h1>
      <PackageForm initialDestinationId={destinationId} />
    </div>
  );
}
