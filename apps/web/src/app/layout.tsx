import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Holiday Jug — UK Holiday Packages & Cheap Beach Holidays",
  description:
    "Find and book cheap package holidays, all-inclusive deals and beach getaways from the UK.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
