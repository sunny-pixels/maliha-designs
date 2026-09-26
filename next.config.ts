import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 85 for full-bleed heroes (embroidery detail), 75 for tiles and cards.
    qualities: [75, 85],
  },
};

export default nextConfig;
