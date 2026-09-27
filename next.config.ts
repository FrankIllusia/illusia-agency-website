import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.io"],
  // The capabilities deck is a self-contained static page in public/our-deck.
  // Next does not serve a directory index, so /our-deck is mapped to its file.
  async rewrites() {
    return [{ source: "/our-deck", destination: "/our-deck/index.html" }];
  },
};

export default nextConfig;
