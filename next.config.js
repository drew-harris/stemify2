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
  images: {
    domains: ["i.scdn.co"],
  },
};

module.exports = nextConfig;
