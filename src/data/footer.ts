import type { NavLink } from "./navigation";

export type FooterColumn = {
  heading: string;
  links: NavLink[];
  /** Show contact details under the links (mobile only, as in the original). */
  showContact?: boolean;
};

export const footerColumns: FooterColumn[] = [
  {
    heading: "ABOUT US",
    links: [
      { label: "About Maliha", href: "/pages/about-us" },
      { label: "Anar & Anoli", href: "/pages/anar-and-anoli" },
      { label: "Our Craft", href: "/pages/our-craft" },
      { label: "The Lookbook", href: "/lookbook" },
      { label: "Careers", href: "/pages/careers" },
    ],
  },
  {
    heading: "SHOP",
    links: [
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Kurta Sets", href: "/collections/kurta-sets" },
      { label: "Lehengas", href: "/collections/lehengas" },
      { label: "Custom Orders", href: "/pages/custom-orders" },
      { label: "Gift card", href: "/products/gift-card" },
    ],
  },
  {
    heading: "SUPPORT",
    showContact: true,
    links: [
      { label: "Contact", href: "/pages/contact" },
      { label: "Shipping & Returns", href: "/pages/shipping-returns" },
      { label: "Terms of purchase", href: "/pages/terms-of-purchase" },
      { label: "Privacy policy", href: "/pages/privacy-policy" },
      { label: "Size guide", href: "/pages/size-guide" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "TERMS & CONDITIONS", href: "/pages/terms" },
  { label: "PRIVACY", href: "/pages/privacy-policy" },
  { label: "COOKIE POLICY", href: "/pages/privacy-policy" },
];
