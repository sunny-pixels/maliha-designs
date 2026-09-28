"use client";

import Image from "next/image";
import Link from "@/components/ui/SiteLink";
import { useRef, useState } from "react";
import { brand } from "@/config/brand";
import { footerColumns, legalLinks, type FooterColumn } from "@/data/footer";
import { gsap, useGSAP } from "@/lib/gsap";
import { useUI } from "@/components/UIProvider";
import { ArrowDownIcon } from "@/components/ui/Icons";

const adj = (m: number, d: number) => ({ "--adjustment_m": `${m}px`, "--adjustment_d": `${d}px` }) as React.CSSProperties;

/** Mobile accordion; on desktop the theme CSS forces every column open. */
function FooterDropdown({ column }: { column: FooterColumn }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const el = contentRef.current;
      if (!el) return;
      if (first.current) {
        first.current = false;
        return;
      }
      gsap.killTweensOf(el);
      if (open) {
        gsap.fromTo(el, { height: 0 }, { height: "auto", visibility: "visible", duration: 0.25, ease: "power1.inOut" });
      } else {
        gsap.to(el, {
          height: 0,
          duration: 0.25,
          ease: "power1.inOut",
          onComplete: () => gsap.set(el, { clearProps: "visibility,height" }),
        });
      }
    },
    { dependencies: [open] },
  );

  return (
    <div className="Dropdown Dropdown--Animate custom__dropdown">
      <button
        type="button"
        className="Dropdown--Button custom__dropdown-button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="custom__dropdown-heading u-p2">{column.heading}</span>
        <span className="custom__dropdown-arrow not_desktop">
          <ArrowDownIcon />
        </span>
      </button>
      <div ref={contentRef} className="Dropdown--Content custom__dropdown-content" aria-hidden={!open}>
        <div className="custom__dropdown-inner-content">
          {column.links.map((l) => (
            <Link key={l.label} className="u-p2 hover-link link-underline" href={l.href}>
              {l.label}
            </Link>
          ))}
          {column.showContact && (
            <div className="custom__dropdown--text not_desktop">
              <div className="heading-block adjustment rte u-p3" style={adj(0, 0)}>
                <p>{brand.email}</p>
              </div>
              <div className="heading-block adjustment rte u-p3" style={adj(2, 8)}>
                <p>Phone: {brand.phone}</p>
              </div>
              <div className="heading-block adjustment rte u-p3" style={adj(2, 8)}>
                <p>Address: {brand.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const { openDrawer } = useUI();

  return (
    <div className="shopify-section shopify-section-group-footer-group">
      <footer className="footer colorGroup--primary animatedContent" data-animation="elementFadeIn">
        <footer-component id="main-footer" className="footer__wrapper ">
          <div className="footer__inner-wrapper paddingControl--footer sectionMax_width ">
            <div className="footer__content_wrapper">
              <div className="footer__top">
                <div className="footer-image__wrapper footer-image--custom-width ">
                  <Link className="footer-image__link" href="/">
                    <span className="VisuallyHidden">{brand.fullName}</span>
                    <div
                      className="footer-image__icon"
                      style={{ "--custom-width-mobile": "160px", "--custom-width-desktop": "200px" } as React.CSSProperties}
                    >
                      <Image
                        src={brand.footerLogo.src}
                        width={brand.footerLogo.width}
                        height={brand.footerLogo.height}
                        alt=""
                        unoptimized
                        style={{ height: "auto", objectPosition: "50% 50%" }}
                      />
                    </div>
                  </Link>
                </div>
              </div>

              <div className="footer__middle">
                <div className="links__dropdown-group">
                  {footerColumns.map((c) => (
                    <FooterDropdown key={c.heading} column={c} />
                  ))}
                </div>

                <div className="footer-socials__group">
                  <div className="footer-socials__text not_mobile not_pocket">
                    <div className="group-text-button__block-wrapper content-alignment--left ">
                      {/* Grid matches links__dropdown-group's 3 columns, so
                          Address lines up under "SHOP" like Mail does under
                          "ABOUT US" — not an arbitrary gap next to Mail. */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.25rem 1rem" }}>
                        <div className="heading-block adjustment rte u-p2" style={adj(0, 0)}>
                          <p>Mail: {brand.email}</p>
                        </div>
                        <div className="heading-block adjustment rte u-p2" style={adj(0, 0)}>
                          <p>Address: {brand.address}</p>
                        </div>
                      </div>
                      <div className="heading-block adjustment rte u-p2" style={adj(4, 4)}>
                        <p>Phone: {brand.phone}</p>
                      </div>
                    </div>
                  </div>
                  {brand.socials.map((s) => (
                    <div key={s.label} className="footer-socials__single">
                      <a href={s.href} target="_blank" rel="noreferrer" className="u-p4 link-underline">
                        {" "}
                        {s.label}{" "}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="footer__payment-wrapper">
              <div className="footer__payment-wrapper--desktop-left not_mobile not_pocket">
                <localization-selectors>
                  <div className="RevolutionSelectbox RevolutionSelectbox--Selectors localization-footer ">
                    <button
                      className="RevolutionSelectbox--Button localization-sel__btn"
                      type="button"
                      onClick={() => openDrawer("country")}
                    >
                      <div className="RevolutionSelectbox--Title RevolutionSelectbox--CurrencyDropdown">
                        <div className="headerSelectors--Button headerSelectors--Countrey">
                          <div className="headerSelectors--Item u-p4 ">
                            <span className="u-p4"> {brand.country} </span>
                            <span className="revolution-selectbox__arrow">
                              <ArrowDownIcon />
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </localization-selectors>
              </div>
              <div className="footer__payment-wrapper-top">
                <div className="footer__privacy-links">
                  <div className="footer-bottom-link__group">
                    {legalLinks.map((l) => (
                      <Link key={l.label} href={l.href} className="footer-bottom--link u-p4 link-underline">
                        {" "}
                        {l.label}{" "}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="footer__copyright">
                  <Link href="/" className="u-p4">
                    {" "}
                    COPYRIGHT © {new Date().getFullYear()} {brand.fullName.toUpperCase()}{" "}
                  </Link>
                </div>
              </div>
              <div className="footer__bottom-note u-p4"> HANDCRAFTED IN INDIA </div>
            </div>
          </div>
        </footer-component>
      </footer>
    </div>
  );
}
