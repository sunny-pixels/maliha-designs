"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export type DrawerName = "menu" | "search" | "cart" | "country";

type UIContextValue = {
  drawer: DrawerName | null;
  openDrawer: (name: DrawerName) => void;
  toggleDrawer: (name: DrawerName) => void;
  closeDrawer: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

/**
 * Holds which drawer is open, drives the page overlay, locks scrolling and
 * keeps the layout CSS variables the theme JS used to maintain
 * (--announcement-dynamic-height, --header-dynamic-height, --viewport-height).
 */
export function UIProvider({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState<DrawerName | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const openDrawer = useCallback((name: DrawerName) => setDrawer(name), []);
  const closeDrawer = useCallback(() => setDrawer(null), []);
  const toggleDrawer = useCallback((name: DrawerName) => setDrawer((cur) => (cur === name ? null : name)), []);

  // Overlay fade + scroll lock + Escape to close.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const open = drawer !== null;

    gsap.killTweensOf(overlay);
    if (open) {
      gsap.set(overlay, { display: "block" });
      gsap.to(overlay, { opacity: 0.4, duration: 0.3, ease: "power1.inOut" });
    } else {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power1.inOut",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }

    document.documentElement.style.overflow = open ? "hidden" : "";

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(null);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  // Layout variables used by drawer positioning.
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const bar = document.querySelector<HTMLElement>(".announcement-bar");
      const header = document.querySelector<HTMLElement>("#header");
      const barVisible = bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
      root.style.setProperty("--announcement-dynamic-height", `${barVisible}px`);
      if (header) root.style.setProperty("--header-dynamic-height", `${header.offsetHeight}px`);
      root.style.setProperty("--viewport-height", `${window.innerHeight}px`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const value = useMemo(
    () => ({ drawer, openDrawer, toggleDrawer, closeDrawer }),
    [drawer, openDrawer, toggleDrawer, closeDrawer],
  );

  return (
    <UIContext.Provider value={value}>
      <div className="pageOverlay" ref={overlayRef} onClick={closeDrawer} />
      {children}
    </UIContext.Provider>
  );
}
