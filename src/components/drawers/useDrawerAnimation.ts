"use client";

import { useRef } from "react";
import { gsap, motion, useGSAP } from "@/lib/gsap";

/**
 * Slides a `.Drawer--wrapper` in/out with GSAP. The drawer starts with
 * `display: none` (as in the original markup) and is hidden again once
 * the closing tween finishes.
 */
export function useDrawerAnimation<T extends HTMLElement>(open: boolean, side: "left" | "right") {
  const ref = useRef<T>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const offscreen = side === "left" ? -106 : 106;

      if (first.current) {
        first.current = false;
        gsap.set(el, { xPercent: offscreen, autoAlpha: 0 });
        if (!open) return;
      }

      gsap.killTweensOf(el);
      if (open) {
        el.style.display = "";
        gsap.to(el, { xPercent: 0, autoAlpha: 1, duration: motion.drawer, ease: "power2.out" });
      } else {
        gsap.to(el, {
          xPercent: offscreen,
          autoAlpha: 0,
          duration: motion.drawer,
          ease: "power2.in",
          onComplete: () => {
            el.style.display = "none";
          },
        });
      }
    },
    { dependencies: [open], scope: ref },
  );

  return ref;
}
