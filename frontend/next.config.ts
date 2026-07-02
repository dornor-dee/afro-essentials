import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};
module.exports = {
  allowedDevOrigins: ["10.14.13.123"],
};

export default nextConfig;
