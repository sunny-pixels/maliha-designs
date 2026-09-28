"use client";

import LiquidGlassCursor from "./LiquidGlassCursor.js";

/**
 * Physically-modelled glass cursor (edge refraction, chromatic dispersion,
 * specular rim lighting, gel-like spring motion) — ported from a Framer code
 * component (see LiquidGlassCursor.js for what was stripped and why). Two
 * circular instances stand in for the site's earlier ring + inner-dot
 * design: a bigger, heavier outline that lags, and a smaller, snappier fill
 * riding inside it. Only the outer instance hides the native cursor
 * (`hideCursor`) — doing it on both would fight over the same attribute.
 */
export function Cursor() {
  return (
    <>
      <LiquidGlassCursor
        scope="page"
        shape="circle"
        size={65}
        fill="rgba(255, 255, 255, 0.06)"
        outline="rgba(0, 0, 0, 0.3)"
        outlineWidth={1}
        hideCursor
        motion={{ follow: 20, bounce: 0.3, stretch: 70 }}
      />
      {/* Inner dot — commented out for now so the outer ring can be seen on its own.
      <LiquidGlassCursor
        scope="page"
        shape="circle"
        size={16}
        fill="rgba(255, 255, 255, 0.6)"
        outline="rgba(255, 255, 255, 0.4)"
        outlineWidth={0.5}
        hideCursor={false}
        motion={{ follow: 6, bounce: 0.5 }}
      />
      */}
    </>
  );
}
