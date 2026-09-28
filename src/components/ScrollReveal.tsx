"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, motion } from "@/lib/gsap";

/**
 * Replaces the theme's IntersectionObserver animations: every
 * `.animatedContent` fades in (opacity 0 → 1, 425ms) as it enters the
 * viewport, and showcase images settle from a slight zoom.
 *
 * Why an IntersectionObserver rather than ScrollTrigger: ScrollTrigger caches
 * each section's position when it's created. The product carousels start out
 * wrapped onto several rows until Swiper initialises, so the cached positions
 * were ~1400px too low and later sections only appeared after being scrolled
 * past. The observer reads live geometry, so layout shifts can't break it.
 *
 * Performance notes (measured with Chrome DevTools):
 * - A fast scroll fires many sections in one callback. Staggering them all
 *   left the last ones invisible for ~1.5s even though their images had
 *   loaded, so sections already scrolled past are shown at once and only
 *   on-screen ones are staggered, with a short gap.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  // Re-run per route: client navigation mounts new `.animatedContent` sections.
  // Ones already revealed (e.g. the footer) are marked and skipped.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".animatedContent:not([data-revealed])"));
    if (!targets.length) return;
    const markRevealed = (els: HTMLElement[]) => els.forEach((el) => (el.dataset.revealed = ""));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { opacity: 1 });
      markRevealed(targets);
      return;
    }

    const pending = new Set(targets);
    const showPassed = (passed: HTMLElement[]) => {
      if (!passed.length) return;
      passed.forEach((el) => {
        pending.delete(el);
        observer.unobserve(el);
      });
      markRevealed(passed);
      gsap.set(passed, { opacity: 1 });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen: HTMLElement[] = [];
        const passed: HTMLElement[] = [];
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) onScreen.push(el);
          else if (entry.boundingClientRect.bottom <= 0) passed.push(el);
        }
        showPassed(passed);
        if (!onScreen.length) return;
        onScreen.forEach((el) => {
          pending.delete(el);
          observer.unobserve(el);
        });
        markRevealed(onScreen);
        gsap.to(onScreen, {
          opacity: 1,
          duration: motion.duration,
          stagger: Math.min(motion.stagger, 0.4 / onScreen.length),
          ease: "none",
        });
        onScreen.forEach((el) => {
          const images = el.querySelectorAll(".collection-showcase__image-container");
          if (images.length) {
            gsap.fromTo(images, { scale: 1.04 }, { scale: 1, duration: motion.duration * 2.5, ease: "power2.out" });
          }
        });
      },
      // Same trigger line as before: when the top passes 92% of the viewport height.
      { rootMargin: "0px 0px -8% 0px" },
    );

    // A section that goes from below the viewport to above it in one frame
    // (jump to the end, anchor link) never "intersects", so the observer
    // stays silent. Catch those on scroll and show them straight away.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        showPassed([...pending].filter((el) => el.getBoundingClientRect().bottom <= 0));
      });
    };

    targets.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
