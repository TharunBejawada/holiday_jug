import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { HiMail } from "react-icons/hi";

export const metadata: Metadata = {
    title: "Complaints Procedure — HolidayJug",
    description:
        "Learn about HolidayJug's Complaints Procedure. Information on how to report issues during and after your holiday, supplier responsibilities, and contact details.",
};

export default function ComplaintsProcedurePage() {
    return (
        <LegalPageLayout
            title="COMPLAINTS PROCEDURE"
            subtitle="We’re Here to Help"
        >
            <div className="space-y-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#071746]  border-b border-slate-200 pb-3">
                    COMPLAINTS PROCEDURE
                </h2>

                {/* INTRODUCTORY PARAGRAPHS */}
                <div className="space-y-4">
                    <p>
                        At Holiday Jug, we aim to provide you with a smooth and enjoyable
                        booking experience and work with our travel suppliers to help ensure
                        that your travel arrangements are delivered as expected.
                    </p>
                    <p>
                        If something goes wrong during your holiday, it is important that you
                        give the relevant travel supplier the opportunity to resolve the
                        issue as soon as possible.
                    </p>
                </div>

                {/* SECTION 1 */}
                <section className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        1. Complaints During Your Holiday
                    </h3>
                    <p>
                        If you experience a problem or have a complaint while you are
                        travelling, you should contact the relevant Supplier immediately.
                    </p>
                    <p>
                        Depending on the nature of your travel arrangements, this may
                        include your hotel, airline, transfer provider, tour operator or
                        another supplier responsible for providing the relevant service.
                    </p>
                    <p>
                        Please explain the problem to the Supplier as soon as it arises and
                        give them a reasonable opportunity to investigate and put things
                        right.
                    </p>
                    <p>
                        It is important that you follow this procedure while you are still
                        on holiday. If you do not report a problem to the relevant Supplier
                        at the time, there may be less opportunity for them to investigate
                        the circumstances and take appropriate action to resolve the issue.
                    </p>
                    <p className="font-medium text-slate-900">
                        Failure to report a problem promptly may also affect any
                        compensation or other remedy to which you may otherwise be entitled.
                    </p>
                </section>

                {/* SECTION 2 */}
                <section className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        2. Complaints After Your Holiday
                    </h3>
                    <p>
                        If you remain dissatisfied after your return home and wish to make a
                        complaint, Holiday Jug can assist by forwarding your complaint to
                        the relevant Supplier.
                    </p>

                    <div className="my-4 rounded-xl bg-amber-50/80 border-l-4 border-[#F7941D] p-5 shadow-xs space-y-3">
                        <h4 className="text-sm font-bold text-[#071746] tracking-wider uppercase flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F7941D]" />
                            Submission Window: Within 28 Days
                        </h4>
                        <p className="text-slate-800 text-sm sm:text-[15px] leading-relaxed">
                            Your complaint should be submitted to us within{" "}
                            <strong>28 days</strong> of your return home by emailing{" "}
                            <a
                                href="mailto:support@holidayjug.com"
                                className="text-[#071746] font-bold underline hover:text-[#F7941D] transition-colors"
                            >
                                support@holidayjug.com
                            </a>
                            .
                        </p>
                    </div>

                    <p className="font-semibold text-slate-900">
                        Please provide the following information in your email:
                    </p>
                    <ul className="list-none space-y-2.5 pl-2 sm:pl-4">
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-0.5">•</span>
                            <span>Your original booking reference number;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-0.5">•</span>
                            <span>Your full name and contact details;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-0.5">•</span>
                            <span>Details of the travel arrangements concerned;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-0.5">•</span>
                            <span>A clear description of the issue or complaint;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-0.5">•</span>
                            <span>
                                Details of any steps you took to resolve the matter while on
                                holiday;
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-0.5">•</span>
                            <span>
                                Details of any response or resolution offered by the Supplier;
                                and
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-0.5">•</span>
                            <span>
                                Any other relevant information or supporting documentation.
                            </span>
                        </li>
                    </ul>
                    <p className="text-xs text-slate-600 italic">
                        Providing complete and accurate information will help us forward your
                        complaint to the relevant Supplier and assist with handling your
                        concerns.
                    </p>
                </section>

                {/* SECTION 3 */}
                <section className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        3. Supplier Responsibility
                    </h3>
                    <p>
                        Where Holiday Jug acts as an agent, your contract for the relevant
                        Travel Arrangements is with the Supplier.
                    </p>
                    <p>
                        Accordingly, complaints relating to the actual provision of the
                        Travel Arrangements should normally be addressed to the relevant
                        Supplier in the first instance. Where appropriate, Holiday Jug will
                        liaise with the Supplier and forward your complaint on your behalf.
                    </p>
                </section>

                {/* SECTION 4 */}
                <section className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        4. Complaints Received After 28 Days
                    </h3>
                    <p>
                        Complaints submitted to Holiday Jug more than 28 days after your
                        return home will not be accepted under this complaints procedure.
                    </p>
                    <p>
                        We therefore strongly recommend that you raise any concerns with the
                        relevant Supplier during your holiday and, if the matter remains
                        unresolved, submit your written complaint to us promptly after
                        returning home.
                    </p>
                </section>

                {/* SECTION 5 */}
                <section className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        5. Alternative Dispute Resolution
                    </h3>
                    <p>
                        Please note that Holiday Jug does not currently offer an Alternative
                        Dispute Resolution (ADR) service.
                    </p>
                </section>

                {/* SECTION 6 */}
                <section className="space-y-4 pt-2">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        6. Contact Us
                    </h3>
                    <p>
                        For complaints following your holiday, please email us with your
                        booking reference number together with all relevant information.
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#071746] text-[#F7941D] flex items-center justify-center text-xl shrink-0">
                            <HiMail />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                Customer Complaints Email
                            </p>
                            <a
                                href="mailto:support@holidayjug.com"
                                className="text-base sm:text-lg font-bold text-[#071746] hover:text-[#F7941D] transition-colors"
                            >
                                support@holidayjug.com
                            </a>
                            <p className="text-xs text-slate-600 mt-1">
                                We will forward your complaint to the relevant Supplier where
                                appropriate and assist with communication between you and the
                                Supplier.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </LegalPageLayout>
    );
}
