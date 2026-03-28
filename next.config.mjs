import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["randomuser.me"], // Allow images from randomuser.me
  },
  cacheHandler:
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "cache-handler.mjs")
      : undefined,
};

export default nextConfig;
