import { DestinationsSubNav } from "@/components/admin/DestinationsSubNav";
import { FaqsManager } from "@/components/admin/destinations/FaqsManager";

export default function AdminFaqsPage() {
  return (
    <div>
      <DestinationsSubNav />
      <h1 className="text-xl font-bold text-gray-900 mb-1">FAQs</h1>
      <p className="text-sm text-gray-500 mb-5">
        Grouped by category — e.g. &ldquo;destinations-overview&rdquo; for the destinations page, &ldquo;global&rdquo; for site-wide.
      </p>
      <FaqsManager />
    </div>
  );
}
