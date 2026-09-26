import type { Metadata } from "next";
import { brandFont } from "./fonts";

// Theme stylesheets, in the same order the original page loaded them.
import "@/styles/theme/base.css";
import "@/styles/theme/global-blocks.css";
import "@/styles/theme/component-product_card.css";
import "@/styles/theme/component-selectbox.css";
import "@/styles/theme/component-swiper.css";
import "@/styles/theme/desktop-menu.css";
import "@/styles/theme/component-popup.css";
import "@/styles/theme/section-sidebar_menu.css";
import "@/styles/theme/cart.css";
import "@/styles/theme/section-sidebar_cart.css";
import "@/styles/theme/component-search.css";
import "@/styles/theme/section-collection-showcase.css";
import "@/styles/theme/section-heading_text.css";
import "@/styles/theme/section-custom-image-gallery.css";
import "@/styles/theme/section-product_carousel.css";
import "@/styles/theme/section-lookbook.css";
import "@/styles/theme/main-footer.css";
import "@/styles/theme/inline.css";

import { UIProvider } from "@/components/UIProvider";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header/Header";
import { MobileMenu } from "@/components/Header/MobileMenu";
import { CartDrawer, CountryDrawer, SearchDrawer } from "@/components/drawers/Drawers";
import { Footer } from "@/components/Footer/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Maliha by Anar & Anoli",
  description: "Maliha by Anar & Anoli — handcrafted Indian occasion wear for women: kurta sets, shararas, lehengas and dupattas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`js ${brandFont.variable}`}>
      <body>
        <a className="skipToContent u-p4" href="#MainContent">
          {" "}
          Skip to content{" "}
        </a>
        <UIProvider>
          {/* Empty first grid row, like the original newsletter-popup section. */}
          <div className="shopify-section" />
          <AnnouncementBar />
          <Header />
          <MobileMenu />
          <CartDrawer />
          <SearchDrawer />
          {children}
          <Footer />
          <CountryDrawer />
          <ScrollReveal />
        </UIProvider>
      </body>
    </html>
  );
}
