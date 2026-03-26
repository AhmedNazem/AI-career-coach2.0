/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["randomuser.me"], // Allow images from randomuser.me
  },
};

export default nextConfig;
