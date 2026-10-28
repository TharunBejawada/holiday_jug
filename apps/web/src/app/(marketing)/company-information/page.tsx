import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { FaBuilding, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const metadata: Metadata = {
    title: "Company Information — HolidayJug",
    description:
        "Official company information and registered office details for HolidayJug. UK and India contact numbers, registered address, and company legal information.",
};

export default function CompanyInformationPage() {
    return (
        <LegalPageLayout
            title="COMPANY INFORMATION"
            subtitle="Official corporate registration details and global office locations."
        >
            <div className="space-y-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#071746] border-b border-slate-200 pb-3">
                    HOLIDAYJUG COMPANY DETAILS
                </h2>

                <p className="text-slate-700 leading-relaxed font-normal">
                    HolidayJug is a premier travel partner dedicated to crafting unforgettable holiday experiences and quality accommodation bookings. Below is our registered company information and contact details.
                </p>

                {/* REGISTERED OFFICE CARD */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#071746] text-[#F7941D] flex items-center justify-center text-lg">
                            <FaBuilding />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#071746]">
                                Registered Office
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">United Kingdom</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Registered Address
                            </h4>
                            <div className="flex items-start gap-2.5 text-slate-800 text-sm font-semibold leading-relaxed">
                                <FaMapMarkerAlt className="text-[#F7941D] text-base shrink-0 mt-0.5" />
                                <div>
                                    128 City Road,<br />
                                    London, United Kingdom,<br />
                                    EC1V 2NX
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Primary Email
                            </h4>
                            <div className="flex items-center gap-2.5 text-slate-800 text-sm font-semibold">
                                <FaEnvelope className="text-[#F7941D] text-base shrink-0" />
                                <a href="mailto:support@holidayjug.com" className="hover:text-[#F7941D] transition-colors">
                                    support@holidayjug.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* UK & INDIA CONTACT NUMBERS TABLE */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] border-b border-slate-100 pb-2">
                        Customer &amp; Sales Contact Numbers
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* UK BOX */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <FaGlobe className="text-[#F7941D]" />
                                <h4 className="font-bold text-[#071746]">United Kingdom</h4>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                        Sales Line
                                    </span>
                                    <a href="tel:+443301658879" className="text-base sm:text-lg font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5">
                                        <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                        +44 330 165 8879
                                    </a>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Sales Line (UK domestic): <strong className="font-semibold text-slate-800">0330 165 8879</strong>
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-slate-100">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                        Support Line
                                    </span>
                                    <a href="tel:+443300249639" className="text-base sm:text-lg font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5">
                                        <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                        +44 330 024 9639
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* INDIA BOX */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <FaGlobe className="text-[#F7941D]" />
                                <h4 className="font-bold text-[#071746]">India</h4>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                        Sales Line
                                    </span>
                                    <a href="tel:+917699512345" className="text-base sm:text-lg font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5">
                                        <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                        +91 76995 12345
                                    </a>
                                </div>

                                <div className="pt-2 border-t border-slate-100">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                        Support Line
                                    </span>
                                    <a href="tel:+918977396433" className="text-base sm:text-lg font-bold text-[#071746] hover:text-[#F7941D] transition-colors flex items-center gap-2 mt-0.5">
                                        <FaPhoneAlt className="text-xs text-[#F7941D]" />
                                        +91 89773 96433
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* OFFICIAL SOCIAL MEDIA CHANNELS */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
                    <h3 className="text-lg font-bold text-[#071746]">
                        Official Social Media Channels
                    </h3>
                    <p className="text-sm text-slate-600 font-normal">
                        Follow and connect with HolidayJug across our verified social profiles:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <a
                            href="https://www.facebook.com/HOLIDAYJUG/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#F7941D] hover:shadow-sm transition-all group"
                        >
                            <span className="w-9 h-9 rounded-lg bg-[#071746] text-white group-hover:bg-[#F7941D] flex items-center justify-center text-sm transition-colors">
                                <FaFacebookF />
                            </span>
                            <div>
                                <span className="text-xs font-bold text-[#071746] block">Facebook</span>
                                <span className="text-[11px] text-slate-500">@HOLIDAYJUG</span>
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
