import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  // A production build must not replace assets served by a running dev server.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  // No `images.remotePatterns` on purpose. The scaffold allowed `hostname: "**"`, which turns
  // /_next/image into an open proxy anyone can resize arbitrary remote images through. Nothing here
  // loads a remote image; add specific hostnames if that ever changes.
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.wgsl": { loaders: ["@vgpu/wgsl/loader-webpack"], as: "*.js" },
    },
  },
  webpack(config) {
    config.module.rules.push({ test: /\.wgsl$/, use: "@vgpu/wgsl/loader-webpack" });
    return config;
  },
});

export default nextConfig;
