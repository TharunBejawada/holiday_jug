// @next/env ships as CommonJS; import it as a default import rather than a
// named import so Node's ESM loader doesn't have to (sometimes unreliably)
// statically detect named exports from a CJS module.
import nextEnv from "@next/env";
import { fileURLToPath } from "url";
import path from "path";
const { loadEnvConfig } = nextEnv;

// Next.js only auto-loads .env files from this app's own directory. Our
// shared .env lives at the monorepo root (one file for every teammate to
// point at the same DB/SES/S3 config), so load it explicitly before the
// config below is evaluated. Resolved from this file's own location rather
// than process.cwd() — cwd depends on exactly how `next dev`/`next build`
// was launched (directly, via npm --workspace, via turbo, from an IDE) and
// silently resolves to the wrong directory in some of those cases, in which
// case loadEnvConfig just finds nothing there and moves on with no error.
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // apps/web
const repoRoot = path.resolve(__dirname, "../..");
// loadEnvConfig caches its result at the module level. Next.js's own
// internal bootstrap calls it first (against the wrong directory, before
// next.config.mjs is even evaluated), so without forceReload=true this call
// just returns that earlier, empty, cached result instead of actually
// re-scanning repoRoot.
loadEnvConfig(repoRoot, undefined, console, true);

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

