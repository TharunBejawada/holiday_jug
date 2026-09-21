"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiLock, FiHeadphones } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";
import { bezierKeyframes, bezierPathD, type Point } from "@/lib/motion-paths";

const SLIDES = [
  { src: "/assets/Santorini.jpg", quote: "Booked our Santorini trip in minutes — best prices we found anywhere.", name: "Priya S." },
  { src: "/assets/Tenerife.jpg", quote: "The whole family loved Tenerife. Booking was seamless start to finish.", name: "James O." },
  { src: "/assets/Dubai.jpg", quote: "Our Dubai getaway was sorted in one evening. Highly recommend Holiday Jug.", name: "Amara K." },
  { src: "/assets/Antalya.jpg", quote: "Great deals, no hassle. We're already planning our next trip here.", name: "Michael R." },
];

const PLANE_CURVE: [Point, Point, Point] = [
  [10, 78],
  [55, 10],
  [90, 42],
];
const planeKeyframes = bezierKeyframes(...PLANE_CURVE);
const planePathD = bezierPathD(...PLANE_CURVE);

const TRUST_ITEMS = [
  { icon: FiShield, label: "ATOL Protected" },
  { icon: FiLock, label: "Secure Payments" },
  { icon: FiHeadphones, label: "24/7 Support" },
];

export function AuthBrandPanel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const active = SLIDES[index];

  return (
    <div className="relative h-full w-full overflow-hidden bg-brand-900">
      <AnimatePresence>
        <motion.div
          key={active.src}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: 6, ease: "easeOut" } }}
        >
          <Image src={active.src} alt="" fill priority={index === 0} sizes="46vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-brand-900/50 to-black/75" />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={planePathD} stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="none" strokeDasharray="0.5 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <motion.div
        className="absolute text-white/70 text-xl drop-shadow-lg -translate-x-1/2 -translate-y-1/2"
        animate={{ left: planeKeyframes.left, top: planeKeyframes.top, rotate: planeKeyframes.rotate }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <FaPlane />
      </motion.div>

      <div className="relative h-full flex flex-col justify-between p-10 xl:p-14">
        <motion.div
          className="relative"
          style={{ width: 160, aspectRatio: "750 / 334" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Image src="/assets/Holiday_Jug_Logo.png" alt="Holiday Jug" fill className="object-contain" />
        </motion.div>

        <div>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active.quote}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="text-white text-xl xl:text-2xl font-semibold leading-snug max-w-md"
            >
              &ldquo;{active.quote}&rdquo;
              <footer className="mt-3 text-sm font-medium text-white/70">— {active.name}</footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-3">
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-sun-400" : "w-1.5 bg-white/30"}`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-8 pt-8 border-t border-white/15">
            {TRUST_ITEMS.map((t) => (
              <span key={t.label} className="flex items-center gap-2 text-sm font-medium text-white/80">
                <t.icon className="text-sun-300" /> {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
