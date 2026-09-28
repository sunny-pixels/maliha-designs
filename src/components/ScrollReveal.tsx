"use client";

import { usePathname } from "next/navigation";
import { gsap, motion, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Replaces the theme's IntersectionObserver animations: every
 * `.animatedContent` fades in (opacity 0 → 1, 425ms) as it enters the
 * viewport, and showcase images settle from a slight zoom.
 *
 * Performance notes (measured with Chrome DevTools):
 * - A fast scroll fires many sections in one batch. Staggering the whole
 *   batch left the last sections invisible for ~1.5s even though their
 *   images had loaded, so sections already scrolled past are shown at once
 *   and only on-screen ones are staggered, with a short gap.
 * - Triggers are refreshed once web fonts are ready so start positions
 *   match the final layout.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  // Re-run per route: client navigation mounts new `.animatedContent` sections.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targets = gsap.utils.toArray<HTMLElement>(".animatedContent");

      if (reduce) {
        gsap.set(targets, { opacity: 1 });
        return;
      }

      ScrollTrigger.batch(targets, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => {
          const vh = window.innerHeight;
          const passed = batch.filter((el) => el.getBoundingClientRect().bottom < 0);
          const onScreen = batch.filter((el) => !passed.includes(el));

          // GSAP warns on empty targets, and one of these lists usually is.
          if (passed.length) gsap.set(passed, { opacity: 1 });
          if (onScreen.length) {
            gsap.to(onScreen, {
              opacity: 1,
              duration: motion.duration,
              stagger: Math.min(motion.stagger, 0.4 / onScreen.length),
              ease: "none",
            });
          }

          onScreen.forEach((el) => {
            const images = el.querySelectorAll(".collection-showcase__image-container");
            if (images.length && el.getBoundingClientRect().top < vh) {
              gsap.fromTo(images, { scale: 1.04 }, { scale: 1, duration: motion.duration * 2.5, ease: "power2.out" });
            }
          });
        },
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
