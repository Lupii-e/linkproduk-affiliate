/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan Image Optimization untuk debugging total
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**', // IZIN SEMENTARA UNTUK SEMUA HOST
      },
    ],
  },
};

export default nextConfig;