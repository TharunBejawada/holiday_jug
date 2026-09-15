import React from "react";

interface LegalPageLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function LegalPageLayout({
    title,
    subtitle = "Our commitment to a safe, transparent and trusted travel experience.",
    children,
}: LegalPageLayoutProps) {
    return (
        <div className="w-full bg-white text-[#334155] antialiased min-h-screen">
            {/* HERO BANNER SECTION */}
            <section className="relative w-full overflow-hidden bg-slate-50">
                <div className="relative min-h-[300px] sm:min-h-[360px] md:min-h-[420px] w-full flex items-center">
                    {/* Background image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/Terms_of_use_banner.jpg"
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />

                    {/* Banner Text Container Overlay */}
                    <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                        <div className="max-w-md sm:max-w-lg md:max-w-xl">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#071746] tracking-wide uppercase mb-3">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-xs sm:text-sm md:text-base text-[#475569] font-medium leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN LEGAL CONTENT CONTAINER */}
            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
                <div className="space-y-6 text-sm sm:text-[15px] md:text-base leading-relaxed text-[#334155]">
                    {children}
                </div>
            </main>

            {/* BOTTOM DECORATIVE FOOTER IMAGE */}
            <section className="w-full overflow-hidden">
                <div className="w-full mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/Terms_of_use_bottom.png"
                        alt="Holiday Jug Terms Decorative Footer"
                        className="w-full h-auto object-cover block"
                    />
                </div>
            </section>
        </div>
    );
}
