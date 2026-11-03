import type { Metadata } from "next";
import {
    FaBuilding,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const metadata: Metadata = {
    title: "About Us & Company Information — HolidayJug LTD",
    description:
        "Official company information for HolidayJug LTD. Registered office address, company number 17492828, UK helpline, and customer support details.",
};

export default function AboutPage() {
    return (
        <div className="bg-slate-50 min-h-screen text-slate-800">
            {/* 1. TOP HERO SECTION: TITLE AT TOP & COMPANY INFO */}
            <section className="bg-[#071746] text-white pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F7941D]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="mx-auto max-w-7xl relative z-10">
                    {/* Top Hero Title */}
                    <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
                        <span className="inline-block bg-[#F7941D]/20 text-[#F7941D] font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full uppercase tracking-wider">
                            About HolidayJug
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            About Us &amp; Company Information
                        </h1>
                        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                            Official corporate registration details and customer support channels.
                        </p>
                    </div>

                    {/* COMPANY INFO CARD IN TOP HERO */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl text-white">
                        <div className="flex items-center gap-3 border-b border-white/15 pb-4 mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-[#F7941D] text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                                <FaBuilding />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                                    HolidayJug LTD.
                                </h2>
                                <p className="text-xs sm:text-sm text-amber-300 font-semibold">
                                    Company number 17492828
                                </p>
                            </div>
                        </div>

                        {/* 3-Column Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {/* REGISTERED OFFICE ADDRESS */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                                <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider block">
                                    Registered Office Address
                                </span>
                                <div className="flex items-start gap-2.5 pt-1">
                                    <FaMapMarkerAlt className="text-[#F7941D] text-base shrink-0 mt-0.5" />
                                    <p className="text-sm font-semibold text-white/95 leading-relaxed">
                                        HolidayJug LTD.<br />
                                        128 City Road, London,<br />
                                        United Kingdom, EC1V 2NX
                                    </p>
                                </div>
                            </div>

                            {/* UK SALES & SUPPORT HELPLINE */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                                <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider block">
                                    UK Helpline
                                </span>
                                <div className="space-y-1.5 pt-1 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaPhoneAlt className="text-[#F7941D] text-xs shrink-0" />
                                        <span className="text-white/80">Sales:</span>
                                        <a href="tel:+443301658879" className="font-bold text-white hover:text-[#F7941D] transition-colors">
                                            0330 165 8879
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaPhoneAlt className="text-[#F7941D] text-xs shrink-0" />
                                        <span className="text-white/80">Support:</span>
                                        <a href="tel:+443300249639" className="font-bold text-white hover:text-[#F7941D] transition-colors">
                                            +44 330 024 9639
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-amber-200 pt-1">
                                        <FaClock className="text-[#F7941D] text-xs shrink-0" />
                                        <span>Hours: Mon – Sun 9AM to 9PM</span>
                                    </div>
                                </div>
                            </div>

                            {/* EMAIL INQUIRIES */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                                <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider block">
                                    Email Inquiries
                                </span>
                                <div className="space-y-2 pt-1 text-sm">
                                    <div>
                                        <span className="text-xs text-white/70 block">General Inquiries:</span>
                                        <a
                                            href="mailto:admin@holidayjug.com"
                                            className="font-bold text-white hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5"
                                        >
                                            <FaEnvelope className="text-[#F7941D] text-xs shrink-0" />
                                            admin@holidayjug.com
                                        </a>
                                    </div>
                                    <div className="pt-1 border-t border-white/10">
                                        <span className="text-xs text-white/70 block">Customer Support:</span>
                                        <a
                                            href="mailto:support@holidayjug.com"
                                            className="font-bold text-white hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5"
                                        >
                                            <FaEnvelope className="text-[#F7941D] text-xs shrink-0" />
                                            support@holidayjug.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. OFFICIAL SOCIAL MEDIA CHANNELS */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-xl font-bold text-[#071746]">
                        Official Social Media Channels
                    </h3>
                    <p className="text-sm text-slate-600 font-normal">
                        Follow and connect with HolidayJug across our verified social profiles:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <a
                            href="https://www.facebook.com/HolidayJugUK"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#F7941D] hover:shadow-sm transition-all group"
                        >
                            <span className="w-9 h-9 rounded-lg bg-[#071746] text-white group-hover:bg-[#F7941D] flex items-center justify-center text-sm transition-colors">
                                <FaFacebookF />
                            </span>
                            <div>
                                <span className="text-xs font-bold text-[#071746] block">Facebook</span>
                                <span className="text-[11px] text-slate-500">@HolidayJugUK</span>
                            </div>
                        </a>

                        <a
                            href="https://www.instagram.com/holidayjug/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#F7941D] hover:shadow-sm transition-all group"
                        >
                            <span className="w-9 h-9 rounded-lg bg-[#071746] text-white group-hover:bg-[#F7941D] flex items-center justify-center text-sm transition-colors">
                                <FaInstagram />
                            </span>
                            <div>
                                <span className="text-xs font-bold text-[#071746] block">Instagram</span>
                                <span className="text-[11px] text-slate-500">@holidayjug</span>
                            </div>
                        </a>

                        <a
                            href="https://x.com/Holidayjug"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#F7941D] hover:shadow-sm transition-all group"
                        >
                            <span className="w-9 h-9 rounded-lg bg-[#071746] text-white group-hover:bg-[#F7941D] flex items-center justify-center text-sm transition-colors">
                                <FaXTwitter />
                            </span>
                            <div>
                                <span className="text-xs font-bold text-[#071746] block">X (Twitter)</span>
                                <span className="text-[11px] text-slate-500">@Holidayjug</span>
                            </div>
                        </a>

                        <a
                            href="https://youtube.com/@holidayjug?si=rVl_T3N1wBdAUaaf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#F7941D] hover:shadow-sm transition-all group"
                        >
                            <span className="w-9 h-9 rounded-lg bg-[#071746] text-white group-hover:bg-[#F7941D] flex items-center justify-center text-sm transition-colors">
                                <FaYoutube />
                            </span>
                            <div>
                                <span className="text-xs font-bold text-[#071746] block">YouTube</span>
                                <span className="text-[11px] text-slate-500">@holidayjug</span>
                            </div>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
