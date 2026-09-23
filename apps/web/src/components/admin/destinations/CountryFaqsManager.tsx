"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiHelpCircle } from "react-icons/fi";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
};

function FaqEditForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<Faq>;
  onSave: (data: { question: string; answer: string; sortOrder: number; isPublished: boolean }) => void;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(initial.question ?? "");
  const [answer, setAnswer] = useState(initial.answer ?? "");
  const [sortOrder, setSortOrder] = useState(initial.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initial.isPublished ?? true);

  return (
    <div className="bg-brand-50/40 rounded-xl p-4 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
        />
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          placeholder="Order"
          className="w-20 px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
        />
      </div>
      <RichTextEditor value={answer} onChange={setAnswer} placeholder="Answer" minHeight={90} />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          Published
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!question || !answer}
            onClick={() => onSave({ question, answer, sortOrder, isPublished })}
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
    </div>
  );
}

export function CountryFaqsManager({ countryId }: { countryId: string }) {
  const [items, setItems] = useState<Faq[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/faqs?countryId=${countryId}`);
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  async function handleCreate(data: { question: string; answer: string; sortOrder: number; isPublished: boolean }) {
    await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, category: "destination", countryId }),
    });
    setAdding(false);
    load();
  }

  async function handleUpdate(
    id: string,
    data: { question: string; answer: string; sortOrder: number; isPublished: boolean }
  ) {
    await fetch(`/api/admin/faqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string, question: string) {
    if (!confirm(`Delete "${question}"?`)) return;
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    load();
  }

  if (!items) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div>
      {items.length === 0 && !adding && (
        <p className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 rounded-lg px-4 py-3 mb-3">
          <FiHelpCircle /> No FAQs for this destination yet.
        </p>
      )}

      <div className="space-y-2">
        {items.map((f) =>
          editingId === f.id ? (
            <FaqEditForm key={f.id} initial={f} onSave={(data) => handleUpdate(f.id, data)} onCancel={() => setEditingId(null)} />
          ) : (
            <div key={f.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{f.question}</p>
                <div
                  className="text-xs text-gray-500 mt-0.5 line-clamp-2 [&_p]:inline"
                  dangerouslySetInnerHTML={{ __html: f.answer }}
                />
                {!f.isPublished && (
                  <span className="inline-block mt-1 text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    Draft
                  </span>
                )}
              </div>
              <button
                onClick={() => setEditingId(f.id)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 transition-colors shrink-0"
                aria-label="Edit"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => handleDelete(f.id, f.question)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                aria-label="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          )
        )}

        {adding && <FaqEditForm initial={{}} onSave={handleCreate} onCancel={() => setAdding(false)} />}
      </div>

      {!adding && (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-600 hover:underline"
        >
          <FiPlus /> Add FAQ
        </button>
      )}
    </div>
  );
}
