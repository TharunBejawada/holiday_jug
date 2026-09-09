"use client";

import Link from "next/link";
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaTwitter,
    FaWhatsapp,
} from "react-icons/fa";

export function Footer() {
    return (
        <footer className="bg-[#071746] text-white mt-8 font-medium">
            {/* MAIN FOOTER CONTENT */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
                    {/* COLUMN 1: BRAND LOGO & SOCIAL */}
                    <div className="flex flex-col space-y-4">
                        <Link href="/" className="inline-block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/assets/Holiday_Jug_Footer.png"
                                alt="HolidayJug"
                                className="h-12 sm:h-14 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal max-w-xs">
                            our trusted travel partner for unforgettable holidays and comfortable stays.
                        </p>

                        {/* SOCIAL ICONS */}
                        <div className="flex items-center gap-2.5 pt-2">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F7941D] text-white flex items-center justify-center text-sm transition-all duration-300"
                            >
                                <FaFacebookF />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F7941D] text-white flex items-center justify-center text-sm transition-all duration-300"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F7941D] text-white flex items-center justify-center text-sm transition-all duration-300"
                            >
                                <FaYoutube />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter / X"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F7941D] text-white flex items-center justify-center text-sm transition-all duration-300"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href="https://whatsapp.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F7941D] text-white flex items-center justify-center text-sm transition-all duration-300"
                            >
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    {/* COLUMN 2: HOLIDAYS */}
                    <div>
                        <h4 className="text-sm sm:text-base font-semibold text-[#F7941D] uppercase tracking-wider mb-4">
                            HOLIDAYS
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm font-normal text-white/90">
                            <li>
                                <Link href="/holidays?type=beach" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Beach Holidays
                                </Link>
                            </li>
                            <li>
                                <Link href="/holidays?type=all-inclusive" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> All-Inclusive Holidays
                                </Link>
                            </li>
                            <li>
                                <Link href="/holidays?type=family" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Family Holidays
                                </Link>
                            </li>
                            <li>
                                <Link href="/holidays?type=couple" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Couple Getaways
                                </Link>
                            </li>
                            <li>
                                <Link href="/holidays?type=luxury" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Luxury Holidays
                                </Link>
                            </li>
                            <li>
                                <Link href="/holidays?type=honeymoon" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Honeymoon Holidays
                                </Link>
                            </li>
                            <li>
                                <Link href="/deals/last-minute" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Last-Minute Holidays
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 3: HOTELS */}
                    <div>
                        <h4 className="text-sm sm:text-base font-semibold text-[#F7941D] uppercase tracking-wider mb-4">
                            HOTELS
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm font-normal text-white/90">
                            <li>
                                <Link href="/hotels?type=beachfront" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Beach Hotels &amp; Resorts
                                </Link>
                            </li>
                            <li>
                                <Link href="/hotels?type=all-inclusive" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> All-Inclusive Hotels
                                </Link>
                            </li>
                            <li>
                                <Link href="/hotels?rating=5" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Luxury Hotels
                                </Link>
                            </li>
                            <li>
                                <Link href="/hotels?type=family" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Family Hotels
                                </Link>
                            </li>
                            <li>
                                <Link href="/hotels?deals=true" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Hotel Deals
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 4: COMPANY */}
                    <div>
                        <h4 className="text-sm sm:text-base font-semibold text-[#F7941D] uppercase tracking-wider mb-4">
                            COMPANY
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm font-normal text-white/90">
                            <li>
                                <Link href="/about" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/why-book-with-us" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Why Book With Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Travel Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Terms &amp; Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookie-policy" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookie-consent" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Cookie Consent
                                </Link>
                            </li>
                            <li>
                                <Link href="/booking-conditions" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Booking Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/complaints-procedure" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Complaints Procedure
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Contact Information
                                </Link>
                            </li>
                            <li>
                                <Link href="/company-information" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                                    <span className="text-[#F7941D]">•</span> Company Information
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 5: NEED HELP? */}
                    <div>
                        <h4 className="text-sm sm:text-base font-semibold text-[#F7941D] uppercase tracking-wider mb-4">
                            NEED HELP?
                        </h4>
                        <a
                            href="tel:020XXXXXXXX"
                            className="text-sm sm:text-base font-semibold text-white hover:text-[#F7941D] transition-colors block"
                        >
                            020 XXXXXXXX
                        </a>
                    </div>
                </div>
            </div>

            {/* COPYRIGHT BAR */}
            <div className="border-t border-white/10 py-6 text-center text-xs sm:text-sm font-normal text-white">
                <p>© 2026 Holiday Jug. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
