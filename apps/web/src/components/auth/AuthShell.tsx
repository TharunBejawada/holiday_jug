"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AuthBrandPanel } from "./AuthBrandPanel";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:block lg:w-[46%] shrink-0">
        <AuthBrandPanel />
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-12">
        <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-12 lg:hidden">
          <div className="relative" style={{ width: 120, aspectRatio: "750 / 334" }}>
            <Image src="/assets/Holiday_Jug_Logo.png" alt="Holiday Jug" fill className="object-contain" />
          </div>
        </Link>

        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 mt-8 lg:mt-0"
          >
            <p className="text-sun-500 font-semibold text-xs tracking-wide uppercase">{eyebrow}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
