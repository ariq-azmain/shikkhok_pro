import type { NextConfig } from "next";
import nextPWA from "@ducanh2912/next-pwa";

const withPWA = nextPWA({
  dest: "public",
  // Disable next-pwa auto-registration to avoid double-registration.
  // We'll keep the explicit ServiceWorkerRegister component which checks
  // for /sw.js before attempting to register — this is more resilient.
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = withPWA({
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
});

export default nextConfig;
