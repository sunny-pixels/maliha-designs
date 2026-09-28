import type { Metadata } from "next";
import { CollectionShowcase } from "@/components/CollectionShowcase";
import { CustomImageGallery } from "@/components/CustomImageGallery";
import { HeadingText } from "@/components/HeadingText";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { featuredProducts, zariStripeVariants } from "@/data/products";
import { shareMetadata } from "@/lib/seo";
import type { Spacing } from "@/lib/sizing";

const title = "SS21 Lookbook";
const description = "The Maliha SS21 lookbook — kurta sets, shararas and lehengas handcrafted by Anar & Anoli.";

export const metadata: Metadata = {
  title,
  description,
  ...shareMetadata({ title: `${title} | Maliha`, description, path: "/lookbook" }),
};

const look = (n: number) => `/images/lookbook/look-${String(n).padStart(2, "0")}.jpg`;
const ig = (n: number) => `/images/maliha/ig-${String(n).padStart(2, "0")}.jpg`;

/** All 33 looks from the SS21 lookbook PDF, in page order. */
const looks = Array.from({ length: 33 }, (_, i) => i + 3);

const headingTop: Spacing = { m: [0, 0, 16], d: [20, 0, 0] };
const headingSpaced: Spacing = { m: [0, 20, 16], d: [20, 20, 0] };
const headingBlock: Spacing = { m: [20, 0, 0], d: [0, 0, 16] };

export default function LookbookPage() {
  return (
    <main id="MainContent" className="content-for-layout">
      <CollectionShowcase
        heading
        priority
        ratio={{ m: "4/5", d: "24/10" }}
        alignment="middleCenter"
        items={[
          {
            image: "/images/maliha/banner-lookbook.jpg",
            mobileImage: look(15),
            focus: "50% 20%",
            href: "#looks",
            title: "The SS21 Lookbook",
            button: "VIEW THE LOOKS",
          },
        ]}
      />

      <div id="looks">
        <HeadingText text="THE SS21 EDIT" padding={headingTop} blockPadding={{ m: [20, 20, 0], d: [0, 0, 16] }} />
      </div>
      <CustomImageGallery
        ratio={{ m: "2/3", d: "2/3" }}
        padding={{ m: [8, 0, 0], d: [24, 0, 0] }}
        columns={{ m: 2, d: 3 }}
        items={looks.map((n) => ({
          image: look(n),
          href: "/collections/lookbook",
          alt: `Maliha SS21 look ${n - 2}`,
          focus: "50% 30%",
        }))}
      />

      <HeadingText text="SHOP THE LOOK" padding={headingTop} blockPadding={headingBlock} />
      {/* First card: the colour-variant demo (blue, with yellow and red swatches). */}
      <ProductCarousel products={[zariStripeVariants[0], ...featuredProducts]} padding={{ m: [0, 20, 16], d: [8, 20, 0] }} />

      <HeadingText text="BEHIND THE CAMPAIGN" padding={headingSpaced} blockPadding={headingBlock} />
      <CollectionShowcase
        ratio={{ m: "4/5", d: "4/5" }}
        alignment="bottomLeft"
        padding={{ m: [0, 20, 0], d: [0, 0, 0] }}
        items={[
          { image: ig(2), focus: "50% 30%", href: "/pages/about-us", title: "The Atelier", button: "DISCOVER" },
          { image: ig(7), focus: "50% 25%", href: "/collections/lilac-edit", title: "The Lilac Edit", button: "SHOP NOW" },
          { image: ig(1), focus: "50% 30%", href: "/women", title: "Shop Women", button: "EXPLORE" },
        ]}
      />
    </main>
  );
}
