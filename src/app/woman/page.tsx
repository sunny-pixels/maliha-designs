import type { Metadata } from "next";
import { CollectionShowcase } from "@/components/CollectionShowcase";
import { CustomImageGallery } from "@/components/CustomImageGallery";
import { HeadingText } from "@/components/HeadingText";
import { LookbookSection } from "@/components/LookbookSection";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { featuredProducts, lookbookProducts } from "@/data/products";
import type { Spacing } from "@/lib/sizing";

export const metadata: Metadata = {
  title: "Woman – Kurta sets, lehengas & occasion wear | Maliha",
  description: "Handcrafted Indian occasion wear for women by Maliha — kurta sets, shararas, lehengas and dupattas.",
};

const ig = (n: number) => `/images/maliha/ig-${String(n).padStart(2, "0")}.jpg`;
const look = (n: number) => `/images/lookbook/look-${String(n).padStart(2, "0")}.jpg`;

// Heading paddings copied from the Woman template (section wrapper + inner block).
const heading = {
  top: { m: [0, 0, 16], d: [20, 0, 0] } as Spacing,
  topSpaced: { m: [0, 20, 16], d: [20, 20, 0] } as Spacing,
  block: { m: [20, 0, 0], d: [0, 0, 16] } as Spacing,
};

export default function WomanPage() {
  return (
    <main id="MainContent" className="content-for-layout">
      {/* 1 — hero banner */}
      <CollectionShowcase
        heading
        priority
        ratio={{ m: "4/5", d: "24/10" }}
        alignment="middleCenter"
        items={[
          {
            image: "/images/maliha/banner-woman.jpg",
            mobileImage: ig(9),
            focus: "50% 30%",
            href: "/collections/festive-edit",
            title: "Made by Maliha - The Festive Edit",
            button: "SHOP NOW",
          },
        ]}
      />

      {/* 2–4 — category galleries */}
      <HeadingText
        text="DISCOVER THE COLLECTION"
        padding={heading.top}
        blockPadding={{ m: [20, 20, 0], d: [0, 0, 16] }}
      />
      <CustomImageGallery
        ratio={{ m: "4/5", d: "5/4" }}
        padding={{ m: [8, 0, 0], d: [24, 0, 0] }}
        columns={{ m: 2, d: 2 }}
        items={[
          { image: ig(1), href: "/collections/kurta-sets", button: "KURTA SETS", focus: "50% 30%" },
          { image: ig(5), href: "/collections/sharara-sets", button: "SHARARA SETS", focus: "50% 28%" },
        ]}
      />
      <CustomImageGallery
        ratio={{ m: "4/5", d: "5/4" }}
        padding={{ m: [8, 0, 0], d: [16, 0, 0] }}
        columns={{ m: 2, d: 2 }}
        items={[
          { image: ig(3), href: "/collections/drape-sets", button: "DRAPES & DUPATTAS", focus: "50% 25%" },
          { image: ig(10), href: "/collections/co-ord-sets", button: "CO-ORD SETS", focus: "50% 30%" },
        ]}
      />

      {/* 5–6 — product carousel */}
      <HeadingText text="HANDPICKED FOR YOU" padding={heading.top} blockPadding={heading.block} />
      <ProductCarousel products={featuredProducts} padding={{ m: [0, 20, 16], d: [8, 20, 0] }} />

      {/* 7–8 — in focus */}
      <HeadingText text="IN FOCUS" padding={heading.topSpaced} blockPadding={heading.block} />
      <CollectionShowcase
        ratio={{ m: "4/5", d: "4/4" }}
        alignment="bottomLeft"
        items={[
          {
            image: ig(11),
            focus: "50% 20%",
            href: "/collections/new-arrivals",
            title: "New Arrivals",
            text: "Organza, chanderi and hand embroidery new for the season",
            button: "SHOP NOW",
          },
          {
            image: look(17),
            focus: "50% 20%",
            href: "/lookbook",
            title: "The Lookbook",
            text: "The SS21 edit, look by look",
            button: "DISCOVER",
          },
        ]}
      />

      {/* 9–10 — lookbook with hotspots */}
      <HeadingText text="OUR SIGNATURE CRAFT" padding={heading.topSpaced} blockPadding={heading.block} />
      <LookbookSection
        title="Made by Maliha"
        text="Every Maliha piece begins with a sketch by Anar & Anoli and is finished by hand — tonal thread-work on organza, scalloped edges and soft chanderi drapes. Designed for celebrations, made to be worn again and again."
        button={{ label: "SEE THE FULL COLLECTION", href: "/collections/made-by-maliha" }}
        image={ig(6)}
        imageFocus="50% 30%"
        ratio={{ m: "355/414", d: "672/784" }}
        padding={{ m: [10, 20, 16], d: [0, 40, 40] }}
        hotspots={[
          { x: 52, y: 38 },
          { x: 48, y: 80 },
        ]}
        products={lookbookProducts}
      />

      {/* 11 — shop by silhouette */}
      <CollectionShowcase
        ratio={{ m: "4/5", d: "4/5" }}
        alignment="bottomLeft"
        padding={{ m: [0, 20, 0], d: [0, 0, 0] }}
        items={[
          { image: look(5), focus: "50% 20%", href: "/collections/lehengas", title: "Lehengas", button: "SHOP NOW" },
          { image: look(26), focus: "50% 20%", href: "/collections/anarkalis", title: "Anarkalis", button: "SHOP NOW" },
          { image: look(12), focus: "50% 20%", href: "/collections/palazzo-sets", title: "Palazzo Sets", button: "SHOP NOW" },
          { image: look(11), focus: "50% 20%", href: "/collections/dupattas", title: "Dupattas", button: "SHOP NOW" },
        ]}
      />

      {/* 12–13 — occasions */}
      <HeadingText
        text="EACH MOMENT, HER EXPRESSION"
        padding={{ m: [0, 0, 16], d: [40, 30, 0] }}
        blockPadding={{ m: [10, 20, 0], d: [0, 0, 16] }}
      />
      <CollectionShowcase
        ratio={{ m: "4/5", d: "4/5" }}
        alignment="bottomLeft"
        padding={{ m: [0, 20, 0], d: [0, 0, 0] }}
        items={[
          { image: ig(8), focus: "50% 25%", href: "/collections/in-celebration", title: "In Celebration", button: "SEE ALL" },
          { image: look(29), focus: "50% 20%", href: "/collections/in-evening", title: "In Evening", button: "DISCOVER" },
          { image: look(28), focus: "50% 20%", href: "/collections/in-ease", title: "In Ease", button: "EXPLORE" },
        ]}
      />
    </main>
  );
}
