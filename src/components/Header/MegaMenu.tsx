"use client";

import Image from "next/image";
import Link from "@/components/ui/SiteLink";
import { useRef, useState } from "react";
import type { NavCard, TopMenu } from "@/data/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { blurProps } from "@/lib/images";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { TertiaryButton } from "@/components/ui/TertiaryButton";

type Props = { menu: TopMenu; open: boolean; onClose: () => void };

/**
 * Desktop dropdown. Mirrors the theme's column logic:
 * - nothing hovered: `data-cols="2"` — second-level links + root cards
 * - item hovered: `data-cols="split"` — adds the third column, cards span 2
 * - item with overflow: `data-cols="4"` — adds the overflow column, one card
 * - third-level hover inside an overflow item hides the cards (theme quirk)
 */
export function MegaMenu({ menu, open, onClose }: Props) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [thirdHover, setThirdHover] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const active = menu.second.find((s) => s.key === activeKey) ?? null;
  const hasLinks = !!active && active.children.length > 0;
  const hasOverflow = !!active && active.overflow.length > 0;
  const cards: NavCard[] = active ? active.cards : menu.rootCards;
  const showCards = cards.length > 0 && !(hasOverflow && thirdHover);

  const cols = !active ? "2" : hasOverflow && !thirdHover ? "4" : "split";
  const thirdHidden = !active || (!hasLinks && cards.length === 0);

  // Reset to the root state whenever the dropdown closes.
  if (!open && (activeKey !== null || thirdHover)) {
    setActiveKey(null);
    setThirdHover(false);
  }

  const select = (key: string | null) => {
    setActiveKey(key);
    setThirdHover(false);
  };

  // Dropdown fade-in on open.
  useGSAP(
    () => {
      if (!open || !rootRef.current) return;
      gsap.fromTo(rootRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power1.out" });
      gsap.fromTo(
        ".desktop-menu__column--second > *",
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.02, ease: "power2.out" },
      );
    },
    { dependencies: [open], scope: rootRef },
  );

  // Third column + card swap when the hovered item changes.
  useGSAP(
    () => {
      if (!open) return;
      gsap.fromTo(
        ".desktop-menu__column--third .desktop-menu__link, .desktop-menu__column--pseudo-third .desktop-menu__link",
        { autoAlpha: 0, x: -6 },
        { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.012, ease: "power2.out" },
      );
      gsap.fromTo(
        ".desktop-menu__collection-card",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, stagger: 0.06, ease: "power1.out" },
      );
    },
    { dependencies: [activeKey], scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="colorGroup--primary desktop-menu__dropdown-wrapper"
      aria-label={menu.label}
      onMouseLeave={onClose}
    >
      <div className="desktop-menu__layout" role="menu" aria-label={menu.label} data-cols={cols}>
        <div className="desktop-menu__column desktop-menu__column--second" role="group">
          {menu.featured.length > 0 && (
            <div className="desktop-menu__featured-links">
              {menu.featured.map((f) => (
                <Link
                  key={f.label}
                  href={f.href}
                  className="desktop-menu__featured-link u-s2"
                  role="menuitem"
                  onMouseEnter={() => select(null)}
                >
                  <span className="u-s2">{f.label}</span>
                </Link>
              ))}
            </div>
          )}
          {menu.second.map((s) => {
            const branch = s.children.length > 0;
            return (
              <Link
                key={s.key}
                href={s.href}
                className={`desktop-menu__link desktop-menu__link--second ${
                  branch ? "desktop-menu__link--branch" : "desktop-menu__link--leaf"
                } ${s.key === activeKey ? "is-active" : ""}`}
                role="menuitem"
                aria-haspopup={branch || undefined}
                aria-expanded={s.key === activeKey}
                onMouseEnter={() => select(s.key)}
                onFocus={() => select(s.key)}
              >
                <span className="u-p2">{s.label}</span>
                {branch && (
                  <span className="desktop-menu__link-arrow" aria-hidden="true">
                    <ArrowRightIcon />
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="desktop-menu__column desktop-menu__column--third" role="group" hidden={thirdHidden}>
          {active && (
            <div className="desktop-menu__panel-list" key={active.key}>
              {active.children.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="desktop-menu__link desktop-menu__link--third desktop-menu__link--leaf"
                  role="menuitem"
                  onMouseEnter={() => hasOverflow && setThirdHover(true)}
                >
                  <span className="u-p2">{c.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="desktop-menu__column desktop-menu__column--pseudo-third" role="group" hidden={!hasOverflow}>
          {active && hasOverflow && (
            <div className="desktop-menu__panel-list" key={active.key}>
              {active.overflow.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="desktop-menu__link desktop-menu__link--third desktop-menu__link--leaf"
                  onMouseEnter={() => setThirdHover(true)}
                >
                  <span className="u-p2">{c.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="desktop-menu__column desktop-menu__column--collection" hidden={!showCards}>
          <div className="desktop-menu__collection-panel" key={activeKey ?? "root"}>
            {cards.map((c) => (
              <Link key={c.label} href={c.href} className="desktop-menu__collection-card" aria-label={c.label}>
                <Image src={c.img} {...blurProps(c.img)} alt="" aria-hidden="true" fill sizes="(min-width: 1025px) 25vw, 100vw" />
                <span className="desktop-menu__collection-content" aria-hidden="true">
                  <TertiaryButton label={c.label} textClass="u-p2" className="u-p2" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
