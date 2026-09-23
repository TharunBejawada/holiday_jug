"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/destinations", label: "Countries" },
  { href: "/admin/destinations/places", label: "Places" },
  { href: "/admin/destinations/holiday-types", label: "Holiday Types" },
  { href: "/admin/destinations/faqs", label: "FAQs" },
];

export function DestinationsSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
      {TABS.map((tab) => {
        const active =
          tab.href === "/admin/destinations"
            ? pathname === tab.href || /^\/admin\/destinations\/(new|[^/]+)$/.test(pathname)
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              active
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
