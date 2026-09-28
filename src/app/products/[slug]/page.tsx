import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductModule } from "@/components/product/ProductModule";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { allProducts, getProduct, pairedProducts, productHref, relatedProducts } from "@/data/products";
import { shareMetadata, siteUrl } from "@/lib/seo";

// Product-page stylesheets from the reference template (the rest load in the layout).
import "@/styles/theme/breadcrumbs.css";
import "@/styles/theme/main-product.css";
import "@/styles/theme/section-recently-viewed.css";

type Params = { params: Promise<{ slug: string }> };

// Every product is known at build time; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};

  const title = `${product.name} | Maliha`;
  const share = shareMetadata({ title, description: product.description, path: productHref(product.slug) });
  // No per-product share files: preview with the product's first photo.
  const images = [{ url: product.images[0], alt: product.name }];

  return {
    title: product.name,
    description: product.description,
    ...share,
    openGraph: { ...share.openGraph, images },
    twitter: { ...share.twitter, images },
  };
}

export default async function ProductPage({ params }: Params) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const url = new URL(productHref(product.slug), siteUrl).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.articleNo,
    image: product.images.map((src) => new URL(src, siteUrl).toString()),
    brand: { "@type": "Brand", name: product.brand },
    category: product.category.label,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      availability: product.sizes.some((s) => s.available) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main id="MainContent" className="content-for-layout">
      <div className="shopify-section product__module">
        <ProductModule product={product} pairs={pairedProducts(product, 4)} />
      </div>

      <ProductCarousel
        heading="You may also like"
        products={relatedProducts(product, 6)}
        desktopPerView={3}
        padding={{ m: [20, 20, 0], d: [40, 40, 40] }}
      />

      <RecentlyViewed current={product.slug} />

      <script
        type="application/ld+json"
        // Escape "<" so product text can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}
