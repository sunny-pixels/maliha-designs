"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useUI, type DrawerName } from "@/components/UIProvider";

type Props = {
  name: DrawerName;
  side: "left" | "right";
  /** The theme's element for this drawer (e.g. `<cart-drawer />`); its tag and CSS hooks are kept. */
  render: React.ReactElement;
  id: string;
  className: string;
  style?: React.CSSProperties;
  initialFocus?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
};

/**
 * A theme drawer as a Base UI Dialog: focus trap, Escape to close, focus
 * returned to the trigger, and open/close animated with CSS transitions on
 * `data-starting-style` / `data-ending-style` (see base-ui.css) instead of
 * GSAP — same slide, fade, timing and easing as before.
 *
 * - `modal="trap-focus"`: traps focus but leaves the header clickable, so
 *   the header icons can still switch drawers (cart → search) as before.
 * - `disablePointerDismissal`: an outside press would close the drawer on
 *   pointerdown, then the header icon's click would reopen it. The backdrop
 *   closes it instead, as the old overlay did.
 * - `aria-expanded` mirrors the real open state, because theme CSS reads it
 *   (`body:has(... [aria-expanded=true])` for the overlay clip, header
 *   stacking and the search-button indicator); base-ui.css stops it from
 *   hiding the drawer mid-exit.
 */
export function SiteDrawer({ name, side, render, id, className, style, initialFocus, children }: Props) {
  const { drawer, switching, closeDrawer } = useUI();
  const open = drawer === name;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeDrawer();
      }}
      modal="trap-focus"
      disablePointerDismissal
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          className={`pageOverlay site-backdrop${switching ? " site-backdrop--instant" : ""}`}
          onClick={closeDrawer}
        />
        <Dialog.Popup
          render={render}
          id={id}
          className={`${className} site-drawer site-drawer--${side}`}
          style={style}
          // Passed as a boolean, exactly as the pre-Base UI markup did. Note
          // React writes `true` on a custom element (`<cart-drawer>`) as an
          // empty attribute, so the theme's `[aria-expanded=true]` rules only
          // ever matched the country drawer (a plain <div>) — kept that way
          // on purpose so the overlay/header stacking look unchanged.
          aria-expanded={open}
          initialFocus={initialFocus}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
