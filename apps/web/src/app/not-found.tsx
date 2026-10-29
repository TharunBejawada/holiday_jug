"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <>
      <head>
        <meta httpEquiv="refresh" content="0;url=/" />
      </head>
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <p className="text-sm text-gray-500">Redirecting to homepage...</p>
      </div>
    </>
  );
}
