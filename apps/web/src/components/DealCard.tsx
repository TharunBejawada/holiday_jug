import Link from "next/link";

export type Deal = {
  slug: string;
  title: string;
  country: string;
  nights: number;
  boardType: string;
  priceGbp: number;
  imageUrl: string;
};

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      href={`/holidays/${deal.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={deal.imageUrl}
          alt={deal.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {deal.country}
        </p>
        <h3 className="mt-1 font-bold text-gray-900">{deal.title}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {deal.nights} nights · {deal.boardType.replace(/_/g, " ").toLowerCase()}
        </p>
        <p className="mt-3 text-lg font-extrabold text-gray-900">
          from £{deal.priceGbp.toFixed(0)}
          <span className="text-sm font-normal text-gray-500"> pp</span>
        </p>
      </div>
    </Link>
  );
}
