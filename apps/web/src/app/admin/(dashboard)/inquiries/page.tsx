"use client";

import { useEffect, useState } from "react";
import {
  FiMail,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiPhone,
  FiUser,
  FiTag,
  FiBookmark,
  FiX,
  FiChevronRight,
  FiEdit3,
} from "react-icons/fi";

interface ContactSubmission {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  bookingRef?: string | null;
  subject: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adminNotesDraft, setAdminNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (err) {
      console.error("Failed to load contact submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "NEW" | "IN_PROGRESS" | "RESOLVED"
  ) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.submission) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedItem?.id === id) {
          setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedItem) return;
    try {
      setSavingNotes(true);
      const res = await fetch(`/api/contact/${selectedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedItem.status,
          adminNotes: adminNotesDraft,
        }),
      });
      const data = await res.json();
      if (data.success && data.submission) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id ? { ...item, adminNotes: adminNotesDraft } : item
          )
        );
        setSelectedItem((prev) => (prev ? { ...prev, adminNotes: adminNotesDraft } : null));
      }
    } catch (err) {
      console.error("Failed to save admin notes:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  const openDetails = (item: ContactSubmission) => {
    setSelectedItem(item);
    setAdminNotesDraft(item.adminNotes || "");
  };

  const filteredItems = items.filter((item) => {
    if (statusFilter !== "ALL" && item.status !== statusFilter) {
      return false;
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchesName = item.fullName.toLowerCase().includes(s);
      const matchesEmail = item.email.toLowerCase().includes(s);
      const matchesPhone = item.phone?.toLowerCase().includes(s);
      const matchesRef = item.bookingRef?.toLowerCase().includes(s);
      const matchesSubj = item.subject.toLowerCase().includes(s);
      const matchesMsg = item.message.toLowerCase().includes(s);
      return matchesName || matchesEmail || matchesPhone || matchesRef || matchesSubj || matchesMsg;
    }
    return true;
  });

  const countNew = items.filter((i) => i.status === "NEW").length;
  const countInProgress = items.filter((i) => i.status === "IN_PROGRESS").length;
  const countResolved = items.filter((i) => i.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <FiMail className="text-[#071746]" /> Customer Inquiries &amp; Messages
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time messages submitted via the website contact form
          </p>
        </div>
        <button
          type="button"
          onClick={loadSubmissions}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
        >
          <FiRefreshCw className={`text-xs ${loading ? "animate-spin text-[#F7941D]" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "ALL"
              ? "bg-[#071746] text-white border-[#071746] shadow-md"
              : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className={`text-xs font-medium ${statusFilter === "ALL" ? "text-gray-300" : "text-gray-500"}`}>
            Total Messages
          </p>
          <p className="text-2xl font-bold mt-1">{items.length}</p>
        </div>

        <div
          onClick={() => setStatusFilter("NEW")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "NEW"
              ? "bg-amber-500 text-white border-amber-500 shadow-md"
              : "bg-white text-gray-800 border-gray-200 hover:border-amber-200"
          }`}
        >
          <p className={`text-xs font-medium ${statusFilter === "NEW" ? "text-amber-100" : "text-amber-600"}`}>
            New / Unread
          </p>
          <p className="text-2xl font-bold mt-1 flex items-center gap-2">
            {countNew}
            {countNew > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            )}
          </p>
        </div>

        <div
          onClick={() => setStatusFilter("IN_PROGRESS")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "IN_PROGRESS"
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-gray-800 border-gray-200 hover:border-blue-200"
          }`}
        >
          <p className={`text-xs font-medium ${statusFilter === "IN_PROGRESS" ? "text-blue-100" : "text-blue-600"}`}>
            In Progress
          </p>
          <p className="text-2xl font-bold mt-1">{countInProgress}</p>
        </div>

        <div
          onClick={() => setStatusFilter("RESOLVED")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "RESOLVED"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
              : "bg-white text-gray-800 border-gray-200 hover:border-emerald-200"
          }`}
        >
          <p className={`text-xs font-medium ${statusFilter === "RESOLVED" ? "text-emerald-100" : "text-emerald-600"}`}>
            Resolved
          </p>
          <p className="text-2xl font-bold mt-1">{countResolved}</p>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, booking ref..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "NEW", "IN_PROGRESS", "RESOLVED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-[#071746] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st === "ALL"
                ? "All"
                : st === "NEW"
                ? "New"
                : st === "IN_PROGRESS"
                ? "In Progress"
                : "Resolved"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <FiRefreshCw className="animate-spin text-2xl mx-auto mb-2 text-[#F7941D]" />
            <p className="text-sm">Loading customer inquiries...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <FiMail className="text-4xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">No Inquiries Found</h3>
            <p className="text-xs text-gray-500 mt-1">
              {search ? "No inquiries matched your search keywords." : "No messages have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Date / Time</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Message Snippet</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => {
                  const date = new Date(item.createdAt);
                  const formattedDate = date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const formattedTime = date.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/30 transition-colors cursor-pointer group"
                      onClick={() => openDetails(item)}
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                        <div className="font-semibold text-gray-900">{formattedDate}</div>
                        <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                          <FiClock className="text-[10px]" /> {formattedTime}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <FiUser className="text-gray-400 text-xs shrink-0" />
                          <span>{item.fullName}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.email}</div>
                        {item.phone && (
                          <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <FiPhone className="text-[9px]" /> {item.phone}
                          </div>
                        )}
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          <FiTag className="text-[10px] text-[#F7941D]" />
                          {item.subject}
                        </span>
                      </td>

                      {/* Booking Ref */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.bookingRef ? (
                          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                            {item.bookingRef}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">—</span>
                        )}
                      </td>

                      {/* Message Preview */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) =>
                            handleUpdateStatus(
                              item.id,
                              e.target.value as "NEW" | "IN_PROGRESS" | "RESOLVED"
                            )
                          }
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer focus:outline-none ${
                            item.status === "NEW"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : item.status === "IN_PROGRESS"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : "bg-emerald-50 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openDetails(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#071746] hover:bg-[#071746] hover:text-white border border-[#071746]/20 transition-all cursor-pointer"
                        >
                          <span>View</span>
                          <FiChevronRight className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Customer Inquiry
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                  {selectedItem.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 uppercase font-bold tracking-wider block">From</span>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">{selectedItem.fullName}</p>
                  <a
                    href={`mailto:${selectedItem.email}?subject=${encodeURIComponent(
                      `Re: Holiday Jug Inquiry - ${selectedItem.subject}`
                    )}`}
                    className="text-blue-600 hover:underline block mt-0.5 font-medium"
                  >
                    {selectedItem.email} &rarr;
                  </a>
                  {selectedItem.phone && (
                    <a
                      href={`tel:${selectedItem.phone}`}
                      className="text-gray-600 hover:text-blue-600 block mt-0.5"
                    >
                      {selectedItem.phone}
                    </a>
                  )}
                </div>

                <div>
                  <span className="text-gray-400 uppercase font-bold tracking-wider block">Submitted At</span>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">
                    {new Date(selectedItem.createdAt).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {selectedItem.bookingRef && (
                    <div className="mt-2">
                      <span className="text-gray-400 uppercase font-bold tracking-wider block">
                        Booking Reference
                      </span>
                      <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 inline-block mt-0.5">
                        {selectedItem.bookingRef}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Selector in Modal */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-white">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Resolution Status:
                </span>
                <div className="flex items-center gap-2">
                  {(["NEW", "IN_PROGRESS", "RESOLVED"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingId === selectedItem.id}
                      onClick={() => handleUpdateStatus(selectedItem.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedItem.status === st
                          ? st === "NEW"
                            ? "bg-amber-500 text-white shadow-sm"
                            : st === "IN_PROGRESS"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-emerald-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {st === "NEW" ? "New" : st === "IN_PROGRESS" ? "In Progress" : "Resolved"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                  Message Content:
                </label>
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedItem.message}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5">
                    <FiEdit3 className="text-gray-400" /> Internal Notes (Staff Only)
                  </span>
                  {savingNotes && <span className="text-xs text-[#F7941D]">Saving...</span>}
                </label>
                <textarea
                  rows={3}
                  value={adminNotesDraft}
                  onChange={(e) => setAdminNotesDraft(e.target.value)}
                  placeholder="Record call logs, agent assigned, or resolution notes..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
                ></textarea>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="mt-2 px-4 py-1.5 text-xs font-bold rounded-lg bg-[#071746] text-white hover:bg-[#0c2266] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <a
                href={`mailto:${selectedItem.email}?subject=${encodeURIComponent(
                  `Holiday Jug Support - ${selectedItem.subject}`
                )}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <FiMail className="text-xs" />
                Reply via Email
              </a>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

