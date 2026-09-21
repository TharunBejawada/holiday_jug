"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlane, FaMapMarkerAlt } from "react-icons/fa";

const SLIDES = [
  "/assets/Santorini.jpg",
  "/assets/Tenerife.jpg",
  "/assets/Dubai.jpg",
  "/assets/Antalya.jpg",
];

export function AdminLoginBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-900">
      <AnimatePresence>
        <motion.div
          key={SLIDES[index]}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 6, ease: "easeOut" } }}
        >
          <Image
            src={SLIDES[index]}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Slightly-black overlay so foreground content stays legible */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/70 via-brand-900/40 to-black/60" />

      {/* Dotted flight paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <line x1="5%" y1="82%" x2="95%" y2="12%" stroke="white" strokeOpacity="0.28" strokeWidth="2" strokeDasharray="1 12" strokeLinecap="round" />
        <line x1="92%" y1="75%" x2="10%" y2="20%" stroke="white" strokeOpacity="0.18" strokeWidth="2" strokeDasharray="1 12" strokeLinecap="round" />
      </svg>

      <motion.div
        className="absolute text-white/80 text-2xl drop-shadow-lg -translate-x-1/2 -translate-y-1/2"
        animate={{ left: ["5%", "95%"], top: ["82%", "12%"], rotate: -18 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <FaPlane />
      </motion.div>

      <motion.div
        className="absolute text-white/50 text-lg drop-shadow-lg -translate-x-1/2 -translate-y-1/2"
        animate={{ left: ["92%", "10%"], top: ["75%", "20%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 2.5 }}
      >
        <FaMapMarkerAlt />
      </motion.div>
    </div>
  );
}
