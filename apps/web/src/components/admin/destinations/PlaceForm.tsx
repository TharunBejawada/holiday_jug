"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiAlertCircle, FiCheckCircle, FiUpload } from "react-icons/fi";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { uploadAssetImage } from "@/lib/upload-asset";

type CountryOption = { id: string; name: string };

type PlaceData = {
  name: string;
  slug: string;
  country: string;
  region: string;
  description: string;
  heroImageUrl: string;
  sortOrder: number;
  countryId: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
};

const EMPTY: PlaceData = {
  name: "",
  slug: "",
  country: "",
  region: "",
  description: "",
  heroImageUrl: "",
  sortOrder: 0,
  countryId: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function PlaceForm({ placeId, initialCountryId }: { placeId?: string; initialCountryId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<PlaceData>({ ...EMPTY, countryId: initialCountryId ?? "" });
  const [slugTouched, setSlugTouched] = useState(!!placeId);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(!!placeId);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/destinations")
      .then((r) => r.json())
      .then((d) => setCountries((d.items ?? []).map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))));
  }, []);

  useEffect(() => {
    if (!placeId) return;
    fetch(`/api/admin/places/${placeId}`)
      .then((r) => r.json())
      .then((p) => {
        setData({
          name: p.name,
          slug: p.slug,
          country: p.country,
          region: p.region ?? "",
          description: p.description ?? "",
          heroImageUrl: p.heroImageUrl ?? "",
          sortOrder: p.sortOrder,
          countryId: p.countryId ?? "",
          seoTitle: p.seoTitle ?? "",
          seoDescription: p.seoDescription ?? "",
          seoKeywords: p.seoKeywords ?? [],
        });
        setKeywordsInput((p.seoKeywords ?? []).join(", "));
        setLoading(false);
      });
  }, [placeId]);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadAssetImage(file);
      setData((d) => ({ ...d, heroImageUrl: url }));
    } catch {
      setErrorMsg("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setErrorMsg(null);

    const payload = {
      ...data,
      countryId: data.countryId || null,
      seoKeywords: keywordsInput
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    };

    const url = placeId ? `/api/admin/places/${placeId}` : "/api/admin/places";
    const method = placeId ? "PATCH" : "POST";
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
    if (!placeId) {
      router.push("/admin/destinations/places");
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

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Basic info</h2>
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
              placeholder="Antalya"
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country (text)</label>
            <input
              type="text"
              required
              value={data.country}
              onChange={(e) => setData((d) => ({ ...d, country: e.target.value }))}
              placeholder="Turkey"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Region (text)</label>
            <input
              type="text"
              value={data.region}
              onChange={(e) => setData((d) => ({ ...d, region: e.target.value }))}
              placeholder="Costa Blanca"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Linked destination page</label>
            <select
              value={data.countryId}
              onChange={(e) => setData((d) => ({ ...d, countryId: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition bg-white"
            >
              <option value="">None</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Shows this place as a &ldquo;Top Destination&rdquo; card on the linked page.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Image &amp; description</h2>
        <div className="flex items-start gap-4 mb-5">
          <div className="relative w-40 h-28 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
            {data.heroImageUrl ? (
              <Image src={data.heroImageUrl} alt="" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 text-xs">No image</div>
            )}
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
            <FiUpload /> {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <RichTextEditor
          value={data.description}
          onChange={(html) => setData((d) => ({ ...d, description: html }))}
          placeholder="Beautiful beaches, luxury resorts and a vibrant old town."
        />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Sort order</h2>
        <input
          type="number"
          value={data.sortOrder}
          onChange={(e) => setData((d) => ({ ...d, sortOrder: Number(e.target.value) }))}
          className="w-24 px-3 py-1.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm"
        />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta title</label>
            <input
              type="text"
              maxLength={70}
              value={data.seoTitle}
              onChange={(e) => setData((d) => ({ ...d, seoTitle: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta description</label>
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
              placeholder="antalya holidays, turkey beach"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
            />
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-gray-100 -mx-6 px-6 py-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors"
        >
          {saving ? "Saving..." : placeId ? "Save changes" : "Create place"}
        </button>
      </div>
    </form>
  );
}
