/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: "https://dl.embed.stemplayer.com/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
