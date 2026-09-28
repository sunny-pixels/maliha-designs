"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel, Navigation, Scrollbar } from "swiper/modules";
import { getProduct, type Product } from "@/data/products";
import { padVars } from "@/lib/sizing";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { ProductCard } from "./ProductCard";

const STORAGE_KEY = "maliha-recently-viewed";
const MAX_ITEMS = 10;

function readSlugs(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

/**
 * `recently-viewed`: records this product in localStorage and shows the
 * others the shopper opened before. Hidden when there's nothing to show.
 */
export function RecentlyViewed({ current }: { current: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  // Swiper needs the navigation/scrollbar elements before it initialises.
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  const [scrollbarEl, setScrollbarEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const previous = readSlugs().filter((s) => s !== current);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only storage after mount
    setProducts(previous.flatMap((s) => getProduct(s) ?? []));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([current, ...previous].slice(0, MAX_ITEMS)));
    } catch {
      // Storage blocked: nothing to remember.
    }
  }, [current]);

  if (!products.length) return null;

  return (
    <div className="shopify-section">
      <recently-viewed className="colorGroup--primary" role="region" aria-label="Recently viewed">
        <div className="recently-viewed__template pad--responsive" style={padVars({ m: [20, 20, 0], d: [48, 48, 40] })}>
          {/* Inner side padding for the title and arrows on mobile (the theme's --px-m). */}
          <div className="recently-viewed__wrapper sectionMax_width" style={{ "--px-m": "10px" } as React.CSSProperties}>
            <div className="recently-viewed__title content-alignment--left">
              <h2 className="u-h1">Recently viewed</h2>
            </div>
            <div className="recently-viewed__products">
              {prevEl && nextEl && scrollbarEl && (
                <Swiper
                  className="recently-viewed__swiper"
                  modules={[Navigation, Scrollbar, Mousewheel, Keyboard]}
                  slidesPerView={1.4}
                  spaceBetween={6}
                  slidesOffsetBefore={10}
                  slidesOffsetAfter={10}
                  keyboard={{ enabled: true }}
                  mousewheel={{ forceToAxis: true }}
                  navigation={{ prevEl, nextEl }}
                  scrollbar={{ el: scrollbarEl, draggable: true }}
                  breakpoints={{ 1025: { slidesPerView: 4, spaceBetween: 16, slidesOffsetBefore: 0, slidesOffsetAfter: 0 } }}
                >
                  {products.map((p) => (
                    <SwiperSlide key={p.slug} className="recently-viewed__slide">
                      <ProductCard product={p} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
              <div className="recently-viewed__swiper-pagination">
                <button
                  ref={setPrevEl}
                  type="button"
                  aria-label="Previous products"
                  className="swiperButton recently-viewed__swiper-button-previous not_mobile not_pocket"
                >
                  <ArrowLeftIcon />
                </button>
                <div className="recently-viewed__swiper-scrollbar-wrapper swiper-scrollbar-wrapper">
                  <div ref={setScrollbarEl} className="swiper-scrollbar" />
                </div>
                <button
                  ref={setNextEl}
                  type="button"
                  aria-label="Next products"
                  className="swiperButton recently-viewed__swiper-button-next not_mobile not_pocket"
                >
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </recently-viewed>
    </div>
  );
}
