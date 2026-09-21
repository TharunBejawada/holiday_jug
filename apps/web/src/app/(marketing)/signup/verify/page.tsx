"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiHash, FiAlertCircle } from "react-icons/fi";

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
    <div className="min-h-[calc(100vh-0px)] bg-gradient-to-br from-brand-50 via-white to-sun-400/10 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Check your inbox</h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter the 6-digit code we sent to <span className="font-semibold">{email}</span>.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5">
              <FiAlertCircle className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {resent && !error && (
            <div className="mb-5 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 text-sm px-3 py-2.5">
              A new code has been sent.
            </div>
          )}

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
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition tracking-[0.3em] text-lg font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition shadow-lg shadow-brand-600/20"
            >
              {loading ? "Verifying..." : "Verify code"}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full text-center text-sm text-brand-600 font-semibold hover:underline mt-6 disabled:opacity-60"
          >
            {resending ? "Resending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
