import type { Metadata } from "next";
import { CollectionShowcase } from "@/components/CollectionShowcase";
import { CustomImageGallery } from "@/components/CustomImageGallery";
import { HeadingText } from "@/components/HeadingText";
import { LookbookSection } from "@/components/LookbookSection";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { featuredProducts, lookbookProducts } from "@/data/products";
import { shareMetadata } from "@/lib/seo";
import type { Spacing } from "@/lib/sizing";

const title = "Women – Kurta Sets, Lehengas & Occasion Wear";
const description = "Handcrafted Indian occasion wear for women by Maliha — kurta sets, shararas, lehengas and dupattas.";

export const metadata: Metadata = {
  title,
  description,
  ...shareMetadata({ title: `${title} | Maliha`, description, path: "/women" }),
};

const look = (n: number) => `/images/lookbook/look-${String(n).padStart(2, "0")}.jpg`;
const women = (name: string) => `/images/women/${name}.jpg`;

// Heading paddings copied from the Women template (section wrapper + inner block).
const heading = {
  top: { m: [0, 0, 16], d: [20, 0, 0] } as Spacing,
  topSpaced: { m: [0, 20, 16], d: [20, 20, 0] } as Spacing,
  block: { m: [20, 0, 0], d: [0, 0, 16] } as Spacing,
};

export default function WomenPage() {
  return (
    <main id="MainContent" className="content-for-layout">
      {/* 1 — hero banner */}
      <CollectionShowcase
        heading
        priority
        largeButton
        ratio={{ m: "4/5", d: "24/10" }}
        alignment="middleCenter"
        items={[
          {
            image: "/images/maliha/banner-women.jpg",
            mobileImage: women("hero-mobile"),
            focus: "50% 30%",
            href: "/collections/festive-edit",
            title: "Made by Maliha, The Festive Edit",
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
          { image: women("nav-festive-edit"), href: "/collections/kurta-sets", button: "KURTA SETS", focus: "50% 25%" },
          { image: look(14), href: "/collections/sharara-sets", button: "SHARARA SETS", focus: "50% 22%" },
        ]}
      />
      <CustomImageGallery
        ratio={{ m: "4/5", d: "5/4" }}
        padding={{ m: [8, 0, 0], d: [16, 0, 0] }}
        columns={{ m: 2, d: 2 }}
        items={[
          { image: "/images/variants/zari-stripe-blue-2.jpg", href: "/collections/drape-sets", button: "DRAPES & DUPATTAS", focus: "50% 20%" },
          { image: women("discover-kurta-sets"), href: "/collections/co-ord-sets", button: "CO-ORD SETS", focus: "50% 30%" },
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
            image: women("in-focus-new-arrivals"),
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

      {/* 9–10 — lookbook */}
      <HeadingText text="OUR SIGNATURE CRAFT" padding={heading.topSpaced} blockPadding={heading.block} />
      <LookbookSection
        title="Made by Maliha"
        text="Every Maliha piece begins with a sketch by Anar & Anoli and is finished by hand — tonal thread-work on organza, scalloped edges and soft chanderi drapes. Designed for celebrations, made to be worn again and again."
        button={{ label: "SEE THE FULL COLLECTION", href: "/collections/made-by-maliha" }}
        image={women("craft-left")}
        imageFocus="50% 30%"
        ratio={{ m: "355/414", d: "672/784" }}
        padding={{ m: [10, 20, 16], d: [0, 40, 40] }}
        products={lookbookProducts}
      />

      {/* 11 — shop by silhouette */}
      <CollectionShowcase
        ratio={{ m: "4/5", d: "4/5" }}
        alignment="bottomLeft"
        padding={{ m: [0, 20, 0], d: [0, 0, 0] }}
        items={[
          { image: women("spring-summer"), focus: "50% 20%", href: "/collections/spring-summer", title: "Spring/Summer", button: "SHOP NOW" },
          { image: women("autumn-winter"), focus: "65% 10%", href: "/collections/autumn-winter", title: "Autumn/Winter", button: "SHOP NOW" },
          { image: look(12), focus: "50% 20%", href: "/collections/festive", title: "Festive", button: "SHOP NOW" },
          { image: "/images/lookbook/look-34-flipped.jpg", focus: "50% 20%", href: "/collections/hand-picked", title: "Hand Picked", button: "SHOP NOW" },
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
          { image: women("in-celebration"), focus: "50% 25%", href: "/collections/in-celebration", title: "In Celebration", button: "SEE ALL" },
          { image: "/images/variants/zari-stripe-yellow-2.jpg", focus: "50% 15%", href: "/collections/in-evening", title: "In Evening", button: "DISCOVER" },
          { image: look(28), focus: "50% 10%", href: "/collections/in-ease", title: "In Ease", button: "EXPLORE" },
        ]}
      />
    </main>
  );
}
