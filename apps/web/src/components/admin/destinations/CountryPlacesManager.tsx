"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiX, FiPlus, FiEdit2 } from "react-icons/fi";

type Place = { id: string; name: string; slug: string; sortOrder: number; countryId: string | null };

export function CountryPlacesManager({ countryId }: { countryId: string }) {
  const [assigned, setAssigned] = useState<Place[]>([]);
  const [unassigned, setUnassigned] = useState<Place[]>([]);
  const [picking, setPicking] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const [assignedRes, allRes] = await Promise.all([
      fetch(`/api/admin/places?countryId=${countryId}`),
      fetch("/api/admin/places"),
    ]);
    const assignedData = await assignedRes.json();
    const allData = await allRes.json();
    setAssigned(assignedData.items ?? []);
    setUnassigned((allData.items ?? []).filter((p: Place) => p.countryId !== countryId));
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  async function addPlace(placeId: string) {
    if (!placeId) return;
    await fetch(`/api/admin/places/${placeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryId, sortOrder: assigned.length }),
    });
    setPicking("");
    load();
  }

  async function removePlace(placeId: string) {
    await fetch(`/api/admin/places/${placeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryId: null }),
    });
    load();
  }

  async function updateOrder(placeId: string, sortOrder: number) {
    setAssigned((prev) => prev.map((p) => (p.id === placeId ? { ...p, sortOrder } : p)));
    await fetch(`/api/admin/places/${placeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sortOrder }),
    });
  }

  if (loading) return <p className="text-sm text-gray-400">Loading places...</p>;

  return (
    <div>
      {assigned.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">No places assigned yet.</p>
      ) : (
        <div className="space-y-2 mb-4">
          {assigned
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3.5 py-2.5">
                <input
                  type="number"
                  value={p.sortOrder}
                  onChange={(e) => updateOrder(p.id, Number(e.target.value))}
                  className="w-14 px-2 py-1 rounded-md border border-gray-200 text-xs text-center"
                />
                <span className="flex-1 text-sm font-medium text-gray-800">{p.name}</span>
                <Link
                  href={`/admin/destinations/places/${p.id}`}
                  className="text-gray-400 hover:text-brand-600 transition-colors"
                  aria-label="Edit place"
                >
                  <FiEdit2 className="text-sm" />
                </Link>
                <button
                  type="button"
                  onClick={() => removePlace(p.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove"
                >
                  <FiX />
                </button>
              </div>
            ))}
        </div>
      )}

      <div className="flex gap-2">
        <select
          value={picking}
          onChange={(e) => setPicking(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
        >
          <option value="">Add an existing place...</option>
          {unassigned.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => addPlace(picking)}
          disabled={!picking}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm font-medium text-gray-700 transition-colors"
        >
          <FiPlus /> Add
        </button>
      </div>
      <Link
        href={`/admin/destinations/places/new?countryId=${countryId}`}
        className="inline-block mt-3 text-sm text-brand-600 font-semibold hover:underline"
      >
        + Create a new place for this destination
      </Link>
    </div>
  );
}
