/** @type {import('next').NextConfig} */
const { withSuperjson } = require("next-superjson");
const nextConfig = withSuperjson()({
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
    domains: ["i.scdn.co", "i.imgur.com"],
  },
});

module.exports = nextConfig;
