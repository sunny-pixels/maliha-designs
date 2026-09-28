"use client";

import Link from "@/components/ui/SiteLink";
import { useCallback, useEffect, useRef, useState, ViewTransition } from "react";
import { useUI } from "@/components/UIProvider";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, type Product } from "@/data/products";
import { colourFade } from "@/lib/transitions";
import { ImageZoom } from "./ImageZoom";
import { ProductGallery } from "./ProductGallery";
import { AtcText, Breadcrumbs, ProductInfo, type AtcState } from "./ProductInfo";

const ADDING_MS = 400;
const ADDED_MS = 3000;

/**
 * The theme's `setPmStickyVariables`: on desktop the info column pins its
 * `[data-pm-sticky]` blocks one under another while `[data-pm-hidden]`
 * blocks scroll away. The CSS needs every block's measured height.
 */
function usePmStickyVariables(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const inner = ref.current;
    if (!inner) return;
    const hidden = Array.from(inner.querySelectorAll<HTMLElement>("[data-pm-hidden]"));
    const sticky = Array.from(inner.querySelectorAll<HTMLElement>("[data-pm-sticky]")).filter(
      (el) => !el.closest(".pm__upsell-sticky-parent"),
    );
    const outer = (el: HTMLElement) => {
      const cs = getComputedStyle(el);
      return el.getBoundingClientRect().height + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
    };
    const setHidden = () => {
      const total = hidden.reduce((sum, el) => sum + outer(el), 0);
      inner.style.setProperty("--pm-sticky-hidden-height", `${Math.ceil(total + 50)}px`);
    };
    const setSticky = (el: HTMLElement, i: number) =>
      inner.style.setProperty(`--pm-sticky-element-${i}`, `${Math.ceil(outer(el))}px`);

    setHidden();
    sticky.forEach(setSticky);

    const observers = [
      ...hidden.map((el) => {
        const ro = new ResizeObserver(setHidden);
        ro.observe(el);
        return ro;
      }),
      // The FAQ group grows with its accordions; like the theme, don't re-measure it.
      ...sticky.flatMap((el, i) => {
        if (el.classList.contains("pm__faq-group")) return [];
        const ro = new ResizeObserver(() => setSticky(el, i));
        ro.observe(el);
        return [ro];
      }),
    ];
    return () => observers.forEach((ro) => ro.disconnect());
  }, [ref]);
}

/**
 * Desktop-only fixed add-to-bag bar: shown once the product module has
 * scrolled up past the header, hidden again when the footer comes into view.
 */
function useStickyAtcVisible(moduleRef: React.RefObject<HTMLElement | null>) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1025px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = moduleRef.current;
      const footer = document.querySelector<HTMLElement>("footer-component");
      if (!el || !desktop.matches) return setShow(false);
      const header = document.getElementById("header")?.offsetHeight ?? 0;
      const nearFooter = footer ? window.innerHeight + window.scrollY >= document.body.offsetHeight - footer.offsetHeight : false;
      setShow(el.getBoundingClientRect().bottom <= header && !nearFooter);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [moduleRef]);

  return show;
}

type Props = { product: Product; pairs: Product[] };

/** `product-component.product-module` (`main-product` section): gallery, sticky info column, fixed ATC bar and zoom. */
export function ProductModule({ product, pairs }: Props) {
  const { openDrawer } = useUI();
  const { add } = useCart();
  const moduleRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  // A colour swatch being hovered: the gallery and title show it until the
  // pointer leaves the swatches (see ColourSwatches).
  const [preview, setPreview] = useState<Product | null>(null);
  const shown = preview ?? product;

  const [size, setSize] = useState<string | null>(null);
  const [atcState, setAtcState] = useState<AtcState>("select-size");
  const [favorite, setFavorite] = useState(false);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  usePmStickyVariables(innerRef);
  const showStickyAtc = useStickyAtcVisible(moduleRef);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const chooseSize = (label: string) => {
    setSize(label);
    setAtcState((cur) => (cur === "select-size" ? "default" : cur));
  };

  const addToBag = () => {
    if (!size || atcState === "adding") return;
    setAtcState("adding");
    timers.current.push(
      window.setTimeout(() => {
        add(product.slug, size);
        setAtcState("added");
        openDrawer("cart");
        timers.current.push(window.setTimeout(() => setAtcState("default"), ADDED_MS));
      }, ADDING_MS),
    );
  };

  // Sticky bar: without a size it scrolls back to the size picker instead of being dead.
  const stickyAdd = () => {
    if (size) return addToBag();
    const picker = moduleRef.current?.querySelector<HTMLElement>(".pm__size-guide-fit-wrapper");
    picker?.scrollIntoView({ behavior: "smooth", block: "center" });
    picker?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus({ preventScroll: true });
  };

  const closeZoom = useCallback(() => setZoomIndex(null), []);

  return (
    <product-component
      ref={moduleRef}
      className="product-module colorGroup--primary"
      style={{ "--pt-m": "0px", "--pi-m": "10px", "--pb-m": "30px", "--pt-d": "0px", "--pi-d": "40px", "--pb-d": "40px" } as React.CSSProperties}
    >
      <div className="pm__content sectionMax_width paddingControl--pdp">
        <div className="pm__content-wrapper">
          <div className="not_desktop">
            <Breadcrumbs product={product} />
          </div>
          {/* Keyed on the shown colour, so a swatch-hover preview crossfades. */}
          <ViewTransition key={shown.slug} name="pdp-gallery" share={colourFade} enter={colourFade} default="none">
            <ProductGallery
              product={shown}
              favorite={favorite}
              onToggleFavorite={() => setFavorite((v) => !v)}
              onZoom={setZoomIndex}
            />
          </ViewTransition>
          <div ref={innerRef} className="pm__content-inner">
            <ProductInfo
              product={product}
              pairs={pairs}
              size={size}
              onSize={chooseSize}
              atcState={atcState}
              onAdd={addToBag}
              favorite={favorite}
              onToggleFavorite={() => setFavorite((v) => !v)}
              shown={shown}
              onPreview={setPreview}
            />
          </div>
        </div>
      </div>

      <div className={`pm__sticky-atc pm__sticky-atc--mobile-off ${showStickyAtc ? "show" : ""}`} aria-hidden={!showStickyAtc}>
        <div className="pm__sticky-atc-container sectionMax_width">
          <div className="pm__sticky-product-info">
            <div className="pm__sticky-atc-desktop-meta not_mobile not_pocket">
              <p className="pm__sticky-atc-brand u-p3">
                <Link href="/women" tabIndex={showStickyAtc ? undefined : -1}>
                  {product.brand}
                </Link>
              </p>
              <p className="pm__sticky-atc-title u-p2">{product.name}</p>
              <div className="pm__sticky-atc-prices u-p3">
                <span className="pm__sticky-atc-price u-p3">{formatPrice(product.price)}</span>
              </div>
            </div>
            <button
              type="button"
              className="Button Button--PrimaryOnLight pm__atc-button--main-sticky"
              data-atc-state={atcState}
              disabled={atcState === "adding"}
              tabIndex={showStickyAtc ? undefined : -1}
              onClick={stickyAdd}
            >
              <AtcText />
            </button>
          </div>
        </div>
      </div>

      <ImageZoom product={product} index={zoomIndex} onClose={closeZoom} />
    </product-component>
  );
}
