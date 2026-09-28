"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Swiper } from "swiper";
import { Mousewheel, Scrollbar } from "swiper/modules";
import type { Product } from "@/data/products";
import { blurProps, QUALITY } from "@/lib/images";
import { FavoriteButton } from "./FavoriteButton";

type Props = {
  product: Product;
  favorite: boolean;
  onToggleFavorite: () => void;
  onZoom: (index: number) => void;
};

/**
 * `swiper-init.pm__main-swiper[data-swiper-mobile]`: a one-up slider with a
 * scrollbar below 1025px, and a plain vertical stack of 4:5 images above it.
 * Swiper is only created on mobile and destroyed on desktop, like the theme.
 */
export function ProductGallery({ product, favorite, onToggleFavorite, onZoom }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 1024px)");
    let swiper: Swiper | null = null;

    const sync = () => {
      if (mq.matches && !swiper) {
        swiper = new Swiper(el, {
          modules: [Scrollbar, Mousewheel],
          slidesPerView: 1,
          spaceBetween: 2,
          mousewheel: { forceToAxis: true },
          scrollbar: { el: scrollbarRef.current, draggable: true },
        });
      } else if (!mq.matches && swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      swiper?.destroy(true, true);
    };
  }, []);

  return (
    <swiper-init ref={rootRef} className="pm__main-swiper swiper" data-swiper-mobile="">
      <div className="swiper-wrapper">
        {product.images.map((src, i) => (
          <div
            key={src}
            className="swiper-slide ProductSlider--Element AspectRatio ProductSliderCell--Zoom"
            style={{ "--aspect-ratio": "4/5" } as React.CSSProperties}
            data-index={i}
            data-media-type="image"
            data-action="open-product-zoom"
            role="button"
            tabIndex={0}
            aria-label={`Zoom image ${i + 1} of ${product.images.length}`}
            onClick={() => onZoom(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onZoom(i);
              }
            }}
          >
            <Image
              id={`Image--${product.slug}-${i}`}
              className={`ProductSlider--Image ${i === 0 ? "ProductSlider--ImageFirst" : ""}`}
              src={src}
              {...blurProps(src)}
              alt={i === 0 ? product.name : `${product.name} – view ${i + 1}`}
              fill
              sizes="(min-width: 1025px) 50vw, 100vw"
              quality={i === 0 ? QUALITY.hero : QUALITY.tile}
              priority={i === 0}
              style={{ objectPosition: "50% 20%" }}
            />
          </div>
        ))}
      </div>
      <div className="swiper-scrollbar-wrapper not_desktop">
        <div ref={scrollbarRef} className="swiper-scrollbar" />
      </div>
      <FavoriteButton variant="swiper" active={favorite} onToggle={onToggleFavorite} />
    </swiper-init>
  );
}
