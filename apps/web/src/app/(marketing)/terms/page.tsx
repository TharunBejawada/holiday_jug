import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
    title: "Website Terms of Use — HolidayJug",
    description:
        "Read the Website Terms of Use for HolidayJug. Our commitment to a safe, transparent and trusted travel experience.",
};

export default function TermsOfUsePage() {
    return (
        <LegalPageLayout
            title="TERMS OF USE"
            subtitle="Our commitment to a safe, transparent and trusted travel experience."
        >
            <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#071746]  border-b border-slate-200 pb-3 mb-6">
                    WEBSITE TERMS OF USE
                </h2>

                <p>
                    At Holiday Jug, we are committed to protecting the privacy of our
                    customers and visitors to our website, while maintaining transparency
                    in the way we operate.
                </p>

                <p>
                    Holiday Jug is owned and operated by Holiday Jug (“we”, “us” or
                    “our”). These Terms of Use apply to everyone who accesses or uses
                    this website.
                </p>

                <p>
                    In these Terms, “you” and “your” refer to any person accessing or using
                    the website. Access to and use of this website is limited to
                    individuals and companies with whom Holiday Jug has an applicable
                    commercial agreement, which sets out the commercial terms between the
                    parties and the capacity in which the website may be used. Access to
                    the website requires the use of the unique login credentials
                    provided by Holiday Jug.
                </p>

                <p>
                    All bookings made through this website are subject to the terms and
                    conditions of the relevant Supplier unless specifically stated
                    otherwise. You must read and accept the applicable Supplier terms and
                    conditions before completing a booking.
                </p>

                {/* IMPORTANT NOTE CALLOUT */}
                <div className="my-8 rounded-xl bg-amber-50/80 border-l-4 border-[#F7941D] p-5 sm:p-6 shadow-xs">
                    <h3 className="text-base sm:text-lg font-bold text-[#071746] tracking-wider uppercase mb-3 flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F7941D]" />
                        IMPORTANT NOTE
                    </h3>
                    <div className="space-y-3 text-slate-800 text-sm sm:text-[15px] font-medium leading-relaxed">
                        <p>
                            Holiday Jug acts only as an agent in relation to bookings made
                            through this website and accepts no liability in connection with
                            any contract entered into or booking made, whether made for
                            yourself or for another consumer, or for any acts or omissions of
                            Suppliers or other parties connected with such bookings.
                        </p>
                        <p>
                            For all bookings, the contractual relationship will be between
                            you and the relevant Supplier and not Holiday Jug.
                        </p>
                    </div>
                </div>

                {/* SECTION 1 */}
                <section className="pt-4 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        1. General
                    </h3>
                    <p>
                        <strong className="text-slate-900 font-semibold">1.1</strong> Your
                        access to and use of any information available on this website is
                        subject to your acceptance of and compliance with these Website
                        Terms of Use (“Terms”), our Privacy Policy and any separate
                        commercial agreement between you and Holiday Jug. Please ensure that
                        you read these documents carefully. If you do not agree to any part
                        of them, you must not access or use this website. Any failure to
                        comply with these Terms, our Privacy Policy or applicable
                        commercial agreements may result in your permission to access and
                        use the website being withdrawn, without affecting any other rights
                        or remedies available to us.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">1.2</strong> We may
                        revise or update these Terms from time to time. Any revised version
                        will apply to your subsequent use of the website. You are
                        responsible for checking these Terms regularly to ensure that you are
                        aware of any changes.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">1.3</strong> We
                        reserve the right, at any time and without prior notice, to add,
                        change, amend, edit, remove or otherwise modify any information,
                        content, materials or data displayed on this website.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">1.4</strong>{" "}
                        Although we aim to keep our website available without interruption,
                        we do not guarantee that access will always be continuous, timely,
                        secure or free from errors. We reserve the right to suspend, limit,
                        restrict or terminate access to the website at any time.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">1.5</strong> When
                        you visit our website or communicate with us by email, you are
                        communicating electronically. We may also communicate with you
                        electronically, including by email. You agree that all notices,
                        agreements, disclosures and other communications provided
                        electronically satisfy any legal requirement that such
                        communications be made in writing.
                    </p>
                </section>

                {/* SECTION 2 */}
                <section className="pt-4 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        2. Our Services
                    </h3>
                    <p>
                        <strong className="text-slate-900 font-semibold">2.1</strong> Holiday
                        Jug acts solely as an agent in relation to the arrangements displayed
                        or offered through this website. We accept no liability concerning
                        contracts entered into, bookings made, or any acts or omissions of
                        Suppliers or other individuals or organisations connected with those
                        arrangements. For all bookings, your contract will be with the
                        relevant Supplier providing the Travel Arrangements.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">2.2</strong> Nothing
                        displayed on this website should be interpreted as an offer by
                        Holiday Jug to sell any Travel Arrangements to you or as an offer
                        to enter into a contract with you in relation to those
                        arrangements. All Travel Arrangements displayed or referred to on
                        the website remain subject to availability until they have been
                        confirmed. We do not provide any guarantee, warranty, promise or
                        representation that a particular arrangement will remain available.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">2.3</strong> The
                        terms and conditions of the applicable Supplier will govern your
                        booking. If you need to cancel or amend a confirmed booking, you
                        must contact us by telephone. Cancellation or amendment charges
                        will generally apply. The amount of any applicable charge will
                        depend on factors including the Supplier’s terms and the amount of
                        notice provided before departure. You should review the relevant
                        Supplier’s terms and conditions carefully for full details.
                    </p>
                </section>

                {/* SECTION 3 */}
                <section className="pt-4 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        3. Permitted Use
                    </h3>
                    <p>
                        <strong className="text-slate-900 font-semibold">3.1</strong> By
                        accessing or using this website, you confirm and warrant to us
                        that:
                    </p>
                    <ul className="list-none space-y-2.5 pl-2 sm:pl-4 my-3">
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                You will not use the website, or any content or information
                                available through it, for any unlawful purpose or for any
                                purpose prohibited by these Terms.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                You have the legal authority and capacity to use the website in
                                accordance with these Terms.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                You accept financial responsibility for all charges, fees and
                                other amounts arising from your use of the website, including
                                where your login details have been used without authorisation or
                                fraudulently.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                All information you provide in connection with a booking is
                                complete, accurate and truthful.
                            </span>
                        </li>
                    </ul>
                    <p>
                        <strong className="text-slate-900 font-semibold">3.2</strong> You
                        may not reproduce any part of this website in any format without
                        obtaining our prior consent, except where reproduction is
                        temporarily necessary to use our services or to retain a record of
                        a transaction completed through our service. You must not modify,
                        copy, distribute, transmit, display, reproduce, publish, license,
                        create derivative works from, transfer, sell or otherwise use any
                        materials, information, products or services contained in or
                        presented through this website without our prior permission.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">3.3</strong> You
                        may create a link to our website only after obtaining our prior
                        written consent. Where permission is granted, the link must be
                        operated in a fair and lawful manner and must not damage, misuse or
                        take unfair advantage of our reputation. You must not create a link
                        in a manner that suggests or implies that Holiday Jug is associated
                        with, has approved or endorses your website or its content. We
                        reserve the right to require the immediate removal of any link to
                        our website. We may also withdraw any permission previously
                        granted for linking at any time.
                    </p>
                </section>

                {/* SECTION 4 */}
                <section className="pt-4 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        4. Intellectual Property Rights
                    </h3>
                    <p>
                        <strong className="text-slate-900 font-semibold">4.1</strong> All
                        content appearing on this website, including text, graphics, logos,
                        button icons, photographs, images, audio, digital downloads, data
                        compilations and software, is owned by Holiday Jug or by the relevant
                        content providers. Unless specifically stated otherwise, such
                        content is protected by copyright and other applicable intellectual
                        property rights. The material may be downloaded and viewed on a
                        single computer and/or printed as a single hard copy for permitted
                        personal use. Except with our prior written consent, the material
                        must not otherwise be reproduced, transmitted, distributed, made
                        available through a network or used to create derivative works.
                        All rights are reserved.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">4.2</strong> All
                        rights relating to the Holiday Jug website and its content are owned
                        by Holiday Jug or its relevant licensors.
                    </p>
                </section>

                {/* SECTION 5 */}
                <section className="pt-4 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        5. Our Liability
                    </h3>
                    <p>
                        <strong className="text-slate-900 font-semibold">5.1</strong> Except
                        where expressly provided in these Terms, Holiday Jug gives no
                        warranties, guarantees, promises or representations, whether
                        express or implied, concerning the accuracy, completeness or
                        reliability of information or materials displayed on this website
                        or the Travel Arrangements featured on it. We do not guarantee the
                        nature, quality, standard, suitability or availability of any
                        Travel Arrangement. To the fullest extent permitted by law, we
                        will not be liable for any loss, damage, cost, expense or other
                        claim of any kind, whether direct, indirect, consequential or
                        otherwise, arising directly or indirectly from your use of this
                        website. This includes, without limitation, losses arising from your
                        use of information or materials displayed on the website or from
                        any inability, delay or interruption in accessing or using the
                        website.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">5.2</strong> The
                        information provided on this website may occasionally contain
                        technical inaccuracies, typographical mistakes or other errors.
                        Information displayed on the website may be amended or updated from
                        time to time and may not always reflect the most current position.
                        Holiday Jug and the relevant Supplier reserve the right to change
                        details relating to Travel Arrangements displayed or referred to on
                        the website at any time and without prior notice. Where information
                        is clearly and obviously incorrect, neither Holiday Jug nor the
                        relevant Supplier will be bound by that error. We do not accept
                        responsibility for continuously updating all information appearing
                        on these pages or for any failure to do so. You are responsible for
                        confirming all details of your chosen Travel Arrangements at the time
                        of booking.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">5.3</strong> Nothing
                        in these Terms is intended to exclude or restrict our liability for
                        death or personal injury resulting from our negligence, fraudulent
                        misrepresentation or any other liability that cannot legally be
                        excluded or limited.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">5.4</strong>{" "}
                        Without limiting the provisions above, Holiday Jug shall be
                        entitled to rely on any exclusions or limitations of liability that
                        are permitted under the laws of any country determined to apply to
                        information displayed on this website or to services provided by us
                        or on our behalf.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">5.5</strong> This
                        website may contain links to websites operated by third parties.
                        Unless a linked website is operated by Holiday Jug, it is outside our
                        control and is not maintained by us. We are not responsible for the
                        content, accuracy or operation of such third-party websites. Links
                        are provided solely for your convenience, and we do not monitor or
                        endorse the content available through them. To the fullest extent
                        permitted by law, we accept no liability arising from your access to
                        or use of any third-party website, including any inability or delay
                        in accessing such website or any material or information contained
                        on it.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">5.6</strong> We do
                        not guarantee that this website, or any website linked to it, will
                        be free from technical faults, computer viruses or other harmful or
                        disruptive programs. We also do not guarantee compatibility with
                        your particular browser, device or computer configuration. You are
                        responsible for carrying out any checks you consider necessary,
                        including appropriate virus and security checks, to meet your own
                        requirements.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">5.7</strong> Holiday
                        Jug may amend, add to or remove any part of these Terms at its sole
                        discretion. We may also change, suspend or discontinue any part of
                        our website or services at any time. We may place restrictions on
                        certain features or services or limit access to some or all areas of
                        the website without prior notice or liability where we reasonably
                        consider that you have breached these Terms or applicable laws or
                        regulations, or where we decide to discontinue a service. If you
                        continue using the website after notice of any changes has been
                        published, this will constitute your acceptance of those changes.
                    </p>
                </section>

                {/* SECTION 6 */}
                <section className="pt-4 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746]  border-b border-slate-100 pb-2">
                        6. Law &amp; Jurisdiction
                    </h3>
                    <p>
                        <strong className="text-slate-900 font-semibold">6.1</strong> Holiday
                        Jug is an English registered business, and our business activities
                        are governed by the applicable laws of England and Wales. We make
                        no warranty or representation, whether express or implied, that the
                        information displayed on this website, the Travel Arrangements
                        offered, information relating to those arrangements or our business
                        complies with the laws of every other country. The laws of other
                        countries do not necessarily apply to or govern these matters.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">6.2</strong> Your
                        access to and use of this website is conditional upon your
                        agreement that all information contained on the website and all
                        matters arising between you and Holiday Jug will be governed by
                        English law. You further agree that any dispute or matter arising
                        between you and us will be subject exclusively to the jurisdiction of
                        the Courts of England and Wales, to the exclusion of courts in other
                        countries, except where applicable law provides otherwise.
                    </p>
                    <p>
                        <strong className="text-slate-900 font-semibold">6.3</strong> If any
                        exclusion, limitation or other provision contained in these Terms
                        is determined to be unlawful, invalid or unenforceable, whether
                        wholly or partly, that provision or the affected part will be
                        treated as separate and removed to the extent necessary. The
                        removal or separation of such provision will not affect the
                        validity, operation or enforceability of the remaining provisions
                        of these Terms.
                    </p>
                </section>
            </div>
        </LegalPageLayout>
    );
}
