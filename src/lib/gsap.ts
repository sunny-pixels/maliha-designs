"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Timings from the original theme settings (animationDuration: 425ms,
// animationBetweenElements: 225ms, drawer transition 0.2s ease).
export const motion = {
  duration: 0.425,
  stagger: 0.225,
  drawer: 0.3,
};

export { gsap, ScrollTrigger, useGSAP };
