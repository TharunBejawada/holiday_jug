"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiPlus, FiUpload, FiX, FiCheck } from "react-icons/fi";
import { uploadAssetImage } from "@/lib/upload-asset";

type HolidayType = {
  id: string;
  slug: string;
  name: string;
  iconUrl: string | null;
  description: string | null;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function HolidayTypeEditForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<HolidayType>;
  onSave: (data: { name: string; slug: string; iconUrl: string; description: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial.name ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);
  const [iconUrl, setIconUrl] = useState(initial.iconUrl ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadAssetImage(file);
      setIconUrl(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start bg-brand-50/40 rounded-xl p-3">
      <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
        {iconUrl ? (
          <Image src={iconUrl} alt="" fill className="object-cover" />
        ) : (
          <label className="flex items-center justify-center h-full text-gray-300 cursor-pointer">
            <FiUpload className="text-xs" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>
        )}
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder="Name"
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
        />
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          placeholder="slug"
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-mono focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Default description"
          className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
        />
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          disabled={!name || !slug || uploading}
          onClick={() => onSave({ name, slug, iconUrl, description })}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
          aria-label="Save"
        >
          <FiCheck />
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Cancel"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
}

export function HolidayTypesManager() {
  const [items, setItems] = useState<HolidayType[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/holiday-types");
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(data: { name: string; slug: string; iconUrl: string; description: string }) {
    await fetch("/api/admin/holiday-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setAdding(false);
    load();
  }

  async function handleUpdate(id: string, data: { name: string; slug: string; iconUrl: string; description: string }) {
    await fetch(`/api/admin/holiday-types/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/holiday-types/${id}`, { method: "DELETE" });
    load();
  }

  if (!items) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="space-y-2">
        {items.map((ht) =>
          editingId === ht.id ? (
            <HolidayTypeEditForm
              key={ht.id}
              initial={ht}
              onSave={(data) => handleUpdate(ht.id, data)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={ht.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                {ht.iconUrl && <Image src={ht.iconUrl} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{ht.name}</p>
                {ht.description && <p className="text-xs text-gray-500 truncate">{ht.description}</p>}
              </div>
              <button
                onClick={() => setEditingId(ht.id)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 transition-colors"
                aria-label="Edit"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => handleDelete(ht.id, ht.name)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          )
        )}

        {adding && (
          <HolidayTypeEditForm initial={{}} onSave={handleCreate} onCancel={() => setAdding(false)} />
        )}
      </div>

      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-600 hover:underline"
        >
          <FiPlus /> Add holiday type
        </button>
      )}
    </div>
  );
}
