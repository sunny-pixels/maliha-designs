import type { Metadata } from "next";
import { brand } from "@/config/brand";

/**
 * Absolute site URL for share links. Set NEXT_PUBLIC_SITE_URL for a custom
 * domain; on Vercel the production URL is used automatically.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
);

export const siteDescription =
  "Handcrafted Indian occasion wear for women by Anar & Anoli — kurta sets, shararas, lehengas and dupattas in organza, chanderi and silk.";

/**
 * Open Graph + Twitter fields for a page. Page-level `openGraph` replaces the
 * layout's (it isn't merged), so every page builds the full set here. The
 * preview image comes from the route's `opengraph-image.jpg` file.
 */
export function shareMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: brand.fullName,
      locale: "en_IN",
      url: path,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
