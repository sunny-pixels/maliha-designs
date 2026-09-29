import { CollectionShowcase } from "@/components/CollectionShowcase";
import { HeadingText } from "@/components/HeadingText";

export default function Home() {
  return (
    <main id="MainContent" className="content-for-layout">
      <CollectionShowcase
        ratio={{ m: "4/5", d: "24/20" }}
        alignment="middleCenter"
        priority
        fullHeight
        largeButton
        items={[
          { image: "/images/lookbook/look-20.jpg", href: "/women", button: "WOMEN", focus: "60% 30%" },
          { image: "/images/women/autumn-winter.jpg", href: "/lookbook", button: "LOOKBOOK", focus: "50% 15%" },
        ]}
      />
      <HeadingText
        text="ABOUT MALIHA"
        adjustment={8}
        padding={{ m: [30, 20, 0], d: [0, 20, 50] }}
        blockPadding={{ m: [0, 0, 16], d: [40, 0, 0] }}
      />
      <CollectionShowcase
        ratio={{ m: "4/5", d: "10/4" }}
        alignment="bottomLeft"
        padding={{ m: [0, 0, 0], d: [0, 40, 0] }}
        items={[
          {
            image: "/images/maliha/banner-atelier.jpg",
            mobileImage: "/images/maliha/atelier-mobile.jpg",
            href: "/pages/about-us",
            title: "The Atelier",
            text: "Handcrafted occasion wear by Anar & Anoli",
            button: "DISCOVER",
          },
        ]}
      />
    </main>
  );
}
