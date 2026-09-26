export type Product = {
  slug: string;
  name: string;
  brand: string;
  label?: "NEW" | "BESTSELLER";
  /** 4:5 card images; the first is the default. */
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: { label: string; available: boolean }[];
  /** Price in INR. */
  price: number;
};

const look = (n: number) => `/images/lookbook/look-${String(n).padStart(2, "0")}.jpg`;
const ig = (n: number) => `/images/maliha/ig-${String(n).padStart(2, "0")}.jpg`;

const sizes = (unavailable: string[] = []) =>
  ["XS", "S", "M", "L", "XL"].map((label) => ({ label, available: !unavailable.includes(label) }));

const product = (p: Omit<Product, "brand" | "slug"> & { slug?: string }): Product => ({
  brand: "MALIHA",
  slug: p.slug ?? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  ...p,
});

export const formatPrice = (inr: number) => `₹ ${inr.toLocaleString("en-IN")}`;

/** "Handpicked for you" carousel — outfits from the SS21 lookbook. */
export const featuredProducts: Product[] = [
  product({
    name: "Maroon Chanderi Lehenga Set",
    label: "NEW",
    images: [look(3), look(4)],
    colors: [{ name: "Maroon", hex: "#7a1f2b" }],
    sizes: sizes(["XL"]),
    price: 28500,
  }),
  product({
    name: "Wine Peplum Sharara Set",
    label: "NEW",
    images: [look(6), look(7)],
    colors: [{ name: "Wine", hex: "#6d1a33" }],
    sizes: sizes(),
    price: 18900,
  }),
  product({
    name: "Navy Chanderi Sharara Set",
    label: "NEW",
    images: [look(8), look(9)],
    colors: [
      { name: "Navy", hex: "#252c45" },
      { name: "Wine", hex: "#6d1a33" },
    ],
    sizes: sizes(["XS"]),
    price: 19500,
  }),
  product({
    name: "Rani Pink Silk Kurta Set",
    label: "BESTSELLER",
    images: [look(10), look(18), look(19)],
    colors: [{ name: "Rani Pink", hex: "#c8184a" }],
    sizes: sizes(),
    price: 14800,
  }),
  product({
    name: "Teal Embroidered Kurta Set",
    label: "NEW",
    images: [look(11), look(20), look(21)],
    colors: [
      { name: "Teal", hex: "#11566b" },
      { name: "Bottle Green", hex: "#1f4a38" },
    ],
    sizes: sizes(["XL"]),
    price: 15900,
  }),
  product({
    name: "Marigold Kurta Set",
    label: "NEW",
    images: [look(12), look(22)],
    colors: [{ name: "Marigold", hex: "#e2b32a" }],
    sizes: sizes(),
    price: 12500,
  }),
  product({
    name: "Crimson Stripe Kurta",
    label: "NEW",
    images: [look(14), look(15)],
    colors: [{ name: "Crimson", hex: "#b3263a" }],
    sizes: sizes(["S"]),
    price: 9800,
  }),
  product({
    name: "Peacock Angrakha Set",
    label: "NEW",
    images: [look(16), look(17)],
    colors: [{ name: "Peacock", hex: "#0f5d78" }],
    sizes: sizes(),
    price: 13900,
  }),
  product({
    name: "Coral Ombré Kurta Set",
    label: "NEW",
    images: [look(23)],
    colors: [
      { name: "Coral", hex: "#d9776a" },
      { name: "Sage", hex: "#8fa89b" },
    ],
    sizes: sizes(),
    price: 11900,
  }),
  product({
    name: "Midnight Organza Kurta Set",
    label: "BESTSELLER",
    images: [look(25), look(26), look(27)],
    colors: [{ name: "Midnight", hex: "#1d2436" }],
    sizes: sizes(["XS", "XL"]),
    price: 16500,
  }),
  product({
    name: "Magenta Angrakha Anarkali",
    label: "NEW",
    images: [look(30), look(31)],
    colors: [{ name: "Magenta", hex: "#9c1d56" }],
    sizes: sizes(),
    price: 17800,
  }),
  product({
    name: "Coral Drape Skirt Set",
    label: "NEW",
    images: [look(34), look(35)],
    colors: [{ name: "Coral", hex: "#e0736b" }],
    sizes: sizes(["L"]),
    price: 21500,
  }),
];

/** Products tagged by the hotspots in the "Made by Maliha" lookbook section. */
export const lookbookProducts: Product[] = [
  product({
    name: "Lilac Hand-Embroidered Drape Set",
    label: "NEW",
    images: [ig(6), ig(7), ig(3)],
    colors: [{ name: "Lilac", hex: "#b597b8" }],
    sizes: sizes(),
    price: 24500,
  }),
  product({
    name: "Plum Scalloped Palazzo Set",
    label: "NEW",
    images: [ig(8), ig(7)],
    colors: [{ name: "Plum", hex: "#6f4d68" }],
    sizes: sizes(["XS"]),
    price: 19900,
  }),
];
