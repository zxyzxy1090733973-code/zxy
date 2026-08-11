import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@concept-to-model/contracts", "@concept-to-model/domain"],
};

export default nextConfig;
