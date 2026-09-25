"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiUpload,
  FiPlus,
  FiX,
  FiMapPin,
} from "react-icons/fi";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { CountryPlacesManager } from "@/components/admin/destinations/CountryPlacesManager";
import { CountryFaqsManager } from "@/components/admin/destinations/CountryFaqsManager";
import { uploadAssetImage } from "@/lib/upload-asset";

const REGIONS = ["EUROPE", "MEDITERRANEAN", "MIDDLE_EAST", "INDIAN_OCEAN", "ASIA", "CARIBBEAN", "AMERICAS"];
const FLIGHT_BANDS = [
  { value: "UNDER_4H", label: "Under 4 hours" },
  { value: "FOUR_TO_SIX_H", label: "4–6 hours" },
  { value: "SIX_TO_TEN_H", label: "6–10 hours" },
  { value: "TEN_PLUS_H", label: "10+ hours" },
];
const BEST_FOR_OPTIONS = ["FAMILIES", "COUPLES", "ADULTS_ONLY", "LUXURY", "ADVENTURE", "RELAXATION"];

type HolidayType = { id: string; name: string; slug: string };
type SelectedHolidayType = { holidayTypeId: string; description: string; sortOrder: number };

type CountryData = {
  id?: string;
  name: string;
  slug: string;
  region: string;
  flightTimeBand: string;
  bestFor: string[];
  priceFrom: number | null;
  cardImageUrl: string;
  heroImageUrl: string;
  heroDescription: string;
  whyVisitIntro: string;
  whyVisitHighlights: string[];
  thingsToDoContent: string;
  whenToGoContent: string;
  travelGuideContent: string;
  featuredOnOverview: boolean;
  isPublished: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  holidayTypes: SelectedHolidayType[];
};

const EMPTY: CountryData = {
  name: "",
  slug: "",
  region: "EUROPE",
  flightTimeBand: "UNDER_4H",
  bestFor: [],
  priceFrom: null,
  cardImageUrl: "",
  heroImageUrl: "",
  heroDescription: "",
  whyVisitIntro: "",
  whyVisitHighlights: [],
  thingsToDoContent: "",
  whenToGoContent: "",
  travelGuideContent: "",
  featuredOnOverview: false,
  isPublished: false,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
  holidayTypes: [],
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CountryForm({ countryId }: { countryId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<CountryData>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(!!countryId);
  const [holidayTypeOptions, setHolidayTypeOptions] = useState<HolidayType[]>([]);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingBasic, setUploadingBasic] = useState(false);
  const [loading, setLoading] = useState(!!countryId);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/holiday-types")
      .then((r) => r.json())
      .then((d) => setHolidayTypeOptions(d.items ?? []));
  }, []);

  useEffect(() => {
    if (!countryId) return;
    fetch(`/api/admin/destinations/${countryId}`)
      .then((r) => r.json())
      .then((c) => {
        setData({
          id: c.id,
          name: c.name,
          slug: c.slug,
          region: c.region,
          flightTimeBand: c.flightTimeBand,
          bestFor: c.bestFor ?? [],
          priceFrom: c.priceFrom != null ? Number(c.priceFrom) : null,
          cardImageUrl: c.cardImageUrl ?? "",
          heroImageUrl: c.heroImageUrl ?? "",
          heroDescription: c.heroDescription ?? "",
          whyVisitIntro: c.whyVisitIntro ?? "",
          whyVisitHighlights: c.whyVisitHighlights ?? [],
          thingsToDoContent: c.thingsToDoContent ?? "",
          whenToGoContent: c.whenToGoContent ?? "",
          travelGuideContent: c.travelGuideContent ?? "",
          featuredOnOverview: c.featuredOnOverview,
          isPublished: c.isPublished,
          sortOrder: c.sortOrder,
          seoTitle: c.seoTitle ?? "",
          seoDescription: c.seoDescription ?? "",
          seoKeywords: c.seoKeywords ?? [],
          holidayTypes: (c.holidayTypes ?? []).map((h: { holidayTypeId: string; description: string | null; sortOrder: number }) => ({
            holidayTypeId: h.holidayTypeId,
            description: h.description ?? "",
            sortOrder: h.sortOrder,
          })),
        });
        setKeywordsInput((c.seoKeywords ?? []).join(", "));
        setLoading(false);
      });
  }, [countryId]);

  function toggleHolidayType(id: string) {
    setData((d) => {
      const exists = d.holidayTypes.find((h) => h.holidayTypeId === id);
      if (exists) {
        return { ...d, holidayTypes: d.holidayTypes.filter((h) => h.holidayTypeId !== id) };
      }
      return {
        ...d,
        holidayTypes: [...d.holidayTypes, { holidayTypeId: id, description: "", sortOrder: d.holidayTypes.length }],
      };
    });
  }

  function updateHolidayTypeDescription(id: string, description: string) {
    setData((d) => ({
      ...d,
      holidayTypes: d.holidayTypes.map((h) => (h.holidayTypeId === id ? { ...h, description } : h)),
    }));
  }

  function toggleBestFor(tag: string) {
    setData((d) => ({
      ...d,
      bestFor: d.bestFor.includes(tag) ? d.bestFor.filter((t) => t !== tag) : [...d.bestFor, tag],
    }));
  }

  async function handleHeroUpload(file: File) {
    setUploadingHero(true);
    try {
      const url = await uploadAssetImage(file);
      setData((d) => ({ ...d, heroImageUrl: url }));
    } catch {
      setErrorMsg("Hero image upload failed.");
    } finally {
      setUploadingHero(false);
    }
  }

  async function handleBasicImageUpload(file: File) {
    setUploadingBasic(true);
    try {
      const url = await uploadAssetImage(file);
      setData((d) => ({ ...d, cardImageUrl: url }));
    } catch {
      setErrorMsg("Card image upload failed.");
    } finally {
      setUploadingBasic(false);
    }
  }

  function addHighlight() {
    if (!highlightInput.trim()) return;
    setData((d) => ({ ...d, whyVisitHighlights: [...d.whyVisitHighlights, highlightInput.trim()] }));
    setHighlightInput("");
  }

  function removeHighlight(index: number) {
    setData((d) => ({ ...d, whyVisitHighlights: d.whyVisitHighlights.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setErrorMsg(null);

    const payload = {
      ...data,
      seoKeywords: keywordsInput
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    };

    const url = countryId ? `/api/admin/destinations/${countryId}` : "/api/admin/destinations";
    const method = countryId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    setSaving(false);
    if (!res.ok) {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong.");
      return;
    }
    setStatus("success");
    if (!countryId) {
      router.push(`/admin/destinations/${result.id}`);
    }
  }

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

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

      {/* Basic info */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Basic info</h2>

        {/* Basic Info Image Upload */}
        <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Card display image (Overview &amp; Listing grid)</label>
          <div className="flex items-start gap-4">
            <div className="relative w-40 h-28 rounded-xl bg-white overflow-hidden shrink-0 border border-gray-200 shadow-xs">
              {data.cardImageUrl ? (
                <Image src={data.cardImageUrl} alt="Card Preview" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs">No card image</div>
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors shadow-xs">
                <FiUpload /> {uploadingBasic ? "Uploading..." : "Upload card image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingBasic}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBasicImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">Card image shown on overview cards & destination grids.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input
              type="text"
              required
              value={data.name}
              onChange={(e) => {
                const name = e.target.value;
                setData((d) => ({ ...d, name, slug: slugTouched ? d.slug : slugify(name) }));
              }}
              placeholder="Turkey"
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
              placeholder="turkey"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">/destinations/{data.slug || "..."}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
            <select
              value={data.region}
              onChange={(e) => setData((d) => ({ ...d, region: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition bg-white"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Typical flight time</label>
            <select
              value={data.flightTimeBand}
              onChange={(e) => setData((d) => ({ ...d, flightTimeBand: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition bg-white"
            >
              {FLIGHT_BANDS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Starting From price (£ / person)</label>
            <div className="relative rounded-lg shadow-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">£</span>
              </div>
              <input
                type="number"
                min={0}
                step="1"
                value={data.priceFrom ?? ""}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    priceFrom: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
                placeholder="145"
                className="w-full pl-7 pr-12 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm font-medium"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-gray-400 font-medium">pp</span>
              </div>
            </div>
            {data.priceFrom != null && (
              <p className="mt-1.5 text-xs flex items-center gap-1.5 text-gray-500">
                Badge preview:{" "}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 border border-gray-200">
                  <span className="font-bold text-[#F7941D]">From</span>{" "}
                  <span className="font-extrabold text-[#1D1248]">£{data.priceFrom} pp</span>
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Best for</label>
          <div className="flex flex-wrap gap-2">
            {BEST_FOR_OPTIONS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleBestFor(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${data.bestFor.includes(tag)
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-brand-400"
                  }`}
              >
                {tag.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Hero section</h2>
        <div className="flex items-start gap-4">
          <div className="relative w-40 h-28 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
            {data.heroImageUrl ? (
              <Image src={data.heroImageUrl} alt="" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 text-xs">No hero image</div>
            )}
          </div>
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
              <FiUpload /> {uploadingHero ? "Uploading..." : "Upload hero image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingHero}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleHeroUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">Recommended: wide landscape header image, at least 1600px.</p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero description</label>
          <RichTextEditor
            value={data.heroDescription}
            onChange={(html) => setData((d) => ({ ...d, heroDescription: html }))}
            placeholder="Discover the best of Turkey from stunning coastlines..."
          />
        </div>
      </section>

      {/* Why visit */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Why visit</h2>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Intro</label>
        <RichTextEditor
          value={data.whyVisitIntro}
          onChange={(html) => setData((d) => ({ ...d, whyVisitIntro: html }))}
          placeholder="Turkey is a land where East meets West..."
        />

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Highlights</label>
          <div className="space-y-2 mb-3">
            {data.whyVisitHighlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="flex-1 text-sm text-gray-700">{h}</span>
                <button type="button" onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-500">
                  <FiX />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addHighlight();
                }
              }}
              placeholder="Stunning beaches along the Turquoise Coast"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
            >
              <FiPlus /> Add
            </button>
          </div>
        </div>
      </section>

      {/* Sub-nav tab content */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Page tabs</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Things to Do</label>
          <RichTextEditor
            value={data.thingsToDoContent}
            onChange={(html) => setData((d) => ({ ...d, thingsToDoContent: html }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">When to Go</label>
          <RichTextEditor
            value={data.whenToGoContent}
            onChange={(html) => setData((d) => ({ ...d, whenToGoContent: html }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Travel Guide</label>
          <RichTextEditor
            value={data.travelGuideContent}
            onChange={(html) => setData((d) => ({ ...d, travelGuideContent: html }))}
          />
        </div>
      </section>

      {/* Holiday types */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Holiday types</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select which apply, and optionally override the description shown on this page.
        </p>
        <div className="space-y-3">
          {holidayTypeOptions.map((ht) => {
            const selected = data.holidayTypes.find((h) => h.holidayTypeId === ht.id);
            return (
              <div key={ht.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <label className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => toggleHolidayType(ht.id)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-gray-800">{ht.name}</span>
                </label>
                {selected && (
                  <div className="px-3.5 pb-3">
                    <input
                      type="text"
                      value={selected.description}
                      onChange={(e) => updateHolidayTypeDescription(ht.id, e.target.value)}
                      placeholder="Description for this destination (optional)"
                      className="w-full px-3 py-1.5 rounded-md border border-gray-200 text-xs focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none transition"
                    />
                  </div>
                )}
              </div>
            );
          })}
          {holidayTypeOptions.length === 0 && (
            <p className="text-sm text-gray-400">No holiday types yet — add some under Holiday Types.</p>
          )}
        </div>
      </section>

      {/* Top destinations (places) */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Top destinations</h2>
        <p className="text-sm text-gray-500 mb-4">Cities/resorts shown as cards on this page.</p>
        {countryId ? (
          <CountryPlacesManager countryId={countryId} />
        ) : (
          <p className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
            <FiMapPin /> Save this destination first to add places.
          </p>
        )}
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">FAQs</h2>
        <p className="text-sm text-gray-500 mb-4">Shown at the bottom of this destination page.</p>
        {countryId ? (
          <CountryFaqsManager countryId={countryId} />
        ) : (
          <p className="text-sm text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
            Save this destination first to add FAQs.
          </p>
        )}
      </section>

      {/* Publishing */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Publishing</h2>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2.5 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={data.isPublished}
              onChange={(e) => setData((d) => ({ ...d, isPublished: e.target.checked }))}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Published
          </label>
          <label className="flex items-center gap-2.5 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={data.featuredOnOverview}
              onChange={(e) => setData((d) => ({ ...d, featuredOnOverview: e.target.checked }))}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Featured in &ldquo;Trending Now&rdquo;
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Sort order</label>
            <input
              type="number"
              value={data.sortOrder}
              onChange={(e) => setData((d) => ({ ...d, sortOrder: Number(e.target.value) }))}
              className="w-20 px-3 py-1.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm"
            />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Meta title <span className="text-gray-400 font-normal">({data.seoTitle.length}/70)</span>
            </label>
            <input
              type="text"
              maxLength={70}
              value={data.seoTitle}
              onChange={(e) => setData((d) => ({ ...d, seoTitle: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Meta description <span className="text-gray-400 font-normal">({data.seoDescription.length}/170)</span>
            </label>
            <textarea
              maxLength={170}
              rows={2}
              value={data.seoDescription}
              onChange={(e) => setData((d) => ({ ...d, seoDescription: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta keywords</label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="turkey holidays, antalya, turkey all inclusive"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-gray-100 -mx-6 px-6 py-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors"
        >
          {saving ? "Saving..." : countryId ? "Save changes" : "Create destination"}
        </button>
      </div>
    </form>
  );
}
