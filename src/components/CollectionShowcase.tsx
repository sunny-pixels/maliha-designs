import Image, { getImageProps } from "next/image";
import Link from "@/components/ui/SiteLink";
import { LongArrowRightIcon } from "@/components/ui/Icons";
import { blurProps, QUALITY } from "@/lib/images";
import { noPadding, padVars, ratioVars, type Ratio, type Spacing } from "@/lib/sizing";

export type ShowcaseItem = {
  /** Desktop image (also used on mobile unless `mobileImage` is set). */
  image: string;
  mobileImage?: string;
  href: string;
  title?: string;
  text?: string;
  button: string;
  /** CSS object-position for the crop, e.g. "50% 25%". */
  focus?: string;
};

type Props = {
  items: ShowcaseItem[];
  ratio: Ratio;
  alignment: "middleCenter" | "bottomLeft";
  padding?: Spacing;
  /** Render titles as <h1> (page hero) instead of <p>. */
  heading?: boolean;
  priority?: boolean;
};

const adjustment = { "--adjustment_m": "20px", "--adjustment_d": "20px" } as React.CSSProperties;

/**
 * Separate mobile/desktop crops in one `<picture>`, so the browser downloads
 * only the one it shows (two CSS-hidden `<Image priority>`s fetched both).
 * The mobile crop's `focus` is applied below the desktop breakpoint only.
 */
function ArtDirectedImage({
  mobile,
  desktop,
  desktopSizes,
  focus,
  quality,
  priority,
}: {
  mobile: string;
  desktop: string;
  desktopSizes: string;
  focus?: string;
  quality: number;
  priority?: boolean;
}) {
  const common = { alt: "", fill: true, quality, priority };
  const { props: desktopProps } = getImageProps({ ...common, src: desktop, sizes: desktopSizes });
  const { props: mobileProps } = getImageProps({ ...common, ...blurProps(mobile), src: mobile, sizes: "100vw" });

  return (
    <picture>
      <source media="(min-width: 1025px)" srcSet={desktopProps.srcSet} sizes={desktopSizes} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- props (incl. alt) come from getImageProps */}
      <img
        {...mobileProps}
        fetchPriority={priority ? "high" : mobileProps.fetchPriority}
        className="image__element image__element--art"
        style={{ ...mobileProps.style, "--focus-m": focus ?? "50% 50%" } as React.CSSProperties}
      />
    </picture>
  );
}

/** `section_collection_showcase`: full-bleed image tiles in an auto-fit grid with a tertiary button. */
export function CollectionShowcase({ items, ratio, alignment, padding = noPadding, heading, priority }: Props) {
  const quality = priority ? QUALITY.hero : QUALITY.tile;
  const desktopSizes = items.length > 1 ? `(min-width: 1025px) ${Math.round(100 / items.length)}vw, 100vw` : "100vw";

  return (
    <div className="shopify-section collection-showcase--grid">
      <div className="collection-showcase animatedContent" data-animation="elementFadeIn">
        <div className="collection-showcase__colors colorGroup--primary pad--responsive" style={padVars(padding)}>
          <div className="collection-showcase__wrapper ">
            <div className="swiper-wrapper collection-showcase__image-outer-wrapper">
              {items.map((item) => (
                <div key={item.href + item.button} className="swiper-slide collection-showcase__image-wrapper">
                  <div className="collection-showcase__image-container">
                    <div
                      className="image__container ratio--responsive AspectRatio AspectRatio--withFallback "
                      style={ratioVars(ratio)}
                    >
                      {item.mobileImage ? (
                        <ArtDirectedImage
                          mobile={item.mobileImage}
                          desktop={item.image}
                          desktopSizes={desktopSizes}
                          focus={item.focus}
                          quality={quality}
                          priority={priority}
                        />
                      ) : (
                        <Image
                          className="image__element"
                          src={item.image}
                          {...blurProps(item.image)}
                          alt=""
                          fill
                          sizes={desktopSizes}
                          quality={quality}
                          priority={priority}
                          style={{ objectPosition: item.focus ?? "50% 50%" }}
                        />
                      )}
                    </div>
                  </div>
                  <Link className="collection-showcase__item-link" href={item.href} aria-label={item.title ?? item.button} />
                  <div className={`collection-showcase__content-wrapper collection-content-alignment--${alignment}`}>
                    <div className="collection-showcase__title rte u-h1">
                      {heading ? <h1>{item.title}</h1> : <p>{item.title}</p>}
                    </div>
                    {item.text && (
                      <div className="collection-showcase__text rte u-p2">
                        <p>{item.text}</p>
                      </div>
                    )}
                    <div className="collection-showcase__button-wrapper">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
