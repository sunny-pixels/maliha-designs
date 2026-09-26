"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import type { Product } from "@/data/products";
import { gsap, useGSAP } from "@/lib/gsap";
import { blurProps, QUALITY } from "@/lib/images";
import { padVars, ratioVars, type Ratio, type Spacing } from "@/lib/sizing";
import { ArrowLeftIcon, ArrowRightIcon, LongArrowRightIcon } from "@/components/ui/Icons";
import { ProductCard } from "@/components/product/ProductCard";

type Hotspot = { x: number; y: number };

type Props = {
  title: string;
  text: string;
  button: { label: string; href: string };
  image: string;
  imageFocus?: string;
  ratio: Ratio;
  padding: Spacing;
  /** One hotspot per product, in the same order. */
  hotspots: Hotspot[];
  products: Product[];
};

const adj = (px: number) => ({ "--adjustment_m": `${px}px`, "--adjustment_d": `${px}px` }) as React.CSSProperties;

/** `section_lookbook`: editorial image with hotspots that drive a product slider. */
export function LookbookSection({ title, text, button, image, imageFocus, ratio, padding, hotspots, products }: Props) {
  const [active, setActive] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const select = (i: number) => {
    setActive(i);
    swiper?.slideTo(i);
  };

  // Soft pulse on the active hotspot's halo (the `--pulse` scale in inline.css).
  useGSAP(
    () => {
      const dot = ref.current?.querySelectorAll<HTMLElement>(".lookbook-hotspot")[active];
      if (!dot) return;
      const tween = gsap.fromTo(
        dot,
        { "--pulse": 1 },
        { "--pulse": 1.6, duration: 0.9, ease: "sine.inOut", repeat: -1, yoyo: true },
      );
      return () => {
        tween.kill();
        gsap.set(dot, { "--pulse": 1 });
      };
    },
    { dependencies: [active], scope: ref },
  );

  return (
    <div className="shopify-section">
      <section-lookbook className="section-lookbook colorGroup--primary">
        <div ref={ref} className="section-lookbook__template pad--responsive" style={padVars(padding)}>
          <div className="section-lookbook__wrapper sectionMax_width">
            <div className="section-lookbook__grid">
              <div className="section-lookbook__heading">
                <div className="group-text-button__block-wrapper content-alignment--left ">
                  <div className="heading-block adjustment rte u-h1" style={adj(20)}>
                    <h2>{title}</h2>
                  </div>
                  <div className="heading-block adjustment rte u-p2" style={adj(8)}>
                    <p>{text}</p>
                  </div>
                  <Link href={button.href} className="Button Button--TertiaryOnLight adjustment" style={adj(20)}>
                    <div className="ButtonTextContainer">
                      <span className="ButtonText ">
                        <span className="button-txt u-pb1">{button.label}</span>
                        <LongArrowRightIcon />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="section-lookbook__media">
                <div>
                  <div className="lookbook-image-hotspots__media AspectRatio AspectRatio--withFallback">
                    <div className="image__container ratio--responsive AspectRatio AspectRatio--withFallback " style={ratioVars(ratio)}>
                      <Image
                        className="image__element"
                        src={image}
                        {...blurProps(image)}
                        alt=""
                        fill
                        sizes="(min-width: 1025px) 50vw, 100vw"
                        quality={QUALITY.tile}
                        style={{ objectPosition: imageFocus ?? "50% 50%" }}
                      />
                    </div>
                    <div className="lookbook-image-hotspots__hotspots">
                      {hotspots.map((h, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`Show ${products[i]?.name}`}
                          className={`lookbook-hotspot ${i === active ? "is-active" : ""}`}
                          style={{ "--hotspot-x": `${h.x}%`, "--hotspot-y": `${h.y}%` } as React.CSSProperties}
                          onClick={() => select(i)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="section-lookbook__products">
                <div className="lookbook-product-slider">
                  <div className="lookbook-swiper__outer-wrapper">
                    <Swiper
                      className="lookbook-product-slider__swiper"
                      slidesPerView={1}
                      onSwiper={setSwiper}
                      onSlideChange={(s) => setActive(s.activeIndex)}
                    >
                      {products.map((p) => (
                        <SwiperSlide key={p.slug}>
                          <ProductCard product={p} sizes="(min-width: 1025px) 328px, 235px" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="swiper-navigation">
                      <button
                        type="button"
                        aria-label="Previous product"
                        className={`swiperButton swiperButtonPrevious not_mobile not_pocket ${active === 0 ? "swiper-button-disabled" : ""}`}
                        onClick={() => select(Math.max(0, active - 1))}
                      >
                        <ArrowLeftIcon />
                      </button>
                      <button
                        type="button"
                        aria-label="Next product"
                        className={`swiperButton swiperButtonNext not_mobile not_pocket ${
                          active === products.length - 1 ? "swiper-button-disabled" : ""
                        }`}
                        onClick={() => select(Math.min(products.length - 1, active + 1))}
                      >
                        <ArrowRightIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section-lookbook>
    </div>
  );
}
