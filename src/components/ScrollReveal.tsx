"use client";

import { usePathname } from "next/navigation";
import { gsap, motion, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Replaces the theme's IntersectionObserver animations: every
 * `.animatedContent` fades in (opacity 0 → 1, 425ms, 225ms between
 * elements) once 15% of it is in view. Showcase images also settle from
 * a slight zoom.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  // Re-run per route: client navigation mounts new `.animatedContent` sections.
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = gsap.utils.toArray<HTMLElement>(".animatedContent");

    if (reduce) {
      gsap.set(targets, { opacity: 1 });
      return;
    }

    ScrollTrigger.batch(targets, {
      start: "top 85%",
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, duration: motion.duration, stagger: motion.stagger, ease: "none" });
        batch.forEach((el) => {
          const images = el.querySelectorAll(".collection-showcase__image-container");
          if (images.length) {
            gsap.fromTo(
              images,
              { scale: 1.04 },
              { scale: 1, duration: motion.duration * 2.5, stagger: motion.stagger, ease: "power2.out" },
            );
          }
        });
      },
    });
  }, { dependencies: [pathname], revertOnUpdate: true });

  return null;
}
