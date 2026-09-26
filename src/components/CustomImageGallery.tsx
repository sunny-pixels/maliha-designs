import Image from "next/image";
import Link from "next/link";
import { LongArrowRightIcon } from "@/components/ui/Icons";
import { blurProps, QUALITY } from "@/lib/images";
import { padVars, ratioVars, type Ratio, type Spacing } from "@/lib/sizing";

export type GalleryItem = { image: string; href: string; button?: string; focus?: string; alt?: string };

type Props = {
  items: GalleryItem[];
  ratio: Ratio;
  padding: Spacing;
  columns: { m: number; d: number };
};

const adjustment = { "--adjustment_m": "8px", "--adjustment_d": "8px" } as React.CSSProperties;

/** `section_custom_image_gallery`: image grid with a bottom-left tertiary button per tile. */
export function CustomImageGallery({ items, ratio, padding, columns }: Props) {
  return (
    <section className="shopify-section">
      <section className="custom-image-gallery colorGroup--primary">
        <div
          className="custom-image-gallery__wrapper animatedContent pad--responsive "
          data-animation="elementFadeIn"
          style={
            {
              ...padVars(padding),
              "--custom-image-gallery-columns-mobile": columns.m,
              "--custom-image-gallery-columns-desktop": columns.d,
            } as React.CSSProperties
          }
        >
          <div className="custom-image-gallery__grid">
            {items.map((item) => (
              <div key={item.image} className="custom-image-gallery__item">
                <Link href={item.href} className="custom-image-gallery__link" aria-label={item.button ?? item.alt}>
                  <div className="image__container ratio--responsive AspectRatio AspectRatio--withFallback " style={ratioVars(ratio)}>
                    <Image
                      className="image__element"
                      src={item.image}
                      {...blurProps(item.image)}
                      alt={item.alt ?? ""}
                      fill
                      sizes={`(min-width: 1025px) ${Math.round(100 / columns.d)}vw, ${Math.round(100 / columns.m)}vw`}
                      quality={QUALITY.tile}
                      style={{ objectPosition: item.focus ?? "50% 50%" }}
                    />
                  </div>
                </Link>
                {item.button && (
                  <div className="custom-image-gallery__content custom-image-gallery__layer hero-banner-txt-content__wrapper hero-banner-txt-content-layout-d__bottom-left hero-banner-txt-content-layout-m__bottom-left">
                    <div className="group-text-button__block-wrapper content-alignment--left ">
                      <Link href={item.href} className="Button Button--TertiaryOnDark adjustment" style={adjustment}>
                        <div className="ButtonTextContainer">
                          <span className="ButtonText ">
                            <span className="button-txt u-pb1">{item.button}</span>
                            <LongArrowRightIcon />
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
