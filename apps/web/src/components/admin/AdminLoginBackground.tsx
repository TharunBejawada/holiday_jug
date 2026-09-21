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

type Point = [number, number];

// Samples a quadratic bezier (in 0-100 "viewBox" units) into left/top/rotate
// keyframe arrays, so a flying icon can glide along a gentle arc instead of
// a straight diagonal, with its rotation following the curve's tangent.
function bezierKeyframes(p0: Point, p1: Point, p2: Point, steps = 24) {
  const left: string[] = [];
  const top: string[] = [];
  const rotate: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0];
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1];
    left.push(`${x}%`);
    top.push(`${y}%`);

    const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    rotate.push((Math.atan2(dy, dx) * 180) / Math.PI);
  }

  return { left, top, rotate };
}

const PLANE_CURVE: [Point, Point, Point] = [
  [6, 80],
  [50, 8],
  [94, 46],
];
const PIN_CURVE: [Point, Point, Point] = [
  [90, 68],
  [46, 96],
  [10, 28],
];

const planeKeyframes = bezierKeyframes(...PLANE_CURVE);
const pinKeyframes = bezierKeyframes(...PIN_CURVE);
const planePathD = `M ${PLANE_CURVE[0][0]} ${PLANE_CURVE[0][1]} Q ${PLANE_CURVE[1][0]} ${PLANE_CURVE[1][1]} ${PLANE_CURVE[2][0]} ${PLANE_CURVE[2][1]}`;
const pinPathD = `M ${PIN_CURVE[0][0]} ${PIN_CURVE[0][1]} Q ${PIN_CURVE[1][0]} ${PIN_CURVE[1][1]} ${PIN_CURVE[2][0]} ${PIN_CURVE[2][1]}`;

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

      {/* Curved dotted flight paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d={planePathD} stroke="white" strokeOpacity="0.3" strokeWidth="1.5" fill="none" strokeDasharray="0.5 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={pinPathD} stroke="white" strokeOpacity="0.18" strokeWidth="1.5" fill="none" strokeDasharray="0.5 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>

      <motion.div
        className="absolute text-white/80 text-2xl drop-shadow-lg -translate-x-1/2 -translate-y-1/2"
        animate={{ left: planeKeyframes.left, top: planeKeyframes.top, rotate: planeKeyframes.rotate }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <FaPlane />
      </motion.div>

      <motion.div
        className="absolute text-white/45 text-lg drop-shadow-lg -translate-x-1/2 -translate-y-1/2"
        animate={{ left: pinKeyframes.left, top: pinKeyframes.top }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear", delay: 2.5 }}
      >
        <FaMapMarkerAlt />
      </motion.div>
    </div>
  );
}
