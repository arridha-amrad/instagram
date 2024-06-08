/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "localhost", protocol: "http" },
      { hostname: "res.cloudinary.com", protocol: "https" },
      { hostname: "images.pexels.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
