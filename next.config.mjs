/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "localhost", protocol: "http" },
      { hostname: "res.cloudinary.com", protocol: "https" },
      { hostname: "images.pexels.com", protocol: "https" },
      { hostname: "lh3.googleusercontent.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
