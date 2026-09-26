import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 keeps the fabric and embroidery detail sharp in large sections.
    qualities: [75, 90],
  },
};

export default nextConfig;
