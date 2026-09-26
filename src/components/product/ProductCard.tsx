"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { formatPrice, type Product } from "@/data/products";
import { ArrowLeftIcon, ArrowRightIcon, FavoritesFilledIcon, FavoritesIcon } from "@/components/ui/Icons";

const MAX_SIZES = 6;

function Sizes({ product }: { product: Product }) {
  const shown = product.sizes.slice(0, MAX_SIZES);
  const more = product.sizes.length - shown.length;
  return (
    <div className="pc__variants-wrapper">
      {shown.map((s) => (
        <button
          key={s.label}
          type="button"
          className={`pc__variant-size u-p3 ${s.available ? "" : "is-unavailable"}`}
          disabled={!s.available}
          onClick={(e) => e.preventDefault()}
        >
          {" "}
          {s.label}{" "}
        </button>
      ))}
      {more > 0 && (
        <button type="button" className="pc__variant-size pc__variant-size--more u-p3" onClick={(e) => e.preventDefault()}>
          {" "}
          +{more}{" "}
        </button>
      )}
    </div>
  );
}

/** Theme `product-card`: label, colour swatches, 4:5 image slider, brand, title, sizes and price. */
export function ProductCard({ product, sizes = "(min-width: 1025px) 25vw, 80vw" }: { product: Product; sizes?: string }) {
  const id = useId();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [slide, setSlide] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const multi = product.images.length > 1;

  const step = (e: React.MouseEvent, dir: -1 | 1) => {
    e.preventDefault();
    e.stopPropagation();
    if (dir < 0) swiper?.slidePrev();
    else swiper?.slideNext();
  };

  return (
    <product-card>
      <div className="colorGroup--primary" style={{ "--aspect-ratio": "4/5", height: "100%", position: "relative" } as React.CSSProperties}>
        <Link className="pc__wrapper-link" href={`/products/${product.slug}`}>
          <div className="card-product">
            {product.label && (
              <div className="ProductCard--LabelsHolder">
                <div className="Productcard--Label Label--Custom u-s3" style={{ color: "#231f20" }}>
                  {" "}
                  {product.label}{" "}
                </div>
              </div>
            )}
            <div className="not_mobile not_pocket">
              <div className="pc__color-wrapper">
                {product.colors.map((c, i) => (
                  <div key={c.name} className="pc__color-selector">
                    <input
                      type="radio"
                      className="pc__color-checkbox VisuallyHidden"
                      name={`product-color-${id}`}
                      id={`${id}-color-${i}`}
                      defaultChecked={i === 0}
                    />
                    <label
                      htmlFor={`${id}-color-${i}`}
                      className="pc__color-selector-label"
                      style={{ "--pc__color": c.hex } as React.CSSProperties}
                    >
                      <span className="VisuallyHidden">
                        {product.name} – {c.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Swiper
              className="pc__image__swiper"
              slidesPerView={1}
              spaceBetween={8}
              loop={multi}
              nested
              grabCursor
              breakpoints={{ 1025: { allowTouchMove: false, simulateTouch: false } }}
              onSwiper={setSwiper}
              onSlideChange={(s) => setSlide(s.realIndex)}
            >
              {product.images.map((src, i) => (
                <SwiperSlide key={src} className="AspectRatio" style={{ "--aspect-ratio": "4/5" } as React.CSSProperties}>
                  <Image
                    className="product-card__image"
                    src={src}
                    alt={product.name}
                    fill
                    sizes={sizes}
                    quality={90}
                    priority={false}
                    loading={i === 0 ? "eager" : "lazy"}
                    style={{ objectPosition: "50% 20%" }}
                  />
                </SwiperSlide>
              ))}
              {multi && (
                <>
                  <button
                    slot="container-end"
                    type="button"
                    aria-label="Previous image"
                    className="u-pb1 pc__swiper-button--prev swiperButton hot-spot-mini not_mobile not_pocket"
                    onClick={(e) => step(e, -1)}
                  >
                    <ArrowLeftIcon />
                  </button>
                  <button
                    slot="container-end"
                    type="button"
                    aria-label="Next image"
                    className="u-pb1 pc__swiper-button--next swiperButton hot-spot-mini not_mobile not_pocket"
                    onClick={(e) => step(e, 1)}
                  >
                    <ArrowRightIcon />
                  </button>
                  <div
                    slot="container-end"
                    className="pc__swiper-pagination swiper-pagination not_desktop swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"
                  >
                    {product.images.map((src, i) => (
                      <span
                        key={src}
                        className={`swiper-pagination-bullet ${i === slide ? "swiper-pagination-bullet-active" : ""}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </Swiper>
          </div>

          <div className="pc__information mt-m">
            <div className="pc__information__meta">
              <div className="pm__information__meta--top">
                <span className="pc__information__brand-name u-s2"> {product.brand} </span>
                <div className="pc__information__name-switcher">
                  <span className="pc__information__title pc__information__title--default u-p2"> {product.name} </span>
                  <div className="pc__information__title-variants">
                    <Sizes product={product} />
                  </div>
                </div>
              </div>
              <div className="pm__information__meta--bottom">
                <div className="pc__information__meta__price-color">
                  <div className="price">
                    <dl className="pc__price-wrapper">
                      <div className="priceRegular">
                        <dt>
                          <span className="VisuallyHidden VisuallyHidden--inline">Regular price</span>
                        </dt>
                        <dd>
                          <span className=" price-item price-item--regular u-s2 regular-price-color ">
                            {" "}
                            {formatPrice(product.price)}{" "}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="pc__information__meta__variants not_desktop">
                    <Sizes product={product} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
        <button
          type="button"
          className="product-card__favorites-container toggle-favorites hot-spot"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          onClick={() => setFavorite((v) => !v)}
        >
          <div className="empty-favorite" style={{ display: favorite ? "none" : "flex" }}>
            <FavoritesIcon />
          </div>
          <div className="solid-favorite" style={{ display: favorite ? "flex" : "none" }}>
            <FavoritesFilledIcon />
          </div>
        </button>
      </div>
    </product-card>
  );
}
