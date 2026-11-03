import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
    FaBuilding,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaGlobe,
    FaClock,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const metadata: Metadata = {
    title: "Company Information — HolidayJug LTD",
    description:
        "Official company registration and corporate details for HolidayJug LTD. Company number 17492828, registered office address in London, UK helpline, and support emails.",
};

export default function CompanyInformationPage() {
    return (
        <LegalPageLayout
            title="COMPANY INFORMATION"
            subtitle="Official corporate registration details, registered UK office, and contact channels."
        >
            <div className="space-y-8">
                {/* 1. REGISTERED COMPANY DETAILS CARD */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#071746] text-[#F7941D] flex items-center justify-center text-xl shadow-xs">
                            <FaBuilding />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-[#071746] tracking-tight">
                                HolidayJug LTD.
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
                                Company number 17492828
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* REGISTERED OFFICE ADDRESS */}
                        <div className="space-y-2 p-4 bg-white rounded-xl border border-slate-200/80">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Registered office address
                            </h3>
                            <div className="flex items-start gap-2.5 text-slate-800 text-sm font-semibold leading-relaxed">
                                <FaMapMarkerAlt className="text-[#F7941D] text-base shrink-0 mt-0.5" />
                                <div>
                                    HolidayJug LTD.<br />
                                    128 City Road,<br />
                                    London, United Kingdom,<br />
                                    EC1V 2NX
                                </div>
                            </div>
                        </div>

                        {/* EMAIL CHANNELS */}
                        <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-200/80">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Official Inquiries
                            </h3>
                            <div className="space-y-2 text-sm font-semibold text-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <FaEnvelope className="text-[#F7941D] text-sm shrink-0" />
                                    <div>
                                        <span className="text-[11px] text-slate-500 font-normal block">General Inquiries:</span>
                                        <a href="mailto:admin@holidayjug.com" className="hover:text-[#F7941D] transition-colors">
                                            admin@holidayjug.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 pt-1 border-t border-slate-100">
                                    <FaEnvelope className="text-[#F7941D] text-sm shrink-0" />
                                    <div>
                                        <span className="text-[11px] text-slate-500 font-normal block">Customer Support:</span>
                                        <a href="mailto:support@holidayjug.com" className="hover:text-[#F7941D] transition-colors">
                                            support@holidayjug.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. UK SALES & SUPPORT CONTACT NUMBERS */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] border-b border-slate-100 pb-2">
                        UK Customer &amp; Sales Helpline
                    </h3>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <FaGlobe className="text-[#F7941D]" />
                            <h4 className="font-bold text-[#071746]">United Kingdom</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                    Sales Line
                                </span>
                                <a
                                    href="tel:+443301658879"
                                    className="text-lg sm:text-xl font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-1"
                                >
                                    <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                    +44 330 165 8879
                                </a>
                                <p className="text-xs text-slate-500 mt-1">
                                    UK Freephone Toll-free: <strong className="font-semibold text-slate-800">0330 165 8879</strong>
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                    Customer Support Line
                                </span>
                                <a
                                    href="tel:+443300249639"
                                    className="text-lg sm:text-xl font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-1"
                                >
                                    <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                    +44 330 024 9639
                                </a>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                    <FaClock className="text-[#F7941D] text-xs" />
                                    <span>Operating Hours: <strong>Mon – Sun 9AM to 9PM</strong></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. OFFICIAL SOCIAL MEDIA CHANNELS */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
                    <h3 className="text-lg font-bold text-[#071746]">
                        Official Social Media Channels
                    </h3>
                    <p className="text-sm text-slate-600 font-normal">
                        Follow and connect with HolidayJug across our verified social channels:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <a
                            href="https://www.facebook.com/HolidayJugUK"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#F7941D] hover:shadow-sm transition-all group"
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
                            className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#F7941D] hover:shadow-sm transition-all group"
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
                            className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#F7941D] hover:shadow-sm transition-all group"
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
                            className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#F7941D] hover:shadow-sm transition-all group"
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
            </div>
        </LegalPageLayout>
    );
}
