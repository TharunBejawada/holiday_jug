import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HolidayJug — Pack Dreams, Collect Memories",
  description:
    "Find and book cheap package holidays, all-inclusive deals and beach getaways — ATOL Protected.",
  icons: {
    icon: "/assets/Holiday_Jug_Logo.png",
    shortcut: "/assets/Holiday_Jug_Logo.png",
    apple: "/assets/Holiday_Jug_Logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={poppins.variable}>
      <body className={`${poppins.className} bg-white text-gray-900 font-medium antialiased flex flex-col min-h-screen relative`}>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}



