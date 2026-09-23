"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const BOARD_TYPES = [
  { value: "SELF_CATERING", label: "Self Catering" },
  { value: "BED_AND_BREAKFAST", label: "Bed & Breakfast" },
  { value: "HALF_BOARD", label: "Half Board" },
  { value: "FULL_BOARD", label: "Full Board" },
  { value: "ALL_INCLUSIVE", label: "All Inclusive" },
];

type PlaceOption = { id: string; name: string };

type PackageData = {
  title: string;
  slug: string;
  destinationId: string;
  boardType: string;
  nights: number;
  basePriceGbp: number;
  originalPriceGbp: number | null;
  departureAirport: string;
  isActive: boolean;
  ratingOverride: number | null;
  reviewCountOverride: number | null;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function PackageForm({ packageId, initialDestinationId }: { packageId?: string; initialDestinationId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<PackageData>({
    title: "",
    slug: "",
    destinationId: initialDestinationId ?? "",
    boardType: "ALL_INCLUSIVE",
    nights: 7,
    basePriceGbp: 0,
    originalPriceGbp: null,
    departureAirport: "",
    isActive: true,
    ratingOverride: null,
    reviewCountOverride: null,
  });
  const [slugTouched, setSlugTouched] = useState(!!packageId);
  const [places, setPlaces] = useState<PlaceOption[]>([]);
  const [loading, setLoading] = useState(!!packageId);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/places")
      .then((r) => r.json())
      .then((d) => setPlaces((d.items ?? []).map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))));
  }, []);

  useEffect(() => {
    if (!packageId) return;
    fetch(`/api/admin/packages/${packageId}`)
      .then((r) => r.json())
      .then((p) => {
        setData({
          title: p.title,
          slug: p.slug,
          destinationId: p.destinationId,
          boardType: p.boardType,
          nights: p.nights,
          basePriceGbp: Number(p.basePriceGbp),
          originalPriceGbp: p.originalPriceGbp ? Number(p.originalPriceGbp) : null,
          departureAirport: p.departureAirport ?? "",
          isActive: p.isActive,
          ratingOverride: p.ratingOverride ? Number(p.ratingOverride) : null,
          reviewCountOverride: p.reviewCountOverride ?? null,
        });
        setLoading(false);
      });
  }, [packageId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setErrorMsg(null);

    const url = packageId ? `/api/admin/packages/${packageId}` : "/api/admin/packages";
    const method = packageId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    setSaving(false);
    if (!res.ok) {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong.");
      return;
    }
    setStatus("success");
    if (!packageId) {
      router.push("/admin/packages");
    }
  }

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  const savingPct =
    data.originalPriceGbp && data.originalPriceGbp > data.basePriceGbp
      ? Math.round(((data.originalPriceGbp - data.basePriceGbp) / data.originalPriceGbp) * 100)
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2.5">
          <FiCheckCircle /> Saved successfully.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5">
          <FiAlertCircle /> {errorMsg}
        </div>
      )}

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Deal details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              required
              value={data.title}
              onChange={(e) => {
                const title = e.target.value;
                setData((d) => ({ ...d, title, slug: slugTouched ? d.slug : slugify(title) }));
              }}
              placeholder="Antalya All Inclusive Escape"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL slug</label>
            <input
              type="text"
              required
              value={data.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setData((d) => ({ ...d, slug: slugify(e.target.value) }));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Place</label>
            <select
              required
              value={data.destinationId}
              onChange={(e) => setData((d) => ({ ...d, destinationId: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition bg-white"
            >
              <option value="">Select a place...</option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Board type</label>
            <select
              value={data.boardType}
              onChange={(e) => setData((d) => ({ ...d, boardType: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition bg-white"
            >
              {BOARD_TYPES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nights</label>
            <input
              type="number"
              required
              min={1}
              value={data.nights}
              onChange={(e) => setData((d) => ({ ...d, nights: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Departure airport</label>
            <input
              type="text"
              value={data.departureAirport}
              onChange={(e) => setData((d) => ({ ...d, departureAirport: e.target.value }))}
              placeholder="LGW"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per person (£)</label>
            <input
              type="number"
              required
              min={0}
              step="0.01"
              value={data.basePriceGbp}
              onChange={(e) => setData((d) => ({ ...d, basePriceGbp: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Was price (£) <span className="text-gray-400 font-normal">optional</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={data.originalPriceGbp ?? ""}
              onChange={(e) =>
                setData((d) => ({ ...d, originalPriceGbp: e.target.value === "" ? null : Number(e.target.value) }))
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div className="flex items-end">
            {savingPct !== null && (
              <span className="text-sm font-semibold text-sun-600 bg-sun-400/10 px-3 py-2.5 rounded-lg">
                SAVE {savingPct}% (£{(data.originalPriceGbp! - data.basePriceGbp).toFixed(0)})
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Rating (launch seed)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Shown until real reviews accumulate — leave blank to hide the rating on this deal.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (0–5)</label>
            <input
              type="number"
              min={0}
              max={5}
              step="0.1"
              value={data.ratingOverride ?? ""}
              onChange={(e) =>
                setData((d) => ({ ...d, ratingOverride: e.target.value === "" ? null : Number(e.target.value) }))
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Review count</label>
            <input
              type="number"
              min={0}
              value={data.reviewCountOverride ?? ""}
              onChange={(e) =>
                setData((d) => ({ ...d, reviewCountOverride: e.target.value === "" ? null : Number(e.target.value) }))
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <label className="flex items-center gap-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => setData((d) => ({ ...d, isActive: e.target.checked }))}
            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          Active (visible on the site)
        </label>
      </section>

      <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-gray-100 -mx-6 px-6 py-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors"
        >
          {saving ? "Saving..." : packageId ? "Save changes" : "Create deal"}
        </button>
      </div>
    </form>
  );
}
