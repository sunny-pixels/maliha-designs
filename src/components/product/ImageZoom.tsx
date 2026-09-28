"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/data/products";
import { QUALITY } from "@/lib/images";
import { CloseIcon } from "@/components/ui/Icons";

type Props = {
  product: Product;
  /** Image to open at, or null when closed. */
  index: number | null;
  onClose: () => void;
};

/**
 * The theme's `CustomImageZoom`: a full-screen feed of every image, stacked
 * at 4:5, with a thumbnail rail on desktop. Opens scrolled to the clicked
 * image, locks page scroll and closes on Escape. Rendered into <body> (like
 * the original) so no ancestor clips the fixed overlay.
 */
export function ImageZoom({ product, index, onClose }: Props) {
  const open = index !== null;
  // Mount on first open only, so the full-size images aren't fetched up front.
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  if (open && !mounted) setMounted(true);

  // Fade in a frame after mounting so the CSS transition runs; jump to the image.
  useEffect(() => {
    if (!mounted || index === null) return;
    const opener = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => {
      setVisible(true);
      setActive(index);
      const target = mainRef.current?.querySelector<HTMLElement>(`[data-zoom-index="${index}"]`);
      if (mainRef.current && target) mainRef.current.scrollTop = target.offsetTop;
      closeRef.current?.focus({ preventScroll: true });
    });

    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      setVisible(false);
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [mounted, index, onClose]);

  // Highlight the thumbnail of the image nearest the top of the feed.
  const onScroll = () => {
    const main = mainRef.current;
    if (!main) return;
    const items = main.querySelectorAll<HTMLElement>("[data-zoom-index]");
    let nearest = 0;
    items.forEach((el, i) => {
      if (el.offsetTop - main.scrollTop <= main.clientHeight / 2) nearest = i;
    });
    setActive(nearest);
  };

  const scrollTo = (i: number) => {
    const target = mainRef.current?.querySelector<HTMLElement>(`[data-zoom-index="${i}"]`);
    mainRef.current?.scrollTo({ top: target?.offsetTop ?? 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  return createPortal(
    <div
      ref={mainRef}
      className="image-zoom__main"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} images`}
      aria-hidden={!visible}
      onScroll={onScroll}
    >
      <button ref={closeRef} type="button" className="image-zoom__close" aria-label="Close" onClick={onClose}>
        <CloseIcon />
      </button>
      <div className="image-zoom__thumbs">
        {product.images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`image-zoom__thumb ${i === active ? "image-zoom__thumb--active" : ""}`}
            data-action="zoom-to-image"
            aria-label={`Show image ${i + 1}`}
            aria-current={i === active}
            onClick={() => scrollTo(i)}
          >
            <Image className="image-zoom__thumb-image" src={src} alt="" width={99} height={124} sizes="99px" quality={QUALITY.tile} />
          </button>
        ))}
      </div>
      <div className="image-zoom__feed">
        {product.images.map((src, i) => (
          <div key={src} className="image-zoom__media" data-zoom-index={i}>
            <Image
              className="image-zoom__image"
              src={src}
              alt={i === 0 ? product.name : `${product.name} – view ${i + 1}`}
              width={1400}
              height={1750}
              sizes="100vw"
              quality={QUALITY.hero}
            />
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
}
