import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

// Images come from the Laravel API (public disk) or from MEDIA_URL (S3 / R2).
const imageOrigins = [process.env.API_URL, process.env.MEDIA_URL]
  .filter((value): value is string => Boolean(value))
  .map((value) => new URL(value));

const remotePatterns: RemotePattern[] = imageOrigins.map((url) => ({
  protocol: url.protocol.replace(":", "") as "http" | "https",
  hostname: url.hostname,
  port: url.port,
  pathname: "/**",
}));

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns,
    // Lets the optimizer fetch from the API on localhost during development.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
