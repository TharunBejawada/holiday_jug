"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    window.location.href = "/";
  }, []);

  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="0;url=/" />
      </head>
      <body className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Redirecting to homepage...</p>
      </body>
    </html>
  );
}

