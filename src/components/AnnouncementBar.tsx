"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const messages = [
  { label: "Complimentary shipping across India on orders above ₹ 5,000", href: "/pages/shipping-returns" },
  { label: "The Festive Edit is here – handcrafted by Anar & Anoli", href: "/collections/festive-edit" },
];

/** Vertical fade carousel (10s per message) like the original swiper. */
export function AnnouncementBar() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>(".swiper-slide");
      if (slides.length < 2) return;
      gsap.set(slides.slice(1), { autoAlpha: 0 });
      const tl = gsap.timeline({ repeat: -1 });
      slides.forEach((slide, i) => {
        const next = slides[(i + 1) % slides.length];
        tl.to(slide, { autoAlpha: 0, y: -8, duration: 0.6 }, "+=10").fromTo(
          next,
          { autoAlpha: 0, y: 8 },
          // Don't apply the "from" state at build time — it would hide slide 1 immediately.
          { autoAlpha: 1, y: 0, duration: 0.6, immediateRender: false },
          "<",
        );
      });
    },
    { scope: ref },
  );

  return (
    <div className="shopify-section shopify-section-section-announcement_bar">
      <announcement-bar
        className="announcement-bar announcementBar colorGroup--secondary paddingControl--announcement"
        style={{ justifyContent: "center" }}
      >
        <div ref={ref} className="announcement-bar__swiper swiper">
          <div className="announcement-bar__inner swiper-wrapper" aria-live="off">
            {messages.map((m, i) => (
              <div
                key={m.label}
                className="swiper-slide heading-block adjustment rte u-p3"
                role="group"
                aria-label={`${i + 1} / ${messages.length}`}
                style={{
                  height: 28,
                  // Later messages start hidden in the server HTML so they never overlap before hydration.
                  ...(i > 0 && { position: "absolute", opacity: 0, visibility: "hidden" }),
                }}
              >
                <p>
                  <Link href={m.href} title={m.label}>
                    {m.label}
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </div>
      </announcement-bar>
    </div>
  );
}
