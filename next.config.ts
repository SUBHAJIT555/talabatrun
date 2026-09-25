import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The in-app browser opens 127.0.0.1; Next blocks dev resources from that host otherwise.
  allowedDevOrigins: ["127.0.0.1"],
  // A lockfile in a parent directory makes Next infer the wrong workspace root.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
