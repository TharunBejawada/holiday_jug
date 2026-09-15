import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
    title: "Use of Cookies — HolidayJug",
    description:
        "Learn how HolidayJug uses cookies, web beacons, and similar technologies to improve your browsing experience and keep your information secure.",
};

const ourCookies = [
    {
        name: "_anonymousUserDetails",
        purpose:
            "Remembers your login session so that you can navigate between pages of the website.",
        type: "Session – expires after 20 minutes of inactivity.",
    },
    {
        name: ".ASPXAUTH",
        purpose: "Determines whether a user has been authenticated.",
        type: "At the end of the session.",
    },
    {
        name: "ASP.NET_SessionId",
        purpose:
            "Stores and retrieves information as you move around and interact with the Site.",
        type: "At the end of the session.",
    },
    {
        name: "AWSELB",
        purpose:
            "Helps ensure that visitors remain connected to the same server to which they initially connected, making caching more efficient.",
        type: "Session – expires after 20 minutes of inactivity.",
    },
    {
        name: "fbm_****************9",
        purpose: "Enables Facebook login functionality on the Site.",
        type: "Persistent – 4 hours.",
    },
    {
        name: "fbsr_****************9",
        purpose: "Enables Facebook login functionality on the Site.",
        type: "Persistent – 4 hours.",
    },
    {
        name: "P160777",
        purpose: "Establishes the logged-in status of the user.",
        type: "Persistent – 1 day.",
    },
    {
        name: "policyAgreement",
        purpose:
            "Records consent for the use of cookies during the user’s journey through the Site.",
        type: "Persistent – 6 months.",
    },
    {
        name: "rsi_segs",
        purpose:
            "Allows Audience Science to store information used to anonymously profile users and engage relevant audiences.",
        type: "Session – expires after 20 minutes of inactivity.",
    },
    {
        name: "SearchCookie",
        purpose: "Retains the search information entered by the user on the Site.",
        type: "At the end of the session.",
    },
    {
        name: "Search_Overseas",
        purpose:
            "Retains search information entered within the overseas section of the Site.",
        type: "At the end of the session.",
    },
    {
        name: "Search_AllInclusive",
        purpose:
            "Retains search information entered within the All Inclusive Holidays section of the Site.",
        type: "At the end of the session.",
    },
    {
        name: "Search_Shorts",
        purpose:
            "Retains search information entered within the City Breaks section of the Site.",
        type: "At the end of the session.",
    },
    {
        name: "showEmailPopup",
        purpose:
            "Ensures that the newsletter registration pop-up displayed between the search and results pages is shown to the user only once every six months.",
        type: "Persistent – 6 months.",
    },
    {
        name: "Silverpop.com com.silverpop.iMA.page_visit",
        purpose: "This cookie anonymously records when a page has been visited.",
        type: "At the end of the session.",
    },
    {
        name: "Silverpop.com com.silverpop.iMA.session",
        purpose:
            "This cookie anonymously groups events and page visits together according to a user session.",
        type: "Session – expires after 20 minutes of inactivity.",
    },
    {
        name: "Silverpop.com com.silverpop.iMAWebCookie",
        purpose:
            "This cookie records the user’s preference regarding acceptance of cookies.",
        type: "Session – expires after 20 minutes of inactivity.",
    },
    {
        name: "Holiday Jug Website Registration",
        purpose:
            "This user-account cookie allows registered account holders to access their personalised account area.",
        type: "Persistent – 2 years.",
    },
];

const thirdPartyCookies = [
    {
        name: "Addthis",
        purpose:
            "Addthis places cookies to provide advertisements that may be relevant to your interests or online behaviour, such as visits to particular advertisers’ websites and products.",
        type: "Persistent – up to 3 years.",
        link: "https://www.addthis.com/privacy/opt-out",
        linkText: "www.addthis.com/privacy/opt-out",
    },
    {
        name: "Admeld.com",
        purpose:
            "This Google-owned company uses cookies to deliver advertising and provide reporting on advertisements displayed on the website. The cookie also records which advertisements a user has seen and how frequently.",
        type: "Persistent – 1 year.",
        link: "https://www.admeld.com/opt-out/",
        linkText: "www.admeld.com/opt-out/",
    },
    {
        name: "Adnxs.com",
        purpose:
            "This cookie identifies web browsers and stores information for advertising purposes, including interest-based advertising. It may also store advertising delivery and reporting information, track responses to advertisements, assist with server load balancing and perform similar technical functions.",
        type: "Non-personally identifiable stored up to 12 months; aggregated stored up to 2 years.",
        link: "https://appnexus.com/en/company/platform-privacy-policy#choices",
        linkText: "appnexus.com/en/company/platform-privacy-policy#choices",
    },
    {
        name: "Audience Science",
        purpose:
            "This cookie collects, measures and segments information about users’ interests based on their online behaviour on this and other websites and provides interest-based advertising according to the relevant market segment.",
        type: "Persistent – between 2 and 5 years.",
        link: "https://www.audiencescience.com/privacy",
        linkText: "www.audiencescience.com/privacy",
    },
    {
        name: "Bluekai.com",
        purpose:
            "Bluekai uses non-personally identifiable cookies and pixel tags to collect and store preference information.",
        type: "Persistent – 6 months. Also uses a pixel GIF with a 6-month lifespan.",
        link: "https://bluekai.com/consumers.php#optout",
        linkText: "bluekai.com/consumers.php#optout",
    },
    {
        name: "Clicktale",
        purpose:
            "ClickTale uses cookies to anonymously track a user’s journey through the Site and understand behaviour on pages, including where users click.",
        type: "Persistent – 365 days.",
        link: "https://www.clicktale.net/disable.html",
        linkText: "www.clicktale.net/disable.html",
    },
    {
        name: "Doubleclick (Google) id",
        purpose:
            "This cookie is used to deliver advertising and report on advertisements displayed on the website. It also records which advertisements users have seen and how frequently.",
        type: "Persistent – 2 years.",
        link: "https://www.doubleclickbygoogle.com/",
        linkText: "www.doubleclickbygoogle.com/",
    },
    {
        name: "Facebook",
        purpose:
            "Facebook cookies allow Facebook to recognise that you are logged in, and help enable social plug-ins and sharing buttons.",
        type: "Persistent – up to 2 years.",
        link: "https://www.facebook.com/help/365596123604315",
        linkText: "www.facebook.com/help/365596123604315",
    },
    {
        name: "Flashtalking.com",
        purpose:
            "This cookie is used to display advertisements that may be relevant to your interests or online behaviour, including visits to particular advertisers’ websites and products.",
        type: "Persistent – 2 years.",
        link: "https://www.flashtalking.com",
        linkText: "www.flashtalking.com",
    },
    {
        name: "Google Analytics",
        purpose:
            "These cookies collect visitor statistics, including information about where visitors came from and which pages they viewed. This helps us understand how visitors use the Site and identify improvements.",
        type: "Persistent – 2 years.",
        link: "https://tools.google.com/dlpage/gaoptout",
        linkText: "tools.google.com/dlpage/gaoptout",
    },
    {
        name: "Invitemedia.com",
        purpose:
            "Invitemedia uses cookies together with web beacons to help make online advertising more relevant to you. Cookies and web beacons are also used to measure the effectiveness of online advertising campaigns.",
        type: "Persistent – up to 180 days.",
        link: "https://assets.invitemedia.com/opt-out.html",
        linkText: "assets.invitemedia.com/opt-out.html",
    },
    {
        name: "Mathtag.com",
        purpose:
            "MathTag.com is a domain used by MediaMath to place cookies on behalf of its customers on computers belonging to visitors to selected customer websites who may view display advertising.",
        type: "Persistent – up to 3 years.",
        link: "https://www.mediamath.com/privacy-policy/",
        linkText: "www.mediamath.com/privacy-policy/",
    },
    {
        name: "Sensic.com",
        purpose:
            "Sensic is a Google AdSense third-party vendor and uses cookies to provide advertisements that may be relevant to users’ interests or online behaviour.",
        type: "Persistent – 5 months.",
        link: "https://www.sensic.net/index2.html",
        linkText: "www.sensic.net/index2.html",
    },
    {
        name: "Smartadserver.com",
        purpose:
            "This cookie is used to display advertising and provide reporting on advertisements served through the website. It also records which advertisements users have seen and how frequently.",
        type: "Persistent – 2 years. Also uses a Pixel GIF with a lifespan of 9 years.",
        link: "https://www.smartadserver.com/privacy-policy",
        linkText: "www.smartadserver.com/privacy-policy",
    },
    {
        name: "Tubemogul.com",
        purpose:
            "TubeMogul uses cookies to collect, measure and segment information about users’ interests based on behaviour across this and other websites.",
        type: "Persistent – 10 years.",
        link: "https://www.tubemogul.com/compliance/privacy-policy/",
        linkText: "www.tubemogul.com/compliance/privacy-policy/",
    },
    {
        name: "Twitter.com",
        purpose:
            "Twitter uses cookies to better understand how users interact with its services.",
        type: "At the end of the session.",
        link: "https://twitter.com/privacy",
        linkText: "twitter.com/privacy",
    },
    {
        name: "Webtrends",
        purpose:
            "Webtrends uses cookies for various purposes, including remembering preferences and measuring activity on Webtrends websites.",
        type: "Persistent – 10 years.",
        link: "https://webtrends.com/terms-policies/cookie-policy",
        linkText: "webtrends.com/terms-policies/cookie-policy",
    },
    {
        name: "Yieldmanager.com",
        purpose:
            "Ad.yieldmanager.com uses a tracking cookie to follow activity across websites and record user behaviour.",
        type: "19/01/2038.",
        link: "https://ad.yieldmanager.com/opt-out",
        linkText: "ad.yieldmanager.com/opt-out",
    },
];

const adsenseVendors = [
    { name: "Adacado / Healthpricer Interactive", url: "https://www.adacado.com" },
    { name: "Adform", url: "https://www.adform.com" },
    { name: "ADITION", url: "https://www.adition.com" },
    { name: "AdMotion", url: "https://www.admotion.com" },
    { name: "AdSpirit", url: "https://www.adspirit.com" },
    { name: "ADTECH", url: "https://www.adtech.com" },
    { name: "Atlas", url: "https://www.atlassolutions.com" },
    { name: "Bluestreak", url: "https://www.bluestreak.com" },
    { name: "Bourne Leisure", url: "https://www.bourneleisuresales.co.uk" },
    { name: "Broadband Enterprises/Vindico", url: "https://www.bbe.com" },
    { name: "Calvin Klein", url: "https://media.calvinklein.com/optout.html" },
    { name: "Cognitive Match", url: "https://www.cognitivematch.com" },
    { name: "Cossette", url: "https://www.cossette.com" },
    { name: "DoubleClick", url: "https://www.doubleclick.com" },
    { name: "ebookers SA", url: "https://www.ebookers.com" },
    { name: "e-planning", url: "https://www.e-planning.net" },
    { name: "eBay", url: "https://www.ebay.com" },
    { name: "Eulerian Technologies", url: "https://www.eulerian.net" },
    { name: "Exactag", url: "https://www.exactag.com" },
    { name: "Experteer", url: "https://www.experteer.de" },
    { name: "Flashtalking", url: "https://www.flashtalking.com" },
    { name: "GroovinAds", url: "https://www.groovinads.com" },
    { name: "HQ Professional Service", url: "https://www.adnet.de" },
    { name: "iCrossing", url: "https://www.icrossing.com" },
    { name: "Mashero GmbH", url: "https://www.mashero.com/en" },
    { name: "Meetic Partners", url: "https://www.meetic-corp.com" },
    { name: "MetaPeople", url: "https://www.metapeople.com" },
    { name: "Neodata Group", url: "https://www.neodatagroup.com" },
    { name: "Newtention", url: "https://www.newtention.com" },
    { name: "Optimum Response", url: "https://www.optimumresponse.net" },
    { name: "Paypal", url: "https://www.paypal.com/uk" },
    { name: "Quisma Tracker", url: "https://www.quisma.com" },
    { name: "QuisMatch", url: "https://www.quisma.com" },
    { name: "SMART AdServer", url: "https://www.smartadserver.com" },
    { name: "Tassimo", url: "https://media.tassimodirect.com" },
    { name: "TradeDoubler", url: "https://www.tradedoubler.com" },
    { name: "TruEffect", url: "https://www.trueffect.com" },
    { name: "Wall Street on Demand/Adhesion", url: "https://ad.wsod.com" },
    { name: "Weborama/AdPerf", url: "https://www.weborama.com" },
];

export default function CookiePolicyPage() {
    return (
        <LegalPageLayout
            title="USE OF COOKIES"
            subtitle="Our commitment to a safe, transparent and trusted travel experience."
        >
            <div className="space-y-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#071746] tracking-tight border-b border-slate-200 pb-3">
                    USE OF COOKIES
                </h2>

                {/* COOKIES AND SIMILAR TECHNOLOGY */}
                <section className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight">
                        Cookies and Similar Technology
                    </h3>
                    <p>
                        The Site uses cookies, web beacons and other similar technical
                        technologies to collect information regarding your use of the Site
                        and the services that we provide.
                    </p>
                    <p>
                        Cookies are small pieces of information containing a unique reference
                        code that a website transfers to your device. They are used to store
                        and, in some cases, track information relating to your activity.
                    </p>
                    <p>
                        Some of the cookies we use remain active only during your web
                        session and expire once you close your browser. Other cookies remain
                        on your device for a longer period and allow us to recognise you when
                        you return to the Site.
                    </p>
                    <p>
                        A web beacon is a small graphic image embedded within a web page that
                        enables us to monitor traffic on the Site or activity within
                        electronic communications.
                    </p>
                </section>

                {/* WE USE COOKIES TO */}
                <section className="space-y-4">
                    <p className="font-semibold text-slate-900">We use cookies to:</p>
                    <ul className="list-none space-y-2.5 pl-2 sm:pl-4">
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                recognise that you have previously visited the Site. This allows
                                us to determine the number of unique visitors accessing
                                different sections of the Site, helping us ensure that
                                sufficient capacity is available and that the Site operates
                                efficiently;
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                retain your login session so that you can move between different
                                pages of the Site without having to log in again;
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                save your preferences, username and password so that you do not
                                need to enter them each time you visit the Site;
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                personalise certain aspects of the layout and/or content
                                displayed on the Site according to your preferences;
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                collect statistical information about how you use the Site so
                                that we can analyse and improve its performance; and
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#F7941D] text-lg font-bold leading-none mt-1">
                                •
                            </span>
                            <span>
                                record information about the pages you visit on the Site, as well
                                as certain information about other websites you may visit.
                            </span>
                        </li>
                    </ul>
                </section>

                {/* THIRD PARTY INFORMATION & ADVERTISING */}
                <section className="space-y-4 pt-2">
                    <p>
                        Some cookies on the Site are placed by us, while others are placed
                        by third parties that provide services on our behalf.
                    </p>
                    <p>
                        These third parties may include advertising partners who display
                        advertisements that they consider likely to be relevant to you.
                        This may be based on information about your activity on the Site
                        and other websites.
                    </p>
                    <p>
                        This information is anonymous and does not contain your name, postal
                        address, email address or telephone number.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4 space-y-3">
                        <p className="font-semibold text-[#071746] text-sm sm:text-base">
                            For further information about online behavioural advertising, you can visit:
                        </p>
                        <ul className="list-disc list-inside space-y-1.5 text-sm text-[#F7941D]">
                            <li>
                                <a
                                    href="https://www.youronlinechoices.co.uk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline text-blue-600 font-medium ml-1"
                                >
                                    The Internet Advertising Bureau at www.youronlinechoices.co.uk
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.networkadvertising.org/choices/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline text-blue-600 font-medium ml-1"
                                >
                                    The Network Advertising Initiative (NAI) at www.networkadvertising.org/choices/
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.aboutads.info/choices/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline text-blue-600 font-medium ml-1"
                                >
                                    The Digital Advertising Alliance’s self-regulatory page at www.aboutads.info/choices/
                                </a>
                            </li>
                        </ul>
                    </div>

                    <p>
                        Most internet browsers automatically accept cookies. However, you can
                        normally change your browser settings to delete cookies or prevent
                        them from being accepted automatically if you prefer.
                    </p>
                    <p>
                        If you choose not to accept cookies from us, certain core functions
                        of the Site may not be available to you.
                    </p>
                    <p>
                        Further information about cookies and how to reject them using
                        different browsers is available at{" "}
                        <a
                            href="https://www.allaboutcookies.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            www.allaboutcookies.org
                        </a>
                        .
                    </p>
                    <p>
                        We have enabled Google Analytics features for the Google Display
                        Network. Using Ads Settings, visitors can opt out of Google Analytics
                        for Display Advertising and customise the advertisements shown through
                        the Google Display Network.
                    </p>
                    <p>
                        We also encourage visitors to make use of the Google Analytics
                        currently available opt-out options for the web.
                    </p>
                    <p>
                        Holiday Jug and third-party providers, including Google, may use
                        first-party cookies, such as Google Analytics cookies, together with
                        third-party cookies, such as the DoubleClick cookie.
                    </p>
                    <p>
                        These cookies may be used to report on how advertising impressions,
                        other uses of advertising services and interactions with
                        advertisements and those services relate to visits to the Site.
                    </p>
                </section>

                {/* SECTION A: OUR COOKIES */}
                <section className="pt-6 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-200 pb-2">
                        A) Our Cookies
                    </h3>
                    <p>
                        A description of the principal cookies used by the Site and the general
                        purposes for which they are used is provided below:
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs my-6">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-[#071746] text-white">
                                    <th className="py-3.5 px-4 font-semibold w-1/4 border-b border-slate-700">
                                        Cookie name
                                    </th>
                                    <th className="py-3.5 px-4 font-semibold w-2/4 border-b border-slate-700">
                                        Purpose
                                    </th>
                                    <th className="py-3.5 px-4 font-semibold w-1/4 border-b border-slate-700">
                                        Type &amp; duration
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {ourCookies.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                                    >
                                        <td className="py-3 px-4  text-[#071746] font-semibold text-xs break-all">
                                            {item.name}
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                                            {item.purpose}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600 font-medium">
                                            <span className="inline-block rounded-md bg-amber-50 px-2 py-1 text-xs text-[#d97706] font-semibold border border-amber-200/60">
                                                {item.type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SECTION B: THIRD-PARTY COOKIES */}
                <section className="pt-6 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-200 pb-2">
                        B) Third-Party Cookies
                    </h3>
                    <p>
                        Third parties may also place cookies on the Site. Further
                        information about third-party cookies, including information about
                        how you can restrict or block them, can be obtained by visiting the
                        relevant third party’s website.
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs my-6">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-[#071746] text-white">
                                    <th className="py-3.5 px-4 font-semibold w-1/5 border-b border-slate-700">
                                        Name
                                    </th>
                                    <th className="py-3.5 px-4 font-semibold w-2/5 border-b border-slate-700">
                                        Purpose / Typical Content
                                    </th>
                                    <th className="py-3.5 px-4 font-semibold w-1/5 border-b border-slate-700">
                                        Type &amp; Duration
                                    </th>
                                    <th className="py-3.5 px-4 font-semibold w-1/5 border-b border-slate-700">
                                        How to Reject / Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {thirdPartyCookies.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                                    >
                                        <td className="py-3 px-4 font-semibold text-[#071746] text-xs">
                                            {item.name}
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                                            {item.purpose}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600 font-medium">
                                            <span className="inline-block rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 font-medium border border-blue-100">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-xs">
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-all font-medium"
                                            >
                                                {item.linkText}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* DOUBLECLICK DART & ADSENSE VENDORS */}
                    <div className="space-y-4 pt-4">
                        <p>
                            The DoubleClick DART cookie is used by Google when serving
                            advertisements on publisher websites that display AdSense content
                            ads. When users visit an AdSense publisher’s website and view or
                            click an advertisement, a cookie may be placed on the user’s
                            browser.
                        </p>
                        <p>
                            Information collected through these cookies is used to help
                            AdSense publishers manage and serve advertising more effectively on
                            their websites and across the internet.
                        </p>

                        <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
                            <li>
                                Google, acting as a third-party vendor, uses cookies to serve
                                advertisements on websites.
                            </li>
                            <li>
                                Google’s use of the DART cookie allows advertisements to be shown
                                to users based on their visits to the publisher’s website and
                                other websites across the Internet.
                            </li>
                            <li>
                                Users may opt out of the use of the DART cookie by visiting
                                Google’s advertising and content network privacy policy.
                            </li>
                        </ul>

                        <p>
                            The following provides a list of third-party sources for AdSense
                            advertisements. This list reflects the sources identified at the
                            time of viewing and may change, as Google may add additional
                            vendors in the future. For the most current list supplied by
                            Google, please refer to the Google AdSense Third Party Vendors
                            information.
                        </p>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs my-4 max-h-96">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead className="sticky top-0 bg-[#071746] text-white z-10">
                                    <tr>
                                        <th className="py-3 px-4 font-semibold w-1/2">
                                            Google AdSense Third Party Vendor
                                        </th>
                                        <th className="py-3 px-4 font-semibold w-1/2">Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {adsenseVendors.map((vendor, idx) => (
                                        <tr
                                            key={idx}
                                            className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                                        >
                                            <td className="py-2.5 px-4 font-medium text-slate-900">
                                                {vendor.name}
                                            </td>
                                            <td className="py-2.5 px-4">
                                                <a
                                                    href={vendor.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline font-medium"
                                                >
                                                    {vendor.url.replace(/^https?:\/\//, "")}
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* SIMILAR TECHNOLOGIES */}
                <section className="pt-6 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071746] tracking-tight border-b border-slate-200 pb-2">
                        Similar Technologies
                    </h3>
                    <p>
                        In addition to cookies, we may use the following technologies in
                        connection with your use of the Site:
                    </p>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                                Pixel GIFs
                            </h4>
                            <p>
                                These are small image files placed within our newsletters. They
                                allow us to determine whether a newsletter has been opened and
                                whether particular content within the newsletter is of interest to
                                recipients. This information helps us improve the relevance of the
                                content included in our communications.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                                Flash Cookies
                            </h4>
                            <p>
                                We may use Adobe Flash Player to display video or image content.
                                Depending on your browser and settings, it may not be possible to
                                block or restrict Flash cookies through the normal browser
                                controls. Information about managing Flash privacy and security
                                settings is available through the Adobe website.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </LegalPageLayout>
    );
}
