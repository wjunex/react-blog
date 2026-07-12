import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.wjun.me",
      },
      {
        protocol: "https",
        hostname: "file.zost.cn",
      },
       {
        protocol: "http",
        hostname: "yangliuyiyi.oss-cn-chengdu.aliyuncs.com",
      },
    ],
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_BASE !== "http://localhost:3000") return [];
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*",
      },
    ];
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
