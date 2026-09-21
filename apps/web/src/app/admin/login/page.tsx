"use client";

import { useEffect, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiMail, FiAlertCircle, FiEye, FiEyeOff, FiSend } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";

const REMEMBER_KEY = "holidayjug-admin-remember-email";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setEmail(saved);
        setRemember(true);
      }
    } catch {
      // localStorage unavailable — not remembering is a fine fallback
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    if (!result || result.error) {
      setError("Invalid email or password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
      return;
    }

    try {
      if (remember) localStorage.setItem(REMEMBER_KEY, email);
      else localStorage.removeItem(REMEMBER_KEY);
    } catch {
      // best-effort only
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 flex items-center justify-center px-4 py-16">
      {/* Ambient animated blobs */}
      <motion.div
        className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-sun-400/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-brand-400/25 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Flying plane */}
      <motion.div
        className="absolute text-white/25 text-5xl pointer-events-none"
        initial={{ x: "-10vw", y: "70vh", rotate: -8 }}
        animate={{ x: "110vw", y: "5vh", rotate: -8 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      >
        <FaPlane />
      </motion.div>

      <motion.div
        className="w-full max-w-md relative"
        animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-col items-center mb-8"
          >
            <motion.div
              className="relative w-14 h-14 mb-4"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/assets/Holiday_Jug_Logo.png"
                alt="Holiday Jug"
                fill
                className="object-contain"
              />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to manage Holiday Jug</p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 overflow-hidden"
              >
                <FiAlertCircle className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@holidayjug.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </motion.div>

            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.34 }}
              className="flex items-center gap-2.5 text-sm text-gray-600 select-none"
            >
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              Remember my email on this device
            </motion.label>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition shadow-lg shadow-brand-600/20"
            >
              {loading ? (
                <motion.span
                  className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <FiSend />
              )}
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/70 text-xs mt-6"
        >
          This portal is restricted to Holiday Jug staff only.
        </motion.p>
      </motion.div>
    </div>
  );
}
