import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack cannot write outputs to Windows drives (/mnt/c) on WSL.
  // Point distDir at a Linux-native path for local verification, e.g.:
  //   NEXT_DIST_DIR=/tmp/distraai next build && NEXT_DIST_DIR=/tmp/distraai next start
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default nextConfig;
