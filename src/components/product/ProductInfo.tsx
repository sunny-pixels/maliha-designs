"use client";

import Image from "next/image";
import Link from "@/components/ui/SiteLink";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import { colorVariants, formatPrice, productHref, type Product } from "@/data/products";
import { blurProps, QUALITY } from "@/lib/images";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowDownIcon, ArrowRightIcon, CheckIcon, SizeIcon } from "@/components/ui/Icons";
import { FavoriteButton } from "./FavoriteButton";

export type AtcState = "select-size" | "default" | "adding" | "added";

const ATC_LABELS: Record<AtcState, string> = {
  default: "Add to bag",
  "select-size": "Select size",
  adding: "Adding to bag",
  added: "Added",
};

/** Every label is rendered; the theme CSS shows the one matching `data-atc-state`. */
export function AtcText() {
  return (
    <span className="SelfAlign pm__atc-text">
      {(Object.keys(ATC_LABELS) as AtcState[]).map((state) => (
        <span key={state} className="pm__atc-text-state u-pb1" data-atc-text-state={state}>
          {ATC_LABELS[state]}
        </span>
      ))}
    </span>
  );
}

const USPS = ["Free shipping across India", "Easy size exchanges within 7 days", "Handcrafted in small batches"];

/** `breadcrumbs`: Women › Clothing › category (the last two stay inert until collections exist). */
export function Breadcrumbs({ product }: { product: Product }) {
  const crumbs = [
    { label: "Women", href: "/women" },
    { label: "Clothing", href: "/collections/clothing" },
    { label: product.category.label, href: `/collections/${product.category.slug}` },
  ];
  return (
    <div className="breadcrumbs--wrapper">
      <nav className="breadcrumbs" aria-label="breadcrumbs">
        <ol className="breadcrumbs__list">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return [
              <li key={c.label} className="breadcrumbs__item">
                <Link
                  className={`breadcrumbs__link u-p3 ${last ? "" : "hot-spot-mini"}`}
                  href={c.href}
                  aria-current={last ? "page" : undefined}
                >
                  {c.label}
                </Link>
              </li>,
              !last && (
                <li key={`${c.label}-divider`} className="breadcrumbs__item breadcrumbs__item--divider" aria-hidden="true">
                  <span className="breadcrumbs--break u-p3">
                    <ArrowRightIcon />
                  </span>
                </li>
              ),
            ];
          })}
        </ol>
      </nav>
    </div>
  );
}

/**
 * `.quick-add__colors-wrapper`. For a design with colour variants each swatch
 * opens that colour's page, keeping the scroll position (as the theme swaps
 * the product in place); otherwise the product's colours are shown only.
 */
function ColourSwatches({ product }: { product: Product }) {
  const id = useId();
  const router = useRouter();
  const variants = colorVariants(product);

  useEffect(() => {
    variants.forEach((v) => v.slug !== product.slug && router.prefetch(productHref(v.slug)));
  }, [variants, product.slug, router]);

  const swatches =
    variants.length > 1
      ? variants.map((v) => ({ key: v.slug, colour: v.colors[0], current: v.slug === product.slug, slug: v.slug }))
      : product.colors.map((c, i) => ({ key: c.name, colour: c, current: i === 0, slug: null }));

  return (
    <div className="pc__color-wrapper" role="radiogroup" aria-label="Colour">
      {swatches.map((s, i) => (
        <div key={s.key} className="pc__color-selector">
          <input
            type="radio"
            className="pc__color-checkbox VisuallyHidden"
            name={`${id}-color`}
            id={`${id}-color-${i}`}
            checked={s.current}
            // Colours without their own page can't be chosen yet.
            disabled={!s.current && !s.slug}
            onChange={() => s.slug && router.push(productHref(s.slug), { scroll: false })}
          />
          <label
            htmlFor={`${id}-color-${i}`}
            className="pc__color-selector-label"
            style={{ "--pc__color": s.colour.hex } as React.CSSProperties}
            title={s.colour.name}
          >
            <span className="VisuallyHidden">{s.colour.name}</span>
          </label>
        </div>
      ))}
    </div>
  );
}

/** One `pm__faq-dropdown`, height-animated like the footer accordions. */
function FaqDropdown({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const el = contentRef.current;
      if (!el) return;
      if (first.current) {
        first.current = false;
        return;
      }
      gsap.killTweensOf(el);
      if (open) {
        gsap.fromTo(el, { height: 0 }, { height: "auto", duration: 0.25, ease: "power1.inOut", clearProps: "height" });
      } else {
        // The closed CSS state hides the content at once; keep it visible while it collapses.
        gsap.fromTo(
          el,
          { height: el.scrollHeight, visibility: "visible" },
          { height: 0, duration: 0.25, ease: "power1.inOut", clearProps: "height,visibility" },
        );
      }
    },
    { dependencies: [open] },
  );

  return (
    <div className="Dropdown Dropdown--Animate pm__dropdown pm__faq-dropdown">
      <button type="button" className="Dropdown--Button pm__faq-dropdown-button" aria-expanded={open} onClick={onToggle}>
        <span className="Dropdown--Arrow" aria-hidden="true">
          <ArrowDownIcon />
        </span>
        <span className="u-s2">{label}</span>
      </button>
      <div ref={contentRef} className="Dropdown--Content pm__faq-dropdown-content" aria-hidden={!open}>
        <div className="DropdownContent__Inner pm__faq-dropdown-inner">{children}</div>
      </div>
    </div>
  );
}

/** `pdp-upsell` ("Pair it with"): four 4:5 tiles; on desktop the heading shows the hovered product. */
function PairWith({ products }: { products: Product[] }) {
  const [hovered, setHovered] = useState<Product | null>(null);
  if (!products.length) return null;

  return (
    <pdp-upsell className="product-recommendation pm-upsell pm-upsell--recommendations">
      <div className="pm-upsell__section-wrapper">
        <div className="pm-upsell__header">
          <p className="pm-upsell__heading u-h2" hidden={hovered !== null}>
            Pair it with
          </p>
          <div className="pm-upsell__hover-meta not_mobile not_pocket" hidden={hovered === null}>
            <p className="pm-upsell__hover-title u-h2">{hovered?.name}</p>
            <div className="pm-upsell__hover-price u-s2">
              <span className="pm-upsell__hover-price-current">{hovered && formatPrice(hovered.price)}</span>
            </div>
          </div>
        </div>
        <div className="pm-upsell__carousels">
          <Swiper
            modules={[Mousewheel]}
            slidesPerView={4}
            spaceBetween={6}
            slidesOffsetBefore={10}
            slidesOffsetAfter={10}
            mousewheel={{ forceToAxis: true }}
            breakpoints={{ 1025: { slidesOffsetBefore: 0, slidesOffsetAfter: 0 } }}
            wrapperClass="swiper-wrapper pm-upsell__swiper-wrapper"
          >
            {products.map((p) => (
              <SwiperSlide
                key={p.slug}
                className="pm-upsell__slide"
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="pdp-upsell-pc">
                  <Link href={productHref(p.slug)} className="pdp-upsell-pc__trigger" aria-label={`${p.name}, ${formatPrice(p.price)}`}>
                    <div className="AspectRatio pdp-upsell-pc__media" style={{ "--aspect-ratio": "4/5" } as React.CSSProperties}>
                      <Image
                        className="product-card__image pdp-upsell-pc__image"
                        src={p.images[0]}
                        {...blurProps(p.images[0])}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1025px) 120px, 25vw"
                        quality={QUALITY.tile}
                        style={{ objectPosition: "50% 20%" }}
                      />
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </pdp-upsell>
  );
}

type Props = {
  product: Product;
  pairs: Product[];
  size: string | null;
  onSize: (size: string) => void;
  atcState: AtcState;
  onAdd: () => void;
  favorite: boolean;
  onToggleFavorite: () => void;
};

/** `.pm__information`: the sticky right-hand column of the product module. */
export function ProductInfo({ product, pairs, size, onSize, atcState, onAdd, favorite, onToggleFavorite }: Props) {
  const id = useId();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (i: number) => setOpenFaq((cur) => (cur === i ? null : i));
  const sizeIndex = product.sizes.findIndex((s) => s.label === size);
  const articleNo = sizeIndex < 0 ? product.articleNo : `${product.articleNo}-${String(sizeIndex + 1).padStart(2, "0")}`;

  return (
    <>
      <div className="shopify-block pm__information">
        <div className="pm__breadcrumbs-row not_mobile not_pocket" data-pm-hidden="">
          <Breadcrumbs product={product} />
          <FavoriteButton variant="breadcrumbs" active={favorite} onToggle={onToggleFavorite} />
        </div>

        <div className="pm__title" data-pm-sticky="">
          <div className="pm__title-meta">
            <h1 className="u-h2 pm__product-title">{product.name}</h1>
          </div>
          <div className="ProductInfo--Prices" aria-live="polite" aria-atomic="true">
            <div className="pc__price-wrapper pm__price-wrapper">
              <span className="price-item price-item--regular u-h2">{formatPrice(product.price)}</span>
            </div>
          </div>
        </div>

        <div className="pm__lowest-price-stock-wrapper" data-pm-hidden="" />

        <div className="quick-add__colors-wrapper" data-pm-sticky="">
          <ColourSwatches product={product} />
        </div>

        <div className="pm__size-guide-fit-wrapper" data-pm-sticky="" id={`${id}-sizes`}>
          <div className="pm__size-guide-fit-wrapper-content">
            <variant-selects className="product-variants__block">
              <div className="VariantSelectors">
                <variant-selectbox>
                  <div className="VariantSelect VariantSelect--size" role="radiogroup" aria-label="Size">
                    <div className="SelectBox--Wrapper">
                      {product.sizes.map((s, i) => (
                        <div key={s.label} className="Selectbox u-p3 textCapitalize">
                          <input
                            type="radio"
                            className="inputSelectboxCheckbox"
                            name={`${id}-size`}
                            value={s.label}
                            id={`${id}-size-${i}`}
                            checked={size === s.label}
                            disabled={!s.available}
                            onChange={() => onSize(s.label)}
                          />
                          <label
                            htmlFor={`${id}-size-${i}`}
                            className={`SelectboxLabelNormal u-p3 ${s.available ? "" : "SelectboxLabelNormal--disabled"}`}
                          >
                            {s.label}
                            {!s.available && <span className="VisuallyHidden"> (sold out)</span>}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </variant-selectbox>
              </div>
            </variant-selects>
          </div>
        </div>

        <div className="pm__size-note-wrapper" data-pm-hidden="">
          <SizeIcon />
          <div className="pm__size-note-wrapper-content">
            <p className="pm__size-note u-p3">
              {product.fitNote.split("\n").map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="pm__atc-form-wrapper" data-pm-sticky="">
          <form
            className="pm__atc-form"
            onSubmit={(e) => {
              e.preventDefault();
              onAdd();
            }}
          >
            <button
              type="submit"
              className="ProductPage--ATC pm__atc-button--main Button Button--PrimaryOnLight"
              data-atc-state={atcState}
              disabled={atcState === "select-size" || atcState === "adding"}
            >
              <AtcText />
            </button>
          </form>
        </div>

        <div className="pm__atc-form--sticky" />

        <pdp-usp-group className="pm__usp-group">
          <div className="pm__usp-group-items">
            {USPS.map((text) => (
              <div key={text} className="pm__usp-item">
                <span className="pm__usp-item-icon-svg" aria-hidden="true">
                  <CheckIcon />
                </span>
                <div className="rte u-p3">
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </pdp-usp-group>

        <div className="pm__product-description-wrapper" data-pm-hidden="">
          <div className="pm__product-description-content rte u-p3">
            <p>{product.description}</p>
          </div>
        </div>

        <div className="pm__faq-group" data-pm-sticky="">
          <div className="pm__faq-group-inner">
            <FaqDropdown label="Product details" open={openFaq === 0} onToggle={() => toggleFaq(0)}>
              <div className="rte u-p2">
                <ul>
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="pm__faq-details-extras">
                <div className="pm__faq-details-extras-color">
                  <p className="pm__faq-details-extras-label u-s2">Colour</p>
                  <p className="pm__faq-details-extras-value u-p2">{product.colors.map((c) => c.name).join(" / ")}</p>
                </div>
                <p className="pm__faq-details-extras-article u-p3">
                  Article no. <span>{articleNo}</span>
                </p>
              </div>
            </FaqDropdown>
            <FaqDropdown label="Fabric & care" open={openFaq === 1} onToggle={() => toggleFaq(1)}>
              <div className="rte u-p2">
                <ul>
                  {product.fabricCare.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </FaqDropdown>
          </div>
        </div>
      </div>

      <div className="pm__upsell-sticky-parent">
        <div className="shopify-block">
          <PairWith products={pairs} />
        </div>
      </div>
    </>
  );
}
