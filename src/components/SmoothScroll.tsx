"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scroll, wired into GSAP's ticker exactly as the "GSAP
 * ScrollTrigger" setup in the Lenis README recommends:
 * https://github.com/darkroomengineering/lenis/blob/main/README.md#setup
 */
export function SmoothScroll() {
  useEffect(() => {
    // `anchors: true` so hash links (e.g. the Lookbook hero's "#looks")
    // keep smooth-scrolling now that native `scroll-behavior: smooth` is gone.
    // `lerp`/`wheelMultiplier` lowered from Lenis's defaults (0.1 / 1) for a
    // slower, heavier, more resistant scroll feel.
    const lenis = new Lenis({ anchors: true, lerp: 0.05, wheelMultiplier: 0.8 });

    // Synchronise Lenis scrolling with GSAP's ScrollTrigger plugin.
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker so
    // Lenis's smooth scroll animation updates on each GSAP tick.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return null;
}
