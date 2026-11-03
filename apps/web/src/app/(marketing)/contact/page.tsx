import type { Metadata } from "next";
import Link from "next/link";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHeadset,
    FaClock,
    FaBuilding,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
    title: "Contact Us — HolidayJug",
    description:
        "Get in touch with HolidayJug. UK helpline, registered office address, and customer support details. Call 0330 165 8879.",
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
                        Have questions about booking a holiday, modifying your reservation, or need assistance? Reach out to our UK Sales and Support team.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10">
                {/* TOP CONTACT HIGHLIGHT CARDS (3 Balanced Cards: UK Helpline, Support Emails, Registered Office) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* 1. UK HELPLINE */}
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
                                        Direct UK Freephone: <strong className="font-semibold text-slate-700">0330 165 8879</strong>
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

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                                <FaClock className="text-[#F7941D] shrink-0" />
                                <span>Mon – Sun: 9AM to 9PM</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. EMAIL & SUPPORT INQUIRIES */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-[#F7941D]/15 text-[#F7941D] flex items-center justify-center text-xl mb-4">
                                <FaEnvelope />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider">
                                    Online Inquiries
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-[#071746] mb-4">Customer Support</h2>

                            <div className="space-y-3 text-sm">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">
                                        General Inquiries
                                    </span>
                                    <a
                                        href="mailto:admin@holidayjug.com"
                                        className="text-base font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5"
                                    >
                                        <FaEnvelope className="text-xs text-[#F7941D]" />
                                        admin@holidayjug.com
                                    </a>
                                </div>

                                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100/80">
                                    <span className="text-xs font-semibold text-slate-600 block uppercase tracking-wide">
                                        Support Inquiries
                                    </span>
                                    <a
                                        href="mailto:support@holidayjug.com"
                                        className="text-base font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5"
                                    >
                                        <FaEnvelope className="text-xs text-[#F7941D]" />
                                        support@holidayjug.com
                                    </a>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                                <FaClock className="text-[#F7941D] shrink-0" />
                                <span>Support Hours: Mon – Sun 9AM to 9PM</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. REGISTERED OFFICE */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-[#071746] text-white flex items-center justify-center text-xl mb-4">
                                <FaBuilding />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider">
                                    Company Registration
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-[#071746] mb-3">Registered Office</h2>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                <p className="font-bold text-sm text-[#071746]">
                                    HolidayJug LTD.
                                </p>
                                <p className="text-xs font-semibold text-slate-500">
                                    Company number 17492828
                                </p>
                                <div className="pt-1 border-t border-slate-200/60 flex items-start gap-2.5">
                                    <FaMapMarkerAlt className="text-[#F7941D] text-base shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                                            Registered office address
                                        </span>
                                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                                            128 City Road, London,<br />
                                            United Kingdom, EC1V 2NX
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                                <FaClock className="text-[#F7941D] shrink-0" />
                                <span>Operating Hours: Mon – Sun 9AM to 9PM</span>
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
                            Whether you need assistance booking a new holiday, modifying an existing reservation, or inquiring about travel protection, our dedicated UK support specialists are ready to help.
                        </p>

                        <div className="space-y-4 pt-2">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-xs font-bold text-[#071746] uppercase tracking-wide">
                                    UK Sales &amp; Enquiries
                                </span>
                                <p className="text-sm text-slate-700">
                                    Call <a href="tel:+443301658879" className="font-bold text-[#071746] hover:text-[#F7941D]">+44 330 165 8879</a> or <a href="tel:03301658879" className="font-bold text-[#071746] hover:text-[#F7941D]">0330 165 8879</a>
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-xs font-bold text-[#071746] uppercase tracking-wide">
                                    UK Customer Support
                                </span>
                                <p className="text-sm text-slate-700">
                                    Call <a href="tel:+443300249639" className="font-bold text-[#071746] hover:text-[#F7941D]">+44 330 024 9639</a>
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-xs font-bold text-[#071746] uppercase tracking-wide">
                                    Email Inquiries
                                </span>
                                <p className="text-sm text-slate-700">
                                    General Inquiries: <a href="mailto:admin@holidayjug.com" className="font-bold text-[#071746] hover:text-[#F7941D]">admin@holidayjug.com</a><br />
                                    Support Inquiries: <a href="mailto:support@holidayjug.com" className="font-bold text-[#071746] hover:text-[#F7941D]">support@holidayjug.com</a>
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-xs font-bold text-[#071746] uppercase tracking-wide">
                                    Operating Timings
                                </span>
                                <p className="text-sm font-semibold text-slate-800">
                                    Mon – Sun: 9AM to 9PM
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                                <span className="text-xs font-bold text-[#071746] uppercase tracking-wide">
                                    Registered Office
                                </span>
                                <p className="text-sm font-bold text-[#071746]">
                                    HolidayJug LTD.
                                </p>
                                <p className="text-xs text-slate-500 font-semibold">
                                    Company number 17492828
                                </p>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-1">
                                    Registered office address
                                </p>
                                <p className="text-sm text-slate-700 font-semibold">
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
                                    href="https://www.facebook.com/HolidayJugUK"
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

                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
