import type { Metadata } from "next";
import Link from "next/link";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHeadset,
    FaClock,
    FaPaperPlane,
    FaBuilding,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const metadata: Metadata = {
    title: "Contact Us — HolidayJug",
    description:
        "Get in touch with HolidayJug. Sales & Support contact numbers for UK and India, registered office address, and customer support details.",
};

export default function ContactPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-16">
            {/* HERO BANNER */}
            <div className="bg-[#071746] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-center space-y-3">
                    <span className="inline-block bg-[#F7941D]/20 text-[#F7941D] font-semibold text-xs sm:text-sm px-3.5 py-1 rounded-full uppercase tracking-wider">
                        We are here to help
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                        Contact HolidayJug
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
                        Have questions about booking a holiday, modifying your reservation, or need assistance? Reach out to our Sales and Support teams in the UK and India.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10">
                {/* TOP CONTACT HIGHLIGHT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* UK CARDS */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-[#071746]/10 text-[#071746] flex items-center justify-center text-xl mb-4">
                                <FaHeadset />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider">
                                    United Kingdom
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-[#071746] mb-4">UK Helpline</h2>

                            <div className="space-y-3 text-sm">
                                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100/80">
                                    <span className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">
                                        Sales Line
                                    </span>
                                    <a
                                        href="tel:+443301658879"
                                        className="text-lg font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5"
                                    >
                                        <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                        +44 330 165 8879
                                    </a>
                                    <span className="text-[11px] text-slate-500 block mt-0.5">
                                        Direct UK Toll-free: <strong className="font-semibold text-slate-700">0330 165 8879</strong>
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">
                                        Support Line
                                    </span>
                                    <a
                                        href="tel:+443300249639"
                                        className="text-base font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5"
                                    >
                                        <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                        +44 330 024 9639
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INDIA CARDS */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-[#F7941D]/10 text-[#F7941D] flex items-center justify-center text-xl mb-4">
                                <FaHeadset />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider">
                                    India
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-[#071746] mb-4">India Helpline</h2>

                            <div className="space-y-3 text-sm">
                                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100/80">
                                    <span className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">
                                        Sales Line
                                    </span>
                                    <a
                                        href="tel:+917699512345"
                                        className="text-base sm:text-lg font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5"
                                    >
                                        <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                        +91 76995 12345
                                    </a>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">
                                        Support Line
                                    </span>
                                    <a
                                        href="tel:+918977396433"
                                        className="text-base font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5"
                                    >
                                        <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                        +91 89773 96433
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* REGISTERED OFFICE CARD */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-[#071746] text-white flex items-center justify-center text-xl mb-4">
                                <FaBuilding />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider">
                                    Official Address
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-[#071746] mb-3">Registered Office</h2>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                <div className="flex items-start gap-2.5">
                                    <FaMapMarkerAlt className="text-[#F7941D] text-base shrink-0 mt-1" />
                                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                                        128 City Road, London,<br />
                                        United Kingdom, EC1V 2NX
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <FaEnvelope className="text-[#F7941D]" />
                                    <span>General Inquiries: <a href="mailto:support@holidayjug.com" className="font-semibold text-[#071746] hover:underline">support@holidayjug.com</a></span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <FaClock className="text-[#F7941D]" />
                                    <span>Mon – Sat: 9:00 AM – 7:00 PM GMT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DETAILED SECTION & FORM */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT INFORMATION SUMMARY */}
                    <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                        <h3 className="text-2xl font-extrabold text-[#071746]">
                            Get in Touch
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Whether you need assistance booking a new holiday, modifying an existing reservation, or inquiring about travel protection, our dedicated support specialists are ready to help.
                        </p>

                        <div className="space-y-4 pt-2">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-xs font-bold text-[#071746] uppercase tracking-wide">
                                    UK Sales &amp; Enquiries
                                </span>
                                <p className="text-sm text-slate-700">
                                    Call <strong className="text-[#071746]">+44 330 165 8879</strong> or <strong className="text-[#071746]">0330 165 8879</strong>
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-xs font-bold text-[#071746] uppercase tracking-wide">
                                    UK Customer Support
                                </span>
                                <p className="text-sm text-slate-700">
                                    Call <strong className="text-[#071746]">+44 330 024 9639</strong>
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-xs font-bold text-[#071746] uppercase tracking-wide">
                                    India Sales &amp; Support
                                </span>
                                <p className="text-sm text-slate-700">
                                    Sales: <strong className="text-[#071746]">+91 76995 12345</strong><br />
                                    Support: <strong className="text-[#071746]">+91 89773 96433</strong>
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-xs font-bold text-[#071746] uppercase tracking-wide">
                                    Registered Office Address
                                </span>
                                <p className="text-sm text-slate-700 font-medium">
                                    128 City Road, London, United Kingdom, EC1V 2NX
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/complaints-procedure"
                                className="inline-flex items-center gap-2 text-xs font-semibold text-[#F7941D] hover:underline"
                            >
                                View Complaints Procedure &rarr;
                            </Link>
                        </div>

                        {/* SOCIAL MEDIA CHANNELS */}
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <span className="text-xs font-bold text-[#071746] uppercase tracking-wide block">
                                Connect With Us
                            </span>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://www.facebook.com/HOLIDAYJUG/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="HolidayJug Facebook Page"
                                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-[#F7941D] text-[#071746] hover:text-white flex items-center justify-center text-sm transition-all duration-300 shadow-xs"
                                >
                                    <FaFacebookF />
                                </a>
                                <a
                                    href="https://www.instagram.com/holidayjug/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="HolidayJug Instagram Profile"
                                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-[#F7941D] text-[#071746] hover:text-white flex items-center justify-center text-sm transition-all duration-300 shadow-xs"
                                >
                                    <FaInstagram />
                                </a>
                                <a
                                    href="https://x.com/Holidayjug"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="HolidayJug X Profile"
                                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-[#F7941D] text-[#071746] hover:text-white flex items-center justify-center text-sm transition-all duration-300 shadow-xs"
                                >
                                    <FaXTwitter />
                                </a>
                                <a
                                    href="https://youtube.com/@holidayjug?si=rVl_T3N1wBdAUaaf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="HolidayJug YouTube Channel"
                                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-[#F7941D] text-[#071746] hover:text-white flex items-center justify-center text-sm transition-all duration-300 shadow-xs"
                                >
                                    <FaYoutube />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTACT FORM */}
                    <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
                        <h3 className="text-2xl font-extrabold text-[#071746] mb-2">
                            Send Us a Message
                        </h3>
                        <p className="text-sm text-slate-600 mb-6">
                            Fill out the form below and one of our travel advisors will get back to you promptly.
                        </p>

                        <form className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#071746] uppercase tracking-wide mb-1.5">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
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
                                        placeholder="HJ-12345"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#071746] uppercase tracking-wide mb-1.5">
                                    Subject *
                                </label>
                                <select
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
                                >
                                    <option value="">Select a topic</option>
                                    <option value="sales">New Booking Enquiry / Sales</option>
                                    <option value="support">Customer Support &amp; Bookings</option>
                                    <option value="complaint">Post-Holiday Complaint</option>
                                    <option value="other">General Enquiry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#071746] uppercase tracking-wide mb-1.5">
                                    Message *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="How can we assist you with your holiday?"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2.5 rounded-xl bg-[#F7941D] px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e08316] transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
                            >
                                <FaPaperPlane className="text-xs" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
