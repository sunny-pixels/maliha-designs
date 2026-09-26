"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { Product } from "@/data/products";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { padVars, type Spacing } from "@/lib/sizing";
import { ProductCard } from "./ProductCard";

type Props = { products: Product[]; padding: Spacing };

/** `section_product_carousel`: 1.265 cards on mobile, 4 on desktop, rewinding, arrows below. */
export function ProductCarousel({ products, padding }: Props) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="shopify-section">
      <div className="product-carousel colorGroup--primary" style={{ position: "relative" }}>
        <div className="product-carousel__inner">
          <div
            className="product-carousel__section-wrapper pad--responsive sectionMax_width animatedContent"
            data-animation="elementFadeIn"
            style={padVars(padding)}
          >
            <div className="product-carousel__slider-wrapper">
              <Swiper
                className="product-carousel__swiper"
                modules={[Mousewheel]}
                slidesPerView={1.265}
                spaceBetween={6}
                slidesOffsetBefore={16}
                slidesOffsetAfter={16}
                rewind
                centerInsufficientSlides
                mousewheel={{ forceToAxis: true }}
                breakpoints={{ 1025: { slidesPerView: 4, spaceBetween: 16, slidesOffsetBefore: 0, slidesOffsetAfter: 0 } }}
                onSwiper={setSwiper}
              >
                {products.map((p) => (
                  <SwiperSlide key={p.slug} className="product-carousel__slide">
                    <ProductCard product={p} />
                  </SwiperSlide>
                ))}
                <div slot="container-end" className="pc__swiper-navigation">
                  <button
                    type="button"
                    aria-label="Previous products"
                    className="swiperButton swiperButtonPrevious not_mobile not_pocket"
                    onClick={() => swiper?.slidePrev()}
                  >
                    <ArrowLeftIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="Next products"
                    className="swiperButton swiperButtonNext not_mobile not_pocket"
                    onClick={() => swiper?.slideNext()}
                  >
                    <ArrowRightIcon />
                  </button>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
