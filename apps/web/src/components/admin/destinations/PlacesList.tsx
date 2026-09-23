"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";

type PlaceRow = {
  id: string;
  name: string;
  slug: string;
  country: string;
  sortOrder: number;
  countryPage: { id: string; name: string } | null;
};

export function PlacesList() {
  const [items, setItems] = useState<PlaceRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/places");
    if (!res.ok) {
      setError("Could not load places.");
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
    const res = await fetch(`/api/admin/places/${id}`, { method: "DELETE" });
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
        <p className="text-gray-500 text-sm">No places yet — create your first one.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Country field</th>
            <th className="px-5 py-3">Linked destination page</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
              <td className="px-5 py-3.5">
                <p className="font-semibold text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">/{p.slug}</p>
              </td>
              <td className="px-5 py-3.5 text-gray-600">{p.country}</td>
              <td className="px-5 py-3.5">
                {p.countryPage ? (
                  <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                    {p.countryPage.name}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Unassigned</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/destinations/places/${p.id}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 transition-colors"
                    aria-label="Edit"
                  >
                    <FiEdit2 />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
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
