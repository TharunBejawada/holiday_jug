import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
    title: "Booking Conditions — HolidayJug",
    description:
        "Read the Booking Conditions for HolidayJug. Terms governing your relationship with us, supplier terms, payment terms, ATOL protection, and cancellation policies.",
};

export default function BookingConditionsPage() {
    return (
        <LegalPageLayout
            title="BOOKING CONDITIONS"
            subtitle="Our commitment to a safe, transparent and trusted travel experience."
        >
            <div className="space-y-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#071746] tracking-tight border-b border-slate-200 pb-3">
                    BOOKING CONDITIONS
                </h2>

                {/* INTRODUCTORY PARAGRAPHS */}
                <div className="space-y-4">
                    <p>
                        These Booking Conditions (“Booking Conditions”) set out the terms
                        governing your relationship with Holiday Jug in connection with any
                        booking made through us. Please read these conditions carefully, as
                        they explain our respective rights, responsibilities and
                        obligations.
                    </p>
                    <p>
                        In these Booking Conditions, references to “you” and “your” mean
                        every person included on the booking, including anyone added or
                        substituted after the original booking, or any individual among
                        them. References to “we”, “us” and “our” mean Holiday Jug.
                    </p>

                    <div className="my-6 rounded-xl bg-amber-50/80 border-l-4 border-[#F7941D] p-5 shadow-xs space-y-2">
                        <h3 className="text-sm font-bold text-[#071746] tracking-wider uppercase flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F7941D]" />
                            Please Note:
                        </h3>
                        <p className="text-slate-800 text-sm sm:text-[15px] font-medium leading-relaxed">
                            We act as an agent for the travel arrangements we book or arrange
                            on your behalf.
                        </p>
                    </div>

                    <p>
                        The term “Travel Arrangement(s)” refers to accommodation, flights,
                        transportation, activities, excursions and any other travel-related
                        services that we feature or arrange through our website.
                    </p>
                    <p>
                        A “Supplier” means the independent third-party provider responsible
                        for supplying the relevant Travel Arrangements. This may include
                        hotels and other accommodation providers, transfer companies, car
                        rental companies, airlines, tour operators, attractions and similar
                        service providers.
                    </p>
                    <p>
                        Where these Booking Conditions, our website or our marketing
                        materials refer to “Third-Party Packages”, this means packages
                        organised by third-party Suppliers for whom we act as an agent.
                    </p>
                    <p>
                        Where you book a flight-inclusive Third-Party Package through us,
                        the package will be protected under the ATOL protection provided by
                        the Supplier responsible for organising that package.
                    </p>
                </div>

                {/* SECTION 1 */}
                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        1. Your Contract
                    </h3>
                    <p>
                        When you make a booking through us, we will arrange for you to enter
                        into a contract with the relevant Supplier of the Travel
                        Arrangements, as identified on your booking confirmation or
                        confirmation invoice.
                    </p>
                    <p>
                        Your booking is subject both to these Booking Conditions and to the
                        specific terms and conditions of the Supplier with whom you
                        contract. You should carefully read both sets of terms before
                        completing your booking.
                    </p>
                    <p>
                        The Supplier’s own terms may contain limitations or exclusions
                        concerning its liability to you. If you do not have a copy of those
                        terms, you may request one from us.
                    </p>
                    <p>
                        A contract for an individual travel component is formed only when
                        that component has been confirmed by the relevant Supplier. At that
                        point, a contract exists between you and that Supplier. Further
                        information is provided in Clause 2.
                    </p>
                    <p>
                        As an agent, we are not responsible for any acts or omissions of a
                        Supplier or for the Travel Arrangements supplied by that Supplier.
                        We will only accept responsibility for Travel Arrangements where we
                        are acting as the Package Organiser.
                    </p>
                </section>

                {/* SECTION 2 */}
                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        2. Booking Details
                    </h3>
                    <p>
                        When a booking is made, the first person named on the booking,
                        referred to as the “lead passenger”, confirms that they:
                    </p>
                    <div className="space-y-2.5 pl-2 sm:pl-4">
                        <p>
                            <strong className="text-slate-900 font-semibold">a)</strong> Have
                            read these Booking Conditions together with the applicable
                            Supplier’s terms and conditions and have the authority to accept,
                            and do accept, those terms on behalf of everyone included in the
                            booking.
                        </p>
                        <p>
                            <strong className="text-slate-900 font-semibold">b)</strong>{" "}
                            Consent to Holiday Jug processing and using personal information
                            in accordance with our Privacy Policy and are authorised by
                            everyone named on the booking to provide their personal
                            information to us, including, where applicable, special-category
                            information such as health conditions, disabilities and dietary
                            requirements.
                        </p>
                        <p>
                            <strong className="text-slate-900 font-semibold">c)</strong> Are
                            at least 18 years old and resident in the United Kingdom and,
                            where any booked service has an age restriction, confirm that
                            they and all other members of the party meet the relevant age
                            requirements.
                        </p>
                        <p>
                            <strong className="text-slate-900 font-semibold">d)</strong>{" "}
                            Accept financial responsibility for paying the booking on behalf
                            of all persons included in the booking.
                        </p>
                    </div>
                    <p>
                        At the time you make your booking, we will provide you with the
                        booking details displayed during the booking process. Once you
                        confirm those details, we will proceed with the Supplier to secure
                        the booking.
                    </p>
                    <p>
                        If you provide us with an email address, for example so that we can
                        send you an e-ticket or other documents, you must check that email
                        account regularly. You are responsible for ensuring that the email
                        address supplied to us is accurate and contains no spelling
                        mistakes or other errors. You must also notify us if your email
                        address changes.
                    </p>
                    <p>
                        When you receive your confirmation email and any subsequent travel
                        documents, you must check all names, dates, times and other details
                        carefully and notify us immediately if anything is incorrect. Any
                        amendments to these details may result in charges as described in
                        these Booking Conditions.
                    </p>
                    <p>
                        Names supplied for the booking should exactly match those appearing
                        on the relevant passport or travel document. Because we act as a
                        booking agent, we cannot accept responsibility for errors contained
                        in documentation unless the error was caused by us.
                    </p>
                    <p>
                        Information supplied by you during the booking process will be
                        shared only with the relevant Supplier or with other parties where
                        this is necessary to provide your Travel Arrangements. Information
                        may also be disclosed to government authorities, including customs
                        or immigration authorities, where requested or where required by
                        law. This includes any special-category or sensitive information
                        you provide. By making your booking, you consent to such information
                        being provided to the relevant parties.
                    </p>
                    <p>
                        If your travel includes the United States, your information may be
                        provided to the US Customs and Border Protection authorities for
                        purposes including preventing and combating terrorism.
                    </p>
                    <p>
                        Where you travel outside the European Economic Area, applicable
                        data-protection standards may differ from those within the UK. If
                        we are unable to provide relevant information to Suppliers, we may
                        be unable to fulfil your booking.
                    </p>
                </section>

                {/* SECTION 3 */}
                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        3. Payment
                    </h3>
                    <p>
                        For certain bookings, we may charge an administration fee for the
                        services we provide. Where applicable, this charge will be explained
                        to you before or at the time of booking.
                    </p>
                    <p>
                        We do not charge a fee for payments made by debit or credit card
                        unless otherwise stated.
                    </p>
                    <p>
                        Depending on the Supplier’s requirements, you may be required to pay
                        either the full amount or an initial part-payment when the booking is
                        made. Any remaining balance must be paid by the due date specified
                        in your booking confirmation.
                    </p>
                    <p>
                        If the outstanding balance is not received by the stated due date,
                        we may notify the relevant Supplier. The Supplier may then cancel
                        your booking and apply the cancellation charges set out in its own
                        terms and conditions.
                    </p>
                    <p>
                        Unless otherwise stated by the relevant Supplier, money paid by you
                        to us for Travel Arrangements will be held on behalf of that
                        Supplier.
                    </p>
                </section>

                {/* SECTION 4 */}
                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        4. Credit Card Fraud Protection
                    </h3>
                    <p>
                        Payments made through us will be processed by our payment provider.
                        Where we have reason to suspect fraudulent activity, we reserve the
                        right to cancel or decline a transaction for security reasons.
                    </p>
                    <p>
                        To help confirm that your debit, credit or charge card is being
                        used with your authorisation, we may verify information such as your
                        name, address and other personal details provided during the booking
                        process. We may also use appropriate third-party databases for these
                        verification checks.
                    </p>
                    <p>
                        By accepting these Booking Conditions, you agree to such security
                        checks being carried out. These checks are not intended to
                        constitute a credit check and should not affect your credit rating.
                    </p>
                </section>

                {/* SECTION 5 */}
                <section className="pt-2 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        5. Low Deposit / Instalment Plan
                    </h3>
                    <p>
                        Where available, our low-deposit option may allow you to secure your
                        holiday by paying from as little as £49 per person or 50% of the
                        total flight cost, whichever amount is greater.
                    </p>
                    <p>
                        If you choose an instalment payment option, the remaining amount
                        after your initial deposit will be collected through instalments,
                        with the final payment being taken between 14 and 4 weeks before
                        departure, depending on the Travel Arrangements selected.
                    </p>
                    <p>
                        The low-deposit option does not apply to non-refundable rooms and
                        is available only on selected holidays. An administration charge of
                        £4.95 will apply to each instalment payment.
                    </p>
                    <p>
                        If you cancel your booking, the full deposit remains payable in
                        addition to any cancellation charges imposed by the relevant
                        Supplier and any applicable Holiday Jug administration charge.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4 space-y-3">
                        <h4 className="font-bold text-[#071746] text-sm sm:text-base">
                            Flexible Payment Fees
                        </h4>
                        <div className="space-y-3 text-sm text-slate-700">
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Payment Date Change — Fee: £5
                                </p>
                                <p className="text-xs text-slate-600">
                                    You may request to bring a scheduled payment date forward by up
                                    to 14 days, although the final balance payment date cannot be
                                    moved. Each individual payment date may only be changed once.
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Insufficient Funds Fee — Fee: £25
                                </p>
                                <p className="text-xs text-slate-600">
                                    Added to the total outstanding balance of your booking,
                                    together with the £4.95 administration fee where a part-payment
                                    is subsequently collected.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6 */}
                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        6. Amendments by You
                    </h3>
                    <p>
                        We will make reasonable efforts to accommodate requests to change
                        your booking, but we cannot guarantee that every requested
                        amendment will be possible. All amendment requests must be
                        submitted in writing by the person who originally made the booking.
                    </p>
                    <p>
                        Changes can only be made where permitted under the terms and
                        conditions of the relevant Supplier. We may charge the
                        administration fee specified in Clause 7, together with any
                        additional costs incurred by us in processing the requested change.
                    </p>
                    <p>
                        Please be aware that certain Travel Arrangements cannot be amended
                        once they have been confirmed. An amendment may instead require
                        cancellation of the original arrangement, which could result in
                        cancellation charges of up to 100% of the cost.
                    </p>
                </section>

                {/* SECTION 7 */}
                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        7. Cancellations by You
                    </h3>
                    <p>
                        All cancellation requests must be submitted to us in writing. A
                        cancellation will only become effective once the written request
                        has been received by us.
                    </p>
                    <p>
                        If you cancel your booking, the Supplier may apply cancellation
                        charges in accordance with its terms and conditions. These charges
                        may be as much as 100% of the cost of the Travel Arrangements.
                    </p>
                    <p>
                        If the deposit already paid does not cover the cancellation charges
                        imposed by the Supplier, you will be required to pay the difference.
                        If one or more members of your party cancels, the price payable by
                        the remaining travellers may increase on a per-person basis.
                    </p>
                </section>

                {/* SECTION 8: ADMINISTRATION FEES TABLE */}
                <section className="pt-2 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        8. Our Administration Fees
                    </h3>
                    <p>
                        In certain situations, Holiday Jug may charge an administration fee
                        for the agency services we provide. These charges apply in addition
                        to any fees imposed by the relevant Supplier.
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs my-4">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-[#071746] text-white">
                                    <th className="py-3 px-4 font-semibold w-1/3">Service / Request</th>
                                    <th className="py-3 px-4 font-semibold w-2/3">Applicable Charge</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                <tr className="bg-white">
                                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                                        Flight Extras Requested After Booking
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-700">
                                        Supplier’s charge + £30 per person amendment fee
                                    </td>
                                </tr>
                                <tr className="bg-slate-50/60">
                                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                                        Change of Hotel
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-700">
                                        Cancellation cost of original hotel + replacement hotel cost + £30 per person fee
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                                        Change of Date
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-700">
                                        Cancellation cost of original holiday + replacement holiday cost + £30 per person fee
                                    </td>
                                </tr>
                                <tr className="bg-slate-50/60">
                                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                                        Change of Title, Initial, Name
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-700">
                                        Supplier’s applicable charge + £30 per person fee
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                                        Adding or Removing Passengers
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-700">
                                        Supplier’s applicable charge + £30 per person fee
                                    </td>
                                </tr>
                                <tr className="bg-slate-50/60">
                                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                                        Cancellation Within 28 Days
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-700">
                                        Supplier’s applicable cancellation charge + £150 cancellation fee
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                                        Cancellation More Than 28 Days Before Departure
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-700">
                                        Supplier’s applicable charge + £50 per person (max £150 fee)
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SECTIONS 9 TO 15 */}
                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        9. Changes and Cancellations by the Supplier
                    </h3>
                    <p>
                        There may be circumstances where the Supplier needs to make a
                        significant alteration to your confirmed booking. If this happens,
                        we will notify you as soon as reasonably possible.
                    </p>
                </section>

                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        10. Your Financial Protection
                    </h3>
                    <p>
                        Some flights and flight-inclusive holidays advertised through us may
                        be financially protected under the ATOL scheme. Where your booking is
                        ATOL protected, you will receive an ATOL Certificate.
                    </p>
                </section>

                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        11. Where We Are the Package Organiser
                    </h3>
                    <p>
                        Depending on the Travel Arrangements you purchase, your
                        arrangements may qualify as a package holiday under the Package
                        Travel and Linked Travel Arrangements Regulations 2018.
                    </p>
                </section>

                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        12. Insurance
                    </h3>
                    <p>
                        You are strongly advised to obtain suitable travel insurance for
                        yourself and all members of your party, including cancellation,
                        medical and repatriation cover.
                    </p>
                </section>

                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        13. Health Advice
                    </h3>
                    <p>
                        You should contact your GP or medical professional early before
                        travelling to obtain current health advice relevant to your
                        destination.
                    </p>
                </section>

                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        14. Passports and Visas
                    </h3>
                    <p>
                        Passport and visa information is generally intended for British
                        citizens. You are responsible for confirming all requirements. For
                        EU travel, British passports must be under 10 years old with at
                        least 3 months’ validity remaining.
                    </p>
                </section>

                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        15. Local Taxes and In-Resort Fees
                    </h3>
                    <p>
                        Some destinations impose local charges (city/tourist taxes) payable
                        locally upon arrival or departure.
                    </p>
                </section>

                {/* SECTIONS 16 TO 24 */}
                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        16–23. Delivery, Eligibility &amp; Delays
                    </h3>
                    <p>
                        Documents are provided electronically via email. Bookings are
                        accepted from UK residents aged 18+. Any complaints should be raised
                        locally with the Supplier immediately and submitted in writing
                        within 28 days of return.
                    </p>
                </section>

                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        24. Force Majeure
                    </h3>
                    <p>
                        Neither Holiday Jug nor Suppliers will be liable for compensation
                        where affected by unavoidable and extraordinary circumstances beyond
                        reasonable control (such as war, terrorism, epidemics, natural
                        disasters, severe weather or government restrictions).
                    </p>
                </section>

                {/* SECTIONS 25 TO 40 */}
                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        25–39. General Conditions &amp; Entry Requirements
                    </h3>
                    <p>
                        You are responsible for compliance with resort behaviour rules,
                        local safety standards, entry requirements (health testing/visas), and
                        room checkout times (normally 11:00 AM).
                    </p>
                </section>

                <section className="pt-2 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-100 pb-2">
                        40. Price Match Promise
                    </h3>
                    <p>
                        If you find an identical holiday on an ATOL-protected website at a
                        lower price with the same Suppliers, Holiday Jug may match that price
                        subject to eligibility terms.
                    </p>
                </section>
            </div>
        </LegalPageLayout>
    );
}
