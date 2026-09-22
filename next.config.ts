import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A lockfile in a parent directory makes Next infer the wrong workspace root.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
