import type { NextConfig } from "next";

function remotePatternFromUrl(value?: string) {
  if (!value) return null;

  const url = new URL(value);

  return {
    hostname: url.hostname,
    pathname: "/uploads/**",
    port: url.port,
    protocol: url.protocol.replace(":", "") as "http" | "https",
  };
}

const phpApiRemotePattern = remotePatternFromUrl(process.env.HALLWICKS_API_URL);
const strapiRemotePattern = remotePatternFromUrl(process.env.STRAPI_API_URL);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        pathname: "/uploads/**",
        port: "1337",
        protocol: "http",
      },
      ...(phpApiRemotePattern ? [phpApiRemotePattern] : []),
      ...(strapiRemotePattern ? [strapiRemotePattern] : []),
    ],
  },
};

export default nextConfig;
