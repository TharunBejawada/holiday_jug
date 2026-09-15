import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
    title: "Privacy Policy — HolidayJug",
    description:
        "Read the Privacy Notice for HolidayJug. Learn how we collect, use, protect, and handle your personal data when using our services.",
};

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout
            title="PRIVACY POLICY"
            subtitle="Our commitment to a safe, transparent and trusted travel experience."
        >
            <div className="space-y-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#071746] tracking-tight border-b border-slate-200 pb-3">
                    HOLIDAY JUG PRIVACY NOTICE
                </h2>

                {/* SECTION 1 */}
                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        1. Introduction
                    </h3>
                    <p>Welcome to the Holiday Jug Privacy Notice.</p>
                    <p>
                        Holiday Jug respects your privacy and is committed to safeguarding
                        your personal data. This Privacy Notice explains how we collect, use,
                        disclose, transfer, retain and protect your personal information
                        when you visit our website or otherwise provide personal data to us,
                        including through telephone calls, emails, online forms, account
                        registration, booking enquiries, competitions, surveys or any other
                        interaction with us.
                    </p>
                    <p>
                        This Privacy Notice also explains the privacy rights available to you
                        and how those rights are protected under applicable law.
                    </p>
                    <p>
                        Please read this Privacy Notice alongside any other privacy notice or
                        fair-processing notice that we may provide when collecting or
                        processing your personal data. This Privacy Notice supplements those
                        notices and does not replace or override them.
                    </p>
                    <p>
                        Our website is not intended for children. We will only collect
                        personal information relating to children where it is necessary for a
                        travel booking, such as when children are included within your
                        travelling party.
                    </p>
                </section>

                {/* SECTION 2 */}
                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        2. Important Information and Who We Are
                    </h3>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Controller</h4>
                        <p>
                            Holiday Jug is the controller responsible for your personal data.
                            Throughout this Privacy Notice, references to “Holiday Jug”,
                            “we”, “us” or “our” refer to Holiday Jug.
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4 space-y-3">
                        <h4 className="font-bold text-[#071746] text-sm sm:text-base">
                            Contact Details &amp; Data Protection Manager
                        </h4>
                        <p className="text-sm text-slate-700">
                            If you have any questions about this Privacy Notice or would like
                            to exercise any of your legal rights, please contact the Holiday Jug
                            Data Protection Manager using the contact details provided by
                            Holiday Jug.
                        </p>
                        <p className="text-xs text-slate-600 italic">
                            You also have the right to submit a complaint at any time to the
                            Information Commissioner’s Office (ICO), the UK supervisory
                            authority for data protection matters (www.ico.org.uk). We would,
                            however, appreciate the opportunity to address your concerns first.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">
                            Changes to This Privacy Notice
                        </h4>
                        <p>
                            This Privacy Notice may be updated from time to time. It is
                            important that the personal information we hold about you remains
                            accurate and current. Please inform us if any of your personal
                            details change during your relationship with us.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Third-Party Links</h4>
                        <p>
                            Our website may contain links to third-party websites, plug-ins or
                            applications. Selecting these links may allow third parties to
                            collect or share information about you. We do not control these
                            third-party websites and are not responsible for their privacy
                            notices or practices.
                        </p>
                    </div>
                </section>

                {/* SECTION 3 */}
                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        3. The Data We Collect About You
                    </h3>
                    <p>
                        Personal data means information relating to an individual from which
                        that individual can be identified. We may collect, use, store and
                        transfer different categories of personal data about you:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-[#071746] text-sm mb-1">Identity Data</h4>
                            <p className="text-xs text-slate-700">
                                First name, surname, maiden name, username, title, date of birth, gender.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-[#071746] text-sm mb-1">Contact Data</h4>
                            <p className="text-xs text-slate-700">
                                Billing address, delivery address, email address, telephone numbers.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-[#071746] text-sm mb-1">Financial &amp; Transaction Data</h4>
                            <p className="text-xs text-slate-700">
                                Bank account details, payment card info, details of travel arrangements purchased.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-[#071746] text-sm mb-1">Booking &amp; Travel Data</h4>
                            <p className="text-xs text-slate-700">
                                Passenger details, travel dates, passport/ID details required by travel Suppliers.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">
                            Special Categories of Personal Data
                        </h4>
                        <p>
                            Where necessary to arrange or provide travel services, we may
                            collect certain special categories of personal data (e.g. dietary
                            requirements, health/mobility needs, or medical conditions). We
                            will only collect and process special-category data where we have
                            an appropriate lawful basis or your explicit consent.
                        </p>
                    </div>
                </section>

                {/* SECTION 4 */}
                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        4. How Your Personal Data Is Collected
                    </h3>
                    <ul className="list-none space-y-3 pl-2">
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">•</span>
                            <span>
                                <strong className="text-slate-900">Direct Interactions:</strong>{" "}
                                When you make or enquire about a booking, create an account,
                                subscribe to newsletters, or contact support.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">•</span>
                            <span>
                                <strong className="text-slate-900">Automated Technologies:</strong>{" "}
                                Cookies, server logs, pixels, and tracking technologies as you
                                browse our website.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">•</span>
                            <span>
                                <strong className="text-slate-900">Third Parties:</strong> Analytics
                                providers, advertising networks, payment providers, and travel
                                Suppliers.
                            </span>
                        </li>
                    </ul>
                </section>

                {/* SECTION 5 */}
                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        5. How We Use Your Personal Data
                    </h3>
                    <p>
                        We will only process and use your personal data where permitted by
                        law (e.g. to perform a contract, fulfill bookings, comply with legal
                        obligations, or serve legitimate interests).
                    </p>

                    <div className="bg-amber-50/80 border-l-4 border-[#F7941D] p-5 rounded-r-xl my-4 space-y-2">
                        <h4 className="font-bold text-[#071746] text-sm uppercase">
                            Advertising Attribution &amp; Marketing Opt-Out
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-800">
                            You can ask us to stop sending marketing communications at any time
                            by selecting the unsubscribe link in emails or contacting us.
                        </p>
                    </div>
                </section>

                {/* SECTION 6 TO 11 */}
                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        6–8. Disclosures, International Transfers &amp; Data Security
                    </h3>
                    <p>
                        We may disclose your data to travel Suppliers, payment processors,
                        IT hosts, and regulatory bodies where required. Whenever personal
                        data is transferred outside the UK, appropriate safeguards (such as
                        UK International Data Transfer Agreements) are implemented.
                    </p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        9. Data Retention
                    </h3>
                    <p>
                        We retain booking information for six years from your return date of
                        travel for adults (or six years after reaching age 18 for children)
                        for tax, accounting, legal and regulatory requirements.
                    </p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        10. Your Legal Rights
                    </h3>
                    <p>
                        You have rights under data protection laws to request access,
                        correction, erasure, restriction, transfer, or to object to
                        processing or withdraw consent.
                    </p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        11. Glossary
                    </h3>
                    <p>
                        Definitions of legal bases (Consent, Explicit Consent, Legitimate
                        Interests, Performance of Contract, Legal/Regulatory Obligation) and
                        external Third Parties.
                    </p>
                </section>
            </div>
        </LegalPageLayout>
    );
}
