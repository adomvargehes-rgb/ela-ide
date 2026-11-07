/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: false, // Monaco Editor handles its own lifecycle
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;

