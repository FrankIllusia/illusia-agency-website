import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.io"],
  // The decks are self-contained static pages under public/. Next does not
  // serve a directory index, so each one is mapped to its file.
  async rewrites() {
    return [
      { source: "/our-deck", destination: "/our-deck/index.html" },
      { source: "/experiential-examples", destination: "/experiential-examples/index.html" },
    ];
  },
};

export default nextConfig;
