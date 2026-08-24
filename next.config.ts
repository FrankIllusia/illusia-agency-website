import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.io"],

  /* The shop resolves missing product photography by stat-ing files under
     public/ (lib/shop/catalog.ts). Next cannot statically tell which paths
     those are, so it traces the whole of public/ into the /shop function —
     487MB, mostly campaign video, against Vercel's 250MB limit.

     public/ is served from the CDN and no function needs to read it, so it is
     excluded everywhere and only the shop's own images are added back. */
  outputFileTracingExcludes: {
    "/*": ["public/**/*"],
    "/**": ["public/**/*"],
  },
  outputFileTracingIncludes: {
    "/shop": ["public/images/shop/**/*"],
    "/shop/**": ["public/images/shop/**/*"],
  },
};

export default nextConfig;
