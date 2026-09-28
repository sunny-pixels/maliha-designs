export type NavLink = { label: string; href: string };
export type NavCard = NavLink & { img: string };

export type SecondLevel = NavLink & {
  key: string;
  /** Third-level links shown in the third column (max 15 on desktop). */
  children: NavLink[];
  /** Links that overflow into the extra desktop column. */
  overflow: NavLink[];
  /** Collection cards shown on the right when this item is hovered. */
  cards: NavCard[];
  /** Cards shown in the mobile menu sub-level (defaults to `cards`). */
  mobileCards?: NavCard[];
};

export type TopMenu = NavLink & {
  key: string;
  featured: NavLink[];
  second: SecondLevel[];
  rootCards: NavCard[];
  mobileRootCards: NavCard[];
};

const ig = (n: number) => `/images/maliha/ig-${String(n).padStart(2, "0")}.jpg`;
const look = (n: number) => `/images/lookbook/look-${String(n).padStart(2, "0")}.jpg`;
const col = (slug: string) => `/collections/${slug}`;
const link = (label: string, href: string): NavLink => ({ label, href });
const card = (label: string, href: string, img: string): NavCard => ({ label, href, img });
const women = (name: string) => `/images/women/${name}.jpg`;
const about = (name: string) => `/images/about/${name}.jpg`;

const aboutCards: NavCard[] = [
  card("Book a custom fitting", "/pages/custom-orders", about("nav-custom-fitting")),
  card("Our craft", "/pages/our-craft", about("nav-our-craft")),
];

export const navigation: TopMenu[] = [
  {
    key: "women",
    label: "Women",
    href: "/women",
    featured: [
      link("New Arrivals", col("new-arrivals")),
      link("The Festive Edit", col("festive-edit")),
      link("Offer: Made by Maliha", col("made-by-maliha")),
    ],
    rootCards: [
      card("Made by Maliha, The Festive Edit", col("festive-edit"), women("nav-festive-edit")),
      card("New Arrivals", col("new-arrivals"), women("nav-new-arrivals")),
    ],
    mobileRootCards: [card("Made by Maliha, The Festive Edit", col("festive-edit"), women("nav-festive-edit"))],
    second: [
      {
        key: "women-clothing",
        ...link("Clothing", col("clothing")),
        children: [
          link("Kurta Sets", col("kurta-sets")),
          link("Sharara Sets", col("sharara-sets")),
          link("Lehengas", col("lehengas")),
          link("Anarkalis", col("anarkalis")),
          link("Palazzo Sets", col("palazzo-sets")),
          link("Co-ord Sets", col("co-ord-sets")),
          link("Angrakhas", col("angrakhas")),
          link("Kurtas", col("kurtas")),
          link("Tunics & Tops", col("tunics-tops")),
          link("Skirt Sets", col("skirt-sets")),
          link("Drape Sets", col("drape-sets")),
          link("Dupattas", col("dupattas")),
          link("Jackets", col("jackets")),
          link("Trousers & Palazzos", col("trousers")),
          link("Loungewear", col("loungewear")),
        ],
        overflow: [link("Fabrics by the metre", col("fabrics")), link("See all", col("clothing"))],
        cards: [card("Kurta Sets", col("kurta-sets"), look(10))],
        mobileCards: [card("Kurta Sets", col("kurta-sets"), look(10))],
      },
      {
        key: "women-occasions",
        ...link("Occasions", col("occasions")),
        children: [
          link("Festive", col("festive")),
          link("Wedding Guest", col("wedding-guest")),
          link("Mehendi & Haldi", col("mehendi-haldi")),
          link("Evening", col("evening")),
          link("Everyday Ease", col("everyday")),
          link("See all", col("occasions")),
        ],
        overflow: [],
        cards: [
          card("Wedding Guest", col("wedding-guest"), look(3)),
          card("Mehendi & Haldi", col("mehendi-haldi"), look(12)),
        ],
        mobileCards: [card("Wedding Guest", col("wedding-guest"), look(3))],
      },
      {
        key: "women-fabrics",
        ...link("Fabrics", col("fabrics")),
        children: [
          link("Chanderi", col("chanderi")),
          link("Organza", col("organza")),
          link("Silk", col("silk")),
          link("Tissue", col("tissue")),
          link("Cotton", col("cotton")),
          link("See all", col("fabrics")),
        ],
        overflow: [],
        cards: [
          card("Organza", col("organza"), ig(3)),
          card("Tissue", col("tissue"), ig(10)),
        ],
        mobileCards: [card("Organza", col("organza"), ig(3))],
      },
      {
        key: "women-made-by",
        ...link("Made by Maliha", col("made-by-maliha")),
        children: [],
        overflow: [],
        cards: [
          card("Made by Maliha - Offer", col("made-by-maliha"), ig(5)),
          card("See the full collection", col("made-by-maliha"), ig(6)),
        ],
      },
      {
        key: "women-edits",
        ...link("Edits", col("edits")),
        children: [
          link("In Celebration", col("in-celebration")),
          link("In Evening", col("in-evening")),
          link("In Ease", col("in-ease")),
          link("The Festive Edit", col("festive-edit")),
          link("Bestsellers", col("bestsellers")),
          link("The Lilac Edit", col("lilac-edit")),
        ],
        overflow: [],
        cards: [
          card("In Celebration", col("in-celebration"), ig(8)),
          card("In Ease", col("in-ease"), look(28)),
        ],
        mobileCards: [
          card("In Celebration", col("in-celebration"), ig(8)),
          card("In Evening", col("in-evening"), look(29)),
          card("In Ease", col("in-ease"), look(28)),
          card("The Lilac Edit", col("lilac-edit"), ig(7)),
        ],
      },
      {
        key: "women-inspiration",
        ...link("Inspiration", "/blogs/inspiration"),
        children: [],
        overflow: [],
        cards: [
          card("How to style a dupatta", "/blogs/inspiration/styling-dupattas", ig(3)),
          card("The festive colour guide", "/blogs/inspiration/festive-colours", look(24)),
        ],
      },
    ],
  },
  {
    key: "lookbook",
    label: "Lookbook",
    href: "/lookbook",
    featured: [
      link("SS21 Lookbook", "/lookbook"),
      link("The Festive Edit", col("festive-edit")),
      link("Shop the look", col("lookbook")),
    ],
    rootCards: [
      card("The SS21 Lookbook", "/lookbook", look(15)),
      card("Shop the look", col("lookbook"), look(30)),
    ],
    mobileRootCards: [card("The SS21 Lookbook", "/lookbook", look(15))],
    second: [
      {
        key: "lookbook-chapters",
        ...link("Chapters", "/lookbook"),
        children: [
          link("Wine & Maroon", "/lookbook#wine"),
          link("Midnight Blues", "/lookbook#midnight"),
          link("Rani & Coral", "/lookbook#rani"),
          link("Marigold", "/lookbook#marigold"),
          link("Peacock & Teal", "/lookbook#peacock"),
        ],
        overflow: [],
        cards: [
          card("Midnight Blues", "/lookbook#midnight", look(5)),
          card("Rani & Coral", "/lookbook#rani", look(19)),
        ],
        mobileCards: [card("Midnight Blues", "/lookbook#midnight", look(5))],
      },
      {
        key: "lookbook-campaign",
        ...link("The Campaign", "/lookbook"),
        children: [],
        overflow: [],
        cards: [
          card("The Atelier", "/pages/about-us", ig(2)),
          card("Behind the seams", "/blogs/inspiration/behind-the-seams", ig(4)),
        ],
      },
      {
        key: "lookbook-shop",
        ...link("Shop the Look", col("lookbook")),
        children: [],
        overflow: [],
        cards: [
          card("Maroon Chanderi Lehenga Set", "/products/maroon-chanderi-lehenga-set", look(3)),
          card("Magenta Angrakha Anarkali", "/products/magenta-angrakha-anarkali", look(30)),
        ],
      },
    ],
  },
  {
    key: "about",
    label: "About us",
    href: "/pages/about-us",
    featured: [],
    rootCards: aboutCards,
    mobileRootCards: aboutCards,
    second: [
      { key: "about-maliha", ...link("About Maliha", "/pages/about-us"), children: [], overflow: [], cards: aboutCards },
      { key: "about-founders", ...link("Anar & Anoli", "/pages/anar-and-anoli"), children: [], overflow: [], cards: aboutCards },
      { key: "about-craft", ...link("Our Craft", "/pages/our-craft"), children: [], overflow: [], cards: aboutCards },
      { key: "about-custom", ...link("Custom Orders", "/pages/custom-orders"), children: [], overflow: [], cards: aboutCards },
      { key: "about-contact", ...link("Contact", "/pages/contact"), children: [], overflow: [], cards: [] },
    ],
  },
];
