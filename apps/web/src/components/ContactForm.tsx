"use client";

import { useState } from "react";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";
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

export function ContactForm() {
  const [subject, setSubject] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-10 px-4 bg-amber-50/50 rounded-2xl border border-amber-200/60">
        <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#071746]">Thank you for reaching out!</h3>
        <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
          We have received your message regarding &ldquo;{SUBJECT_OPTIONS.find((s) => s.value === subject)?.label || subject}&rdquo;. One of our travel advisors will contact you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setSubject("");
            setMessage("");
          }}
          className="mt-5 px-5 py-2 text-xs font-semibold rounded-xl bg-[#071746] text-white hover:bg-[#F7941D] transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="+44 ..."
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
            placeholder="HJ-12345"
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
        disabled={!subject}
        className="inline-flex items-center gap-2.5 rounded-xl bg-[#F7941D] px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e08316] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
      >
        <FaPaperPlane className="text-xs" />
        Send Message
      </button>
    </form>
  );
}

