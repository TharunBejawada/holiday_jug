"use client";

import { useState } from "react";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaTimes,
  FaCopy,
  FaCheck,
  FaSpinner,
  FaPhoneAlt,
  FaEnvelope,
  FaTag,
} from "react-icons/fa";
import { SearchableSelect } from "@/components/SearchableSelect";

const SUBJECT_OPTIONS = [
  {
    value: "sales",
    label: "New Booking Enquiry / Sales",
    subtitle: "Holiday packages, flight & hotel inquiries",
  },
  {
    value: "support",
    label: "Customer Support & Bookings",
    subtitle: "Manage existing reservations, amendments, inquiries",
  },
  {
    value: "complaint",
    label: "Post-Holiday Complaint",
    subtitle: "Feedback, issues, after-travel resolutions",
  },
  {
    value: "other",
    label: "General Enquiry",
    subtitle: "General questions and partnerships",
  },
];

interface SubmittedInfo {
  fullName: string;
  email: string;
  phone?: string;
  bookingRef?: string;
  subjectLabel: string;
  referenceCode: string;
}

export function ContactForm() {
  const [subject, setSubject] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState<SubmittedInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) {
      setErrorMessage("Please select an enquiry topic.");
      return;
    }
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please fill in all mandatory fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          bookingRef,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit enquiry. Please try again.");
      }

      const subjectLabel =
        SUBJECT_OPTIONS.find((s) => s.value === subject)?.label || subject;

      setSubmittedInfo({
        fullName,
        email,
        phone: phone || undefined,
        bookingRef: bookingRef || undefined,
        subjectLabel,
        referenceCode: data.referenceCode || `HJ-INQ-${Date.now().toString().slice(-5)}`,
      });

      setIsModalOpen(true);

      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setBookingRef("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage(
        err.message || "An unexpected error occurred. Please try again or call 0330 165 8879."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (!submittedInfo?.referenceCode) return;
    navigator.clipboard.writeText(submittedInfo.referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-700 ml-2"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#071746] uppercase tracking-wide mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#071746] uppercase tracking-wide mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#071746] uppercase tracking-wide mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7123 456789"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#071746] uppercase tracking-wide mb-1.5">
              Booking Reference (Optional)
            </label>
            <input
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder="e.g. HJ-12345"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#071746] uppercase tracking-wide mb-1.5">
            Subject *
          </label>
          <SearchableSelect
            options={SUBJECT_OPTIONS}
            value={subject}
            onChange={setSubject}
            placeholder="Select a topic..."
            searchPlaceholder="Search topic..."
            isClearable
            triggerClassName="bg-white border-slate-200 focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#071746] uppercase tracking-wide mb-1.5">
            Message *
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we assist you with your holiday?"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={!subject || isSubmitting}
          className="inline-flex items-center gap-2.5 rounded-xl bg-[#F7941D] px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e08316] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <FaPaperPlane className="text-xs" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>

      {/* THANK YOU POPUP MODAL */}
      {isModalOpen && submittedInfo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all p-6 sm:p-8">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close thank you popup"
            >
              <FaTimes className="text-base" />
            </button>

            {/* Checkmark Icon with Gradient Rings */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-inner mb-4">
                <FaCheckCircle className="text-3xl sm:text-4xl" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#071746]">
                Thank You for Reaching Out!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-sm mx-auto">
                We have successfully received your enquiry. A dedicated Holiday Jug travel specialist will review your message and get back to you shortly.
              </p>
            </div>

            {/* Reference Badge Card */}
            <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Enquiry Reference Code
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-[#071746]">
                  {submittedInfo.referenceCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyReference}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
              >
                {copiedRef ? (
                  <>
                    <FaCheck className="text-emerald-500" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Submission Summary Details */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs sm:text-sm space-y-2 text-slate-700">
              <div className="flex items-center gap-2">
                <FaTag className="text-[#F7941D] text-xs shrink-0" />
                <span className="font-semibold text-[#071746]">Topic:</span>
                <span className="truncate">{submittedInfo.subjectLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[#F7941D] text-xs shrink-0" />
                <span className="font-semibold text-[#071746]">Contact:</span>
                <span className="truncate">
                  {submittedInfo.fullName} ({submittedInfo.email})
                </span>
              </div>
              {submittedInfo.phone && (
                <div className="flex items-center gap-2">
                  <FaPhoneAlt className="text-[#F7941D] text-xs shrink-0" />
                  <span className="font-semibold text-[#071746]">Phone:</span>
                  <span>{submittedInfo.phone}</span>
                </div>
              )}
              {submittedInfo.bookingRef && (
                <div className="flex items-center gap-2">
                  <span className="w-3 text-center text-[#F7941D] font-bold">#</span>
                  <span className="font-semibold text-[#071746]">Booking Ref:</span>
                  <span className="font-mono">{submittedInfo.bookingRef}</span>
                </div>
              )}
            </div>

            {/* Urgent Support Note */}
            <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] sm:text-xs text-blue-900 flex items-start gap-2.5">
              <FaPhoneAlt className="text-blue-600 text-xs shrink-0 mt-0.5" />
              <p>
                Need immediate assistance with an urgent departure? Call our UK specialists directly at{" "}
                <a href="tel:03301658879" className="font-bold underline text-blue-700">
                  0330 165 8879
                </a>{" "}
                (Daily 9AM - 9PM).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#071746] hover:bg-[#0c2266] text-white font-semibold text-xs sm:text-sm transition-colors text-center shadow-md cursor-pointer"
              >
                Close &amp; Return
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors text-center cursor-pointer"
              >
                Send Another
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
