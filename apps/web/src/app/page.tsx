import { searchPackages } from "@holiday-jug/core";
import { SiteHeader } from "@/components/SiteHeader";
import { SearchPanel } from "@/components/SearchPanel";
import { DealCard, type Deal } from "@/components/DealCard";

export const revalidate = 300; // re-fetch featured deals every 5 minutes

async function getFeaturedDeals(): Promise<Deal[]> {
  try {
    const { items } = await searchPackages({ page: 1, pageSize: 6 });
    return items.map((pkg) => ({
      slug: pkg.slug,
      title: pkg.title,
      country: pkg.destination.country,
      nights: pkg.nights,
      boardType: pkg.boardType,
      priceGbp: Number(pkg.basePriceGbp),
      imageUrl: pkg.destination.heroImageUrl ?? "https://picsum.photos/seed/holidayjug/480/320",
    }));
  } catch {
    // DB not reachable yet (e.g. fresh clone before DATABASE_URL / migrations
    // are set up) — fall back to placeholders so the home page still renders.
    return [];
  }
}

export default async function HomePage() {
  const deals = await getFeaturedDeals();

  return (
    <main>
      <SiteHeader />

      <section className="bg-gradient-to-b from-brand-600 to-brand-500 pb-24 pt-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Cheap holidays, sorted.
          </h1>
          <p className="mt-3 text-lg text-brand-50">
            Package holidays, all-inclusive deals and beach breaks from the UK — ATOL protected.
          </p>
        </div>
        <SearchPanel />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Featured deals</h2>
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
            No deals yet — set <code>DATABASE_URL</code> in <code>.env</code>, run{" "}
            <code>npm run db:migrate</code> and <code>npm run db:seed</code>, then reload.
          </p>
        )}
      </section>
    </main>
  );
}
