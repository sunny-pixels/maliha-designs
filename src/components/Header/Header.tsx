"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { brand } from "@/config/brand";
import { navigation } from "@/data/navigation";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useUI } from "@/components/UIProvider";
import { BarsIcon, CloseIcon, FavoritesIcon, SearchIcon, ShoppingBagIcon, UserIcon } from "@/components/ui/Icons";
import { MegaMenu } from "./MegaMenu";

function Logo({ variant }: { variant: "desktop" | "mobile" }) {
  const desktop = variant === "desktop";
  return (
    <div className={`header-logo-wrapper ${desktop ? "not_mobile not_pocket" : "not_desktop"}`}>
      <Link href="/" aria-label={brand.fullName}>
        <div className={`header-logo header-logo--main AspectRatio ${desktop ? "not_mobile not_pocket" : "not_desktop"}`}>
          <Image
            className="logo"
            src={brand.logo.src}
            alt=""
            fill
            priority
            sizes={desktop ? "100px" : "82px"}
            quality={90}
            style={{ objectPosition: "50% 50%" }}
          />
        </div>
      </Link>
    </div>
  );
}

export function Header() {
  const { drawer, toggleDrawer } = useUI();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // `Header--Scrolled` after 25px, same threshold as the theme.
  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 25,
      end: "max",
      onToggle: (self) => setScrolled(self.isActive),
    });
    return () => st.kill();
  });

  const menuOpen = drawer === "menu";

  return (
    <div className="shopify-section header--Sticky">
      <header
        id="header"
        ref={headerRef}
        className={`header Header--Bg colorGroup--primary Header--invert-text-color header--ready ${
          scrolled ? "Header--Scrolled" : ""
        }`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="header__wrapper sectionMax_width">
          <div className="header-link-list header-main-menu-items set-left">
            <ul className="not_mobile not_pocket header-menu-items flex noJSshow">
              {navigation.map((menu) => (
                // The theme CSS opens the dropdown via `.header-link-desk[aria-expanded=true]`.
                // eslint-disable-next-line jsx-a11y/role-supports-aria-props
                <li
                  key={menu.key}
                  className="header-link-desk"
                  aria-expanded={openMenu === menu.key}
                  onMouseEnter={() => setOpenMenu(menu.key)}
                  onFocus={() => setOpenMenu(menu.key)}
                >
                  <Link href={menu.href} className="hoverLinks u-p2 header-main-links hot-spot-mini">
                    {" "}
                    {menu.label}{" "}
                  </Link>
                  <MegaMenu menu={menu} open={openMenu === menu.key} onClose={() => setOpenMenu(null)} />
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`header-hamburger-btn header-mobile-btns-wrapper hot-spot-mini u-p3 not_desktop ${
                menuOpen ? "is-active" : ""
              }`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => toggleDrawer("menu")}
            >
              <span className="header-hamburger-icon">
                <BarsIcon />
              </span>
              <span className="header-close-icon">
                <CloseIcon />
              </span>
            </button>
            <button
              type="button"
              className="header-search-btn hot-spot-mini not_desktop"
              aria-label="Search"
              onClick={() => toggleDrawer("search")}
            >
              <SearchIcon />
            </button>
          </div>

          <Logo variant="desktop" />
          <Logo variant="mobile" />

          <span className="header-links__wrapper u-p2 set-right">
            <ul className="header-link-list set-right">
              <li className="header-link-item not_mobile not_pocket">
                <button
                  type="button"
                  className="header-search-btn u-p2 hot-spot-mini"
                  aria-label="Search"
                  onClick={() => toggleDrawer("search")}
                >
                  <SearchIcon />
                </button>
              </li>
              <li className="not_mobile not_pocket">
                <Link href="/pages/favorites" className="header__link-item fav-icon__wrapper" aria-label="Favorites">
                  <span className="header__favorites">
                    <FavoritesIcon />
                    <span className="header__item-count header__item-count--favorites" style={{ display: "none" }}>
                      0
                    </span>
                  </span>
                </Link>
              </li>
              <li className="header-link-item">
                <Link href="/account" className="header-acc-btn hot-spot-mini u-s2" aria-label="Account">
                  <UserIcon />
                </Link>
              </li>
              <li className="header-link-item">
                <button
                  type="button"
                  className="u-p3 header-cart-btn hot-spot-mini"
                  aria-label="Cart"
                  onClick={() => toggleDrawer("cart")}
                >
                  <ShoppingBagIcon />
                  <span className="header__item-count header__item-count--cart" style={{ display: "none" }}>
                    0
                  </span>
                </button>
              </li>
            </ul>
          </span>
        </div>
      </header>
    </div>
  );
}
