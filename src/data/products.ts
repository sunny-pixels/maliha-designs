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
  /** Clothing sub-collection, used for breadcrumbs and "You may also like". */
  category: { label: string; slug: string };
  // Product page copy. Placeholder text until the real copy is written.
  description: string;
  details: string[];
  fabricCare: string[];
  fitNote: string;
  articleNo: string;
  /**
   * Colour variants of one design are separate products (as in the theme,
   * where a swatch opens the other colour's page) sharing this key.
   */
  variantGroup?: string;
};

const look = (n: number) => `/images/lookbook/look-${String(n).padStart(2, "0")}.jpg`;
const ig = (n: number) => `/images/maliha/ig-${String(n).padStart(2, "0")}.jpg`;

const sizes = (unavailable: string[] = []) =>
  ["XS", "S", "M", "L", "XL"].map((label) => ({ label, available: !unavailable.includes(label) }));

const category = {
  lehengas: { label: "Lehengas", slug: "lehengas" },
  shararas: { label: "Sharara Sets", slug: "sharara-sets" },
  kurtaSets: { label: "Kurta Sets", slug: "kurta-sets" },
  kurtas: { label: "Kurtas", slug: "kurtas" },
  angrakhas: { label: "Angrakhas", slug: "angrakhas" },
  anarkalis: { label: "Anarkalis", slug: "anarkalis" },
  skirtSets: { label: "Skirt Sets", slug: "skirt-sets" },
  drapeSets: { label: "Drape Sets", slug: "drape-sets" },
  palazzoSets: { label: "Palazzo Sets", slug: "palazzo-sets" },
};

const care = {
  dryClean: ["Dry clean only", "Steam or iron on low heat, on the reverse", "Store folded in the muslin bag provided"],
  gentle: ["Dry clean recommended", "Or hand wash cold, separately, with a mild detergent", "Dry flat in the shade", "Iron on low heat, on the reverse"],
};

const TRUE_TO_SIZE = "Regular fit, true to size.\nWe recommend choosing your usual size.";

let articleCount = 0;

const product = (
  p: Omit<Product, "brand" | "slug" | "fitNote" | "articleNo"> & { slug?: string; fitNote?: string },
): Product => ({
  brand: "MALIHA",
  // "Coral Ombré" → "coral-ombre": strip accents before slugging.
  slug:
    p.slug ??
    p.name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"),
  fitNote: TRUE_TO_SIZE,
  articleNo: `MLH-${String(++articleCount).padStart(4, "0")}`,
  ...p,
});

export const formatPrice = (inr: number) => `₹ ${inr.toLocaleString("en-IN")}`;

export const productHref = (slug: string) => `/products/${slug}`;

/** "Handpicked for you" carousel — outfits from the SS21 lookbook. */
export const featuredProducts: Product[] = [
  product({
    name: "Maroon Chanderi Lehenga Set",
    label: "NEW",
    images: [look(3), look(4)],
    colors: [{ name: "Maroon", hex: "#7a1f2b" }],
    sizes: sizes(["XL"]),
    price: 28500,
    category: category.lehengas,
    description:
      "A striped chanderi lehenga in deep maroon, paired with a hand-embroidered blouse and a sheer organza dupatta finished with a scalloped edge. Made for festive evenings and wedding functions.",
    details: [
      "Three-piece set: blouse, lehenga and dupatta",
      "Hand-embroidered zari and sequin motifs on the blouse",
      "Organza dupatta with a scalloped, embroidered border",
      "Lehenga with drawstring waist and side zip",
    ],
    fabricCare: ["Chanderi silk lehenga and blouse, silk organza dupatta", "Fully lined in cotton", ...care.dryClean],
    fitNote: "Blouse is fitted; lehenga sits at the natural waist.\nIf between sizes, we recommend sizing up.",
  }),
  product({
    name: "Wine Peplum Sharara Set",
    label: "NEW",
    images: [look(6), look(7)],
    colors: [{ name: "Wine", hex: "#6d1a33" }],
    sizes: sizes(),
    price: 18900,
    category: category.shararas,
    description:
      "A flared peplum kurta in wine chanderi, scattered with hand-embroidered buttis, worn over a pleated sharara and an organza dupatta with a gota edge.",
    details: [
      "Three-piece set: peplum kurta, sharara and dupatta",
      "Hand-embroidered butti motifs",
      "Gota lace trims on the hem and dupatta",
      "Sharara with elasticated waist and drawstring",
    ],
    fabricCare: ["Chanderi silk kurta and sharara, organza dupatta", "Lined in cotton", ...care.dryClean],
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
    category: category.shararas,
    description:
      "A short navy kurta with a zari-embroidered yoke and hem, paired with a tiered sharara and a sheer dupatta. Understated, but made for an evening.",
    details: [
      "Three-piece set: kurta, sharara and dupatta",
      "Zari embroidery on the neckline and hem",
      "Tiered sharara with a soft, full flare",
      "Side pockets on the kurta",
    ],
    fabricCare: ["Chanderi silk kurta and sharara, organza dupatta", "Lined in cotton", ...care.dryClean],
  }),
  product({
    name: "Rani Pink Silk Kurta Set",
    label: "BESTSELLER",
    images: [look(10), look(18), look(19)],
    colors: [{ name: "Rani Pink", hex: "#c8184a" }],
    sizes: sizes(),
    price: 14800,
    category: category.kurtaSets,
    description:
      "Our bestselling straight kurta in rani pink silk, with a hand-embroidered yoke, straight pants and a gold tissue dupatta.",
    details: [
      "Three-piece set: kurta, pants and tissue dupatta",
      "Hand-embroidered yoke in zari and resham",
      "Straight pants with elasticated waist",
      "Side slits and pockets on the kurta",
    ],
    fabricCare: ["Silk kurta and pants, tissue dupatta", "Lined in cotton", ...care.dryClean],
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
    category: category.kurtaSets,
    description:
      "A deep teal A-line kurta with dense thread embroidery at the neckline and sleeves, worn with straight pants and a matching dupatta.",
    details: [
      "Three-piece set: kurta, pants and dupatta",
      "Resham and sequin embroidery on the neckline and cuffs",
      "A-line silhouette with side pockets",
      "Pants with elasticated back waist",
    ],
    fabricCare: ["Muslin silk kurta and pants, chiffon dupatta", "Lined in cotton", ...care.gentle],
  }),
  product({
    name: "Marigold Kurta Set",
    label: "NEW",
    images: [look(12), look(22)],
    colors: [{ name: "Marigold", hex: "#e2b32a" }],
    sizes: sizes(),
    price: 12500,
    category: category.kurtaSets,
    description:
      "A sunny marigold kurta set for haldi mornings and daytime celebrations, with delicate mirror work and a light cotton-silk dupatta.",
    details: [
      "Three-piece set: kurta, pants and dupatta",
      "Hand-set mirror work and thread embroidery",
      "Relaxed straight kurta with side slits",
      "Pants with elasticated waist",
    ],
    fabricCare: ["Cotton silk kurta and pants, chanderi dupatta", "Kurta lined in cotton", ...care.gentle],
  }),
  product({
    name: "Crimson Stripe Kurta",
    label: "NEW",
    images: [look(14), look(15)],
    colors: [{ name: "Crimson", hex: "#b3263a" }],
    sizes: sizes(["S"]),
    price: 9800,
    category: category.kurtas,
    description:
      "A crimson woven-stripe kurta with a notched neckline and hand-finished tassels. Pair it with our palazzos or your own denim.",
    details: [
      "Kurta only",
      "Woven stripe with a subtle sheen",
      "Notched neckline with tassel ties",
      "Three-quarter sleeves and side slits",
    ],
    fabricCare: ["Silk blend", "Unlined", ...care.gentle],
  }),
  product({
    name: "Peacock Angrakha Set",
    label: "NEW",
    images: [look(16), look(17)],
    colors: [{ name: "Peacock", hex: "#0f5d78" }],
    sizes: sizes(),
    price: 13900,
    category: category.angrakhas,
    description:
      "An overlapping angrakha in peacock blue with a tie-up side and gota-edged panels, paired with straight pants and an organza dupatta.",
    details: [
      "Three-piece set: angrakha, pants and dupatta",
      "Wrap front with tie-up fastening",
      "Gota and zari trims on the panels",
      "Pants with elasticated waist",
    ],
    fabricCare: ["Chanderi silk angrakha and pants, organza dupatta", "Lined in cotton", ...care.dryClean],
    fitNote: "Relaxed fit with an adjustable tie.\nWe recommend choosing your usual size.",
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
    category: category.kurtaSets,
    description:
      "A hand-dyed ombré kurta that fades from coral to blush, with fine thread embroidery at the neckline and a matching dupatta.",
    details: [
      "Three-piece set: kurta, pants and dupatta",
      "Hand-dyed ombré — each piece varies slightly",
      "Thread embroidery on the neckline",
      "Pants with elasticated waist",
    ],
    fabricCare: ["Cotton silk kurta and pants, chiffon dupatta", "Kurta lined in cotton", ...care.gentle],
  }),
  product({
    name: "Midnight Organza Kurta Set",
    label: "BESTSELLER",
    images: [look(25), look(26), look(27)],
    colors: [{ name: "Midnight", hex: "#1d2436" }],
    sizes: sizes(["XS", "XL"]),
    price: 16500,
    category: category.kurtaSets,
    description:
      "A layered midnight-blue kurta in sheer organza over a silk slip, with tonal sequin embroidery that catches the light after dark.",
    details: [
      "Three-piece set: kurta with slip, pants and dupatta",
      "Tonal sequin and cutdana embroidery",
      "Sheer organza sleeves",
      "Pants with elasticated waist",
    ],
    fabricCare: ["Silk organza kurta over a silk slip, silk pants, organza dupatta", ...care.dryClean],
  }),
  product({
    name: "Magenta Angrakha Anarkali",
    label: "NEW",
    images: [look(30), look(31)],
    colors: [{ name: "Magenta", hex: "#9c1d56" }],
    sizes: sizes(),
    price: 17800,
    category: category.anarkalis,
    description:
      "A floor-length anarkali in magenta with an angrakha-style bodice and a full, many-panelled skirt that moves beautifully.",
    details: [
      "Two-piece set: anarkali and dupatta",
      "Angrakha bodice with tie-up side",
      "Twenty-four-panel flared skirt",
      "Zari piping along every seam",
    ],
    fabricCare: ["Chanderi silk anarkali, organza dupatta", "Lined in cotton", ...care.dryClean],
    fitNote: "Fitted bodice with a relaxed, flared skirt.\nIf between sizes, we recommend sizing up.",
  }),
  product({
    name: "Coral Drape Skirt Set",
    label: "NEW",
    images: [look(34), look(35)],
    colors: [{ name: "Coral", hex: "#e0736b" }],
    sizes: sizes(["L"]),
    price: 21500,
    category: category.skirtSets,
    description:
      "A hand-embroidered crop top with a pre-draped coral skirt and attached drape — the ease of a saree without the pleating.",
    details: [
      "Two-piece set: top and pre-draped skirt",
      "Hand-embroidered top with a back tie",
      "Pre-stitched drape attached at the waist",
      "Side zip on the skirt",
    ],
    fabricCare: ["Georgette skirt and drape, silk top", "Lined in cotton", ...care.dryClean],
  }),
];

/** Products in the slider beside the "Made by Maliha" lookbook image. */
export const lookbookProducts: Product[] = [
  product({
    name: "Lilac Hand-Embroidered Drape Set",
    label: "NEW",
    images: [ig(6), ig(7), ig(3)],
    colors: [{ name: "Lilac", hex: "#b597b8" }],
    sizes: sizes(),
    price: 24500,
    category: category.drapeSets,
    description:
      "A lilac ombré drape set with a hand-embroidered, one-shoulder drape over a fluid skirt. Our signature piece from the Made by Maliha edit.",
    details: [
      "Two-piece set: draped top and skirt",
      "Hand-embroidered floral drape",
      "Ombré dyed from lilac to plum",
      "Concealed side zip",
    ],
    fabricCare: ["Organza drape, satin silk skirt", ...care.dryClean],
    fitNote: "Tailored at the bodice, fluid through the skirt.\nWe recommend choosing your usual size.",
  }),
  product({
    name: "Plum Scalloped Palazzo Set",
    label: "NEW",
    images: [ig(8), ig(7)],
    colors: [{ name: "Plum", hex: "#6f4d68" }],
    sizes: sizes(["XS"]),
    price: 19900,
    category: category.palazzoSets,
    description:
      "A plum kurta with a scalloped, hand-cut hem over wide palazzos and a sheer dupatta — easy to wear, and quietly festive.",
    details: [
      "Three-piece set: kurta, palazzos and dupatta",
      "Scalloped, hand-embroidered hem",
      "Wide-leg palazzos with elasticated waist",
      "Side pockets on the kurta",
    ],
    fabricCare: ["Satin silk kurta and palazzos, organza dupatta", "Kurta lined in cotton", ...care.dryClean],
  }),
];

const zari = (colour: string, n: number) => `/images/variants/zari-stripe-${colour}-${n}.jpg`;

const zariStripe = (p: { colour: string; hex: string; pants: string; unavailable?: string[] }) =>
  product({
    name: `${p.colour} Zari Stripe Kurta Set`,
    label: "NEW",
    images: [1, 2, 3].map((n) => zari(p.colour.toLowerCase(), n)),
    colors: [{ name: p.colour, hex: p.hex }],
    sizes: sizes(p.unavailable),
    price: 13500,
    category: category.kurtaSets,
    variantGroup: "zari-stripe-kurta-set",
    description: `A straight ${p.colour.toLowerCase()} kurta woven with fine zari stripes, finished with an embroidered V-neck placket and banded hem, and paired with ${p.pants} pants for a quiet contrast.`,
    details: [
      "Two-piece set: kurta and pants",
      "Zari-striped weave with an embroidered V-neck placket",
      `Contrast ${p.pants} pants with elasticated waist`,
      "Side slits and three-quarter sleeves",
    ],
    fabricCare: ["Chanderi silk kurta, silk pants", "Kurta lined in cotton", ...care.dryClean],
  });

/** One design in three colours — the demo for colour variants. Blue is the default. */
export const zariStripeVariants: Product[] = [
  zariStripe({ colour: "Blue", hex: "#3d5a7a", pants: "bottle-green" }),
  zariStripe({ colour: "Yellow", hex: "#d4b12a", pants: "olive", unavailable: ["XS"] }),
  zariStripe({ colour: "Red", hex: "#b3283d", pants: "plum" }),
];

export const allProducts: Product[] = [...featuredProducts, ...lookbookProducts, ...zariStripeVariants];

export const getProduct = (slug: string) => allProducts.find((p) => p.slug === slug);

/** Every colour of `product`'s design, in catalogue order (just `product` if it has none). */
export const colorVariants = (product: Product): Product[] =>
  product.variantGroup ? allProducts.filter((p) => p.variantGroup === product.variantGroup) : [product];

/** Keep the first product of each variant group, so one design never fills a row. */
const onePerDesign = (products: Product[]) =>
  products.filter((p, i) => !p.variantGroup || products.findIndex((q) => q.variantGroup === p.variantGroup) === i);

/**
 * "Pair it with" picks: other categories only, starting at a different point
 * for each product so neighbouring pages don't all show the same four.
 */
export function pairedProducts(product: Product, count: number): Product[] {
  const others = onePerDesign(allProducts.filter((p) => p.category.slug !== product.category.slug));
  const start = allProducts.indexOf(product) % Math.max(1, others.length);
  return [...others.slice(start), ...others.slice(0, start)].slice(0, count);
}

/**
 * The design's other colours first (they aren't shown anywhere else on its
 * page), then the same category, then the rest of the catalogue.
 */
export function relatedProducts(product: Product, count: number): Product[] {
  const colours = colorVariants(product).filter((p) => p.slug !== product.slug);
  const others = onePerDesign(
    allProducts.filter((p) => p.slug !== product.slug && (!product.variantGroup || p.variantGroup !== product.variantGroup)),
  );
  const same = others.filter((p) => p.category.slug === product.category.slug);
  return [...colours, ...same, ...others.filter((p) => !same.includes(p))].slice(0, count);
}
