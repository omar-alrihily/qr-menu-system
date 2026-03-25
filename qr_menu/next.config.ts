/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // ضروري جداً لظهور صور المنتجات التي ترفعها
      },
    ],
  },
};

export default nextConfig;