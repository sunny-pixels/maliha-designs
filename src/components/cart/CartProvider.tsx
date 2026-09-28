"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "@/data/products";

export type CartLine = { slug: string; size: string; qty: number };
export type CartItem = CartLine & { product: Product };

type CartContextValue = {
  items: CartItem[];
  count: number;
  /** Subtotal in INR. */
  subtotal: number;
  add: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
};

const STORAGE_KEY = "maliha-cart";
/** Per line; the theme's quantity selector has no upper bound, so pick a sensible one. */
export const MAX_QTY = 10;

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

const sameLine = (l: CartLine, slug: string, size: string) => l.slug === slug && l.size === size;

/**
 * Browser-only cart (no checkout yet). Lines are kept in localStorage and
 * read after mount, so server and first client render agree (empty cart).
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off hydration from storage
      if (Array.isArray(saved)) setLines(saved.filter((l: CartLine) => getProduct(l.slug)));
    } catch {
      // Storage blocked or corrupt: start empty.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage full or blocked: the cart still works for this visit.
    }
  }, [lines, loaded]);

  const add = useCallback((slug: string, size: string) => {
    setLines((cur) =>
      cur.some((l) => sameLine(l, slug, size))
        ? cur.map((l) => (sameLine(l, slug, size) ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l))
        : [{ slug, size, qty: 1 }, ...cur],
    );
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setLines((cur) => cur.filter((l) => !sameLine(l, slug, size)));
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setLines((cur) =>
      qty < 1
        ? cur.filter((l) => !sameLine(l, slug, size))
        : cur.map((l) => (sameLine(l, slug, size) ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const value = useMemo(() => {
    const items = lines.flatMap((l) => {
      const product = getProduct(l.slug);
      return product ? [{ ...l, product }] : [];
    });
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.product.price, 0),
      add,
      setQty,
      remove,
    };
  }, [lines, add, setQty, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
