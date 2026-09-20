// @next/env ships as CommonJS; import it as a default import rather than a
// named import so Node's ESM loader doesn't have to (sometimes unreliably)
// statically detect named exports from a CJS module.
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;

// Next.js only auto-loads .env files from this app's own directory. Our
// shared .env lives at the monorepo root (one file for every teammate to
// point at the same DB/SES/S3 config), so load it explicitly before the
// config below is evaluated.
loadEnvConfig(process.cwd() + "/../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@holiday-jug/core", "@holiday-jug/db"],
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

