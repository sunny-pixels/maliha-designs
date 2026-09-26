"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { brand } from "@/config/brand";
import { navigation, type NavCard } from "@/data/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useUI } from "@/components/UIProvider";
import { useDrawerAnimation } from "@/components/drawers/useDrawerAnimation";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { TertiaryButton } from "@/components/ui/TertiaryButton";

function CollectionLinks({ cards, multi }: { cards: NavCard[]; multi?: boolean }) {
  if (cards.length === 0) return null;
  return (
    <div className={`mobile-menu__collection-links ${multi ? "mobile-menu__collection-links--multi" : ""}`}>
      {cards.map((c) => (
        <Link key={c.label} href={c.href} className="mobile-menu__collection-item">
          <div className="image__container AspectRatio AspectRatio--withFallback mobile-menu__collection-media">
            <Image className="main-menu__logo-image" src={c.img} alt="" fill sizes="50vw" />
          </div>
          <TertiaryButton label={c.label} textClass="u-p2" className="u-p2" />
        </Link>
      ))}
    </div>
  );
}

export function MobileMenu() {
  const { drawer, closeDrawer } = useUI();
  const open = drawer === "menu";
  const ref = useDrawerAnimation<HTMLElement>(open, "left");

  const [tab, setTab] = useState(navigation[0].key);
  const [sub, setSub] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [contactOpen, setContactOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const menu = navigation.find((m) => m.key === tab)!;
  const second = menu.second.find((s) => s.key === sub) ?? null;
  const level = second ? 2 : 1;

  const go = (next: string | null, dir: 1 | -1) => {
    setDirection(dir);
    setSub(next);
  };

  // Slide the level content in when the tab or level changes.
  useGSAP(
    () => {
      gsap.fromTo(
        ".mobile-menu__link-content",
        { autoAlpha: 0, x: 24 * direction },
        { autoAlpha: 1, x: 0, duration: 0.3, ease: "power2.out" },
      );
    },
    { dependencies: [tab, sub], scope: contentRef },
  );

  // Contact accordion.
  useGSAP(
    () => {
      const el = contactRef.current;
      if (!el) return;
      gsap.to(el, { height: contactOpen ? "auto" : 0, duration: 0.25, ease: "power1.inOut" });
    },
    { dependencies: [contactOpen, tab] },
  );

  return (
    <div className="shopify-section">
      <mobile-menu
        ref={ref}
        className="Drawer--wrapper Drawer--Left colorGroup--primary"
        id="mobile-menu-drawer"
        aria-expanded={open}
        style={{ display: "none" }}
      >
        <div className="mobile-menu__content">
          <div className="Drawer--Content" ref={contentRef}>
            <div className="mobile-menu__link-header" aria-hidden={level > 1}>
              {navigation.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className="mobile-menu__link-button u-p2"
                  aria-expanded={m.key === tab}
                  onClick={() => {
                    setDirection(1);
                    setTab(m.key);
                    setSub(null);
                    setContactOpen(false);
                  }}
                >
                  {" "}
                  {m.label}{" "}
                </button>
              ))}
            </div>

            <div className="mobile-menu__nav-header" aria-hidden={level === 1}>
              <button type="button" className="mobile-menu__back-btn" aria-label="Back" onClick={() => go(null, -1)}>
                <ArrowLeftIcon />
              </button>
              <div className="mobile-menu__nav-breadcrumb u-p2">
                <span className="u-p2">{menu.label}</span>
                <span className="mobile-menu__nav-separator">
                  <ArrowRightIcon />
                </span>
                <span className="mobile-menu__nav-child u-p2">{second?.label}</span>
              </div>
            </div>

            <div className="mobile-menu__link-content" aria-hidden={false} data-active-level={level}>
              <div className="mobile-menu__level mobile-menu__level--first">
                <div className="mobile-menu__level-content">
                  {menu.featured.length > 0 && (
                    <div className="mobile-menu__featured-links">
                      {menu.featured.map((f) => (
                        <Link key={f.label} href={f.href} className="mobile-menu__featured-link u-s2" onClick={closeDrawer}>
                          {" "}
                          {f.label}{" "}
                        </Link>
                      ))}
                    </div>
                  )}
                  {menu.second.map((s) =>
                    s.children.length > 0 ? (
                      <button key={s.key} type="button" className="mobile-menu__nav-link u-p2" onClick={() => go(s.key, 1)}>
                        <span className="u-p2">{s.label}</span>
                        <span className="mobile-menu__nav-icon">
                          <ArrowRightIcon />
                        </span>
                      </button>
                    ) : (
                      <Link key={s.key} href={s.href} className="mobile-menu__nav-link u-p2" onClick={closeDrawer}>
                        <span className="u-p2">{s.label}</span>
                      </Link>
                    ),
                  )}
                </div>
                <CollectionLinks cards={menu.mobileRootCards} multi={menu.mobileRootCards.length > 1} />
                <div className="Dropdown mobile-menu__contact-info-dropdown">
                  <button
                    type="button"
                    className="Dropdown--Button mobile-menu__contact-info-button"
                    aria-expanded={contactOpen}
                    onClick={() => setContactOpen((v) => !v)}
                  >
                    <span className="u-p2">Contact</span>
                    <span className="mobile-menu__contact-info-icon">
                      <ArrowDownIcon />
                    </span>
                  </button>
                  <div
                    ref={contactRef}
                    className="Dropdown--Content mobile-menu__contact-info-content"
                    aria-hidden={!contactOpen}
                    style={{ height: 0, visibility: "visible" }}
                  >
                    <div className="rte u-p2">
                      <p>
                        Email: {brand.email}
                        <br />
                        Phone: {brand.phone}
                        <br />
                        Address: {brand.address}
                      </p>
                    </div>
                  </div>
                </div>
                <Link className="mobile-menu__favorites-link u-p2" href="/pages/favorites" onClick={closeDrawer}>
                  <span className="mobile-menu__favorites-label">Favorites</span>
                  <span className="mobile-menu__favorites-count"></span>
                </Link>
              </div>

              {second && (
                <div className="mobile-menu__level mobile-menu__level--second" aria-hidden={false}>
                  <div className="mobile-menu__sublevel-links">
                    {[...second.children, ...second.overflow].map((c) => (
                      <Link key={c.label} href={c.href} className="mobile-menu__sublevel-link u-p2" onClick={closeDrawer}>
                        {" "}
                        {c.label}{" "}
                      </Link>
                    ))}
                  </div>
                  <CollectionLinks cards={second.mobileCards ?? second.cards} />
                </div>
              )}
            </div>

            <div className="Drawer--Footer">
              <Link href="/account/login" className="mobile-menu__login-btn u-p2" onClick={closeDrawer}>
                {" "}
                Log in{" "}
              </Link>
            </div>
          </div>
        </div>
      </mobile-menu>
    </div>
  );
}
