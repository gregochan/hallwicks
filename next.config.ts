import type { NextConfig } from "next";

const strapiUrl = process.env.STRAPI_API_URL;
const strapiRemotePattern = strapiUrl
  ? (() => {
      const url = new URL(strapiUrl);

      return {
        hostname: url.hostname,
        pathname: "/uploads/**",
        port: url.port,
        protocol: url.protocol.replace(":", "") as "http" | "https",
      };
    })()
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        pathname: "/uploads/**",
        port: "1337",
        protocol: "http",
      },
      ...(strapiRemotePattern ? [strapiRemotePattern] : []),
    ],
  },
};

export default nextConfig;
