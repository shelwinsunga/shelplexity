/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [{ hostname: "imgs.search.brave.com" }],
  },
};

export default nextConfig;
