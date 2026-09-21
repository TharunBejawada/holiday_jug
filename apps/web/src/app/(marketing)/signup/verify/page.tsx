"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiHash, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { AuthShell } from "@/components/auth/AuthShell";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push(`/signup/complete?email=${encodeURIComponent(email)}`);
  }

  async function handleResend() {
    setResending(true);
    setResent(false);
    setError(null);

    const res = await fetch("/api/auth/signup/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    setResending(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    setResent(true);
  }

  return (
    <AuthShell
      eyebrow="Verify your email"
      title="Check your inbox"
      subtitle={`Enter the 6-digit code we sent to ${email}.`}
    >
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
        {resent && !error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="rounded-lg bg-brand-50 border border-brand-200 text-brand-700 text-sm px-3 py-2.5 overflow-hidden"
          >
            A new code has been sent.
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Verification code
          </label>
          <div className="relative">
            <FiHash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-50 outline-none transition tracking-[0.3em] text-lg font-semibold"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || code.length !== 6}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-brand-600/20"
        >
          {loading ? (
            <motion.span
              className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <FiArrowRight />
          )}
          {loading ? "Verifying..." : "Verify code"}
        </motion.button>
      </form>

      <button
        onClick={handleResend}
        disabled={resending}
        className="w-full text-center text-sm text-brand-600 font-semibold hover:underline mt-6 disabled:opacity-60"
      >
        {resending ? "Resending..." : "Resend code"}
      </button>
    </AuthShell>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
