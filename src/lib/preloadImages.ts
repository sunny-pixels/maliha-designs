"use client";

import { getImageProps } from "next/image";

type Img = { src: string; sizes: string; quality: number };

const done = new Map<string, Promise<void>>();

/**
 * Downloads and decodes images exactly as a `next/image` `fill` element with
 * the same `src` / `sizes` / `quality` would request them (same srcset, so
 * the browser picks the same candidate), so the real <img> then paints from
 * cache with no decode delay.
 *
 * Used before a colour-change view transition: the browser snapshots the new
 * state as soon as React commits, and without this the snapshot caught the
 * blur placeholder — the crossfade blended into it and the real photo then
 * popped in afterwards. Resolves after at most `timeout` ms either way, so a
 * slow network degrades to the old instant swap rather than a laggy click.
 */
export function preloadImages(images: Img[], timeout = 600): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const loads = images.map(({ src, sizes, quality }) => {
    const key = `${src}|${sizes}|${quality}`;
    let p = done.get(key);
    if (!p) {
      const { props } = getImageProps({ src, alt: "", fill: true, sizes, quality });
      const img = new window.Image();
      // `sizes` before `srcset`, so the right candidate is chosen up front.
      if (props.sizes) img.sizes = props.sizes;
      if (props.srcSet) img.srcset = props.srcSet;
      img.src = props.src;
      p = img.decode().catch(() => {});
      done.set(key, p);
    }
    return p;
  });
  return Promise.race([Promise.all(loads).then(() => {}), new Promise<void>((r) => setTimeout(r, timeout))]);
}
