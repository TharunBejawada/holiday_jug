"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiCheckCircle, FiStar, FiMapPin } from "react-icons/fi";

type CountryRow = {
  id: string;
  name: string;
  slug: string;
  region: string;
  priceFrom: number | null;
  isPublished: boolean;
  featuredOnOverview: boolean;
  sortOrder: number;
  _count: { destinations: number; holidayTypes: number };
};

export function CountriesList() {
  const [items, setItems] = useState<CountryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/destinations");
    if (!res.ok) {
      setError("Could not load destinations.");
      return;
    }
    const data = await res.json();
    setItems(data.items);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev?.filter((i) => i.id !== id) ?? null);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Could not delete.");
    }
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!items) return <p className="text-sm text-gray-400">Loading...</p>;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
        <FiMapPin className="text-3xl text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No destinations yet — create your first one.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">From Price</th>
            <th className="px-5 py-3">Region</th>
            <th className="px-5 py-3">Places</th>
            <th className="px-5 py-3">Holiday types</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
              <td className="px-5 py-3.5">
                <p className="font-semibold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">/{c.slug}</p>
              </td>
              <td className="px-5 py-3.5">
                {c.priceFrom != null ? (
                  <span className="inline-flex items-center gap-1 text-sm font-medium bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-100">
                    <span className="text-xs font-bold text-[#F7941D]">From</span>
                    <span className="font-extrabold text-[#1D1248]">£{Number(c.priceFrom)}</span>
                    <span className="text-xs text-gray-500 font-medium">pp</span>
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </td>
              <td className="px-5 py-3.5 text-gray-600">{c.region.replace(/_/g, " ")}</td>
              <td className="px-5 py-3.5 text-gray-600">{c._count.destinations}</td>
              <td className="px-5 py-3.5 text-gray-600">{c._count.holidayTypes}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  {c.isPublished ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      <FiCheckCircle /> Published
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                  {c.featuredOnOverview && (
                    <span className="flex items-center gap-1 text-xs font-medium text-sun-600 bg-sun-400/10 px-2 py-0.5 rounded-full">
                      <FiStar /> Trending
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/destinations/${c.id}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 transition-colors"
                    aria-label="Edit"
                  >
                    <FiEdit2 />
                  </Link>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
