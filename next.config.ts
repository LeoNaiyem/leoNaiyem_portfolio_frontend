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

// A local API (dev, or `next start` against it) needs the optimizer to fetch from a
// private IP. A deployed site points at public hosts, so this stays off there.
const usesLocalApi = imageOrigins.some(({ hostname }) =>
  ["localhost", "127.0.0.1", "[::1]"].includes(hostname),
);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns,
    dangerouslyAllowLocalIP: usesLocalApi,
  },
};

export default nextConfig;
