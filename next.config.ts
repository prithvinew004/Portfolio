import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No `images.remotePatterns` on purpose. The scaffold allowed `hostname: "**"`, which turns
  // /_next/image into an open proxy anyone can resize arbitrary remote images through. Nothing here
  // loads a remote image; add specific hostnames if that ever changes.
  poweredByHeader: false,
};

export default nextConfig;
