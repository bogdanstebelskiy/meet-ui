import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@stream-io/video-react-bindings"],
  reactCompiler: true,
};

export default nextConfig;
