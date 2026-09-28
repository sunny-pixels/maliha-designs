"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type DrawerName = "menu" | "search" | "cart" | "country";

type UIContextValue = {
  drawer: DrawerName | null;
  /**
   * True when one drawer replaced another directly (e.g. cart → search).
   * Each drawer is its own Base UI Dialog with its own backdrop, so
   * `SiteDrawer` swaps the two backdrops instantly in that case — the page
   * overlay then stays at a steady 40%, as the single shared overlay did.
   */
  switching: boolean;
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

type DrawerState = { drawer: DrawerName | null; switching: boolean };

const next = (cur: DrawerState, drawer: DrawerName | null): DrawerState => ({
  drawer,
  switching: cur.drawer !== null && drawer !== null && cur.drawer !== drawer,
});

/**
 * Holds which drawer is open, locks scrolling and keeps the layout CSS
 * variables the theme JS used to maintain (--announcement-dynamic-height,
 * --header-dynamic-height, --viewport-height). The drawers and their
 * overlay are Base UI Dialogs (see SiteDrawer).
 */
export function UIProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DrawerState>({ drawer: null, switching: false });
  const { drawer, switching } = state;

  const openDrawer = useCallback((name: DrawerName) => setState((cur) => next(cur, name)), []);
  const closeDrawer = useCallback(() => setState((cur) => next(cur, null)), []);
  const toggleDrawer = useCallback(
    (name: DrawerName) => setState((cur) => next(cur, cur.drawer === name ? null : name)),
    [],
  );

  // Scroll lock. The dialogs use `modal="trap-focus"` (so the header stays
  // clickable), which doesn't lock scrolling on its own.
  useEffect(() => {
    document.documentElement.style.overflow = drawer !== null ? "hidden" : "";
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
    () => ({ drawer, switching, openDrawer, toggleDrawer, closeDrawer }),
    [drawer, switching, openDrawer, toggleDrawer, closeDrawer],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
