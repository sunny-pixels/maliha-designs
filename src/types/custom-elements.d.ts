import type { DetailedHTMLProps, HTMLAttributes } from "react";

// The theme CSS targets these custom element tag names directly, so the
// markup keeps them. React 19 renders them as plain unknown elements.
type CustomElement = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "announcement-bar": CustomElement;
      "mobile-menu": CustomElement;
      "search-bar": CustomElement;
      "cart-drawer": CustomElement;
      "footer-component": CustomElement;
      "localization-selectors": CustomElement;
      "localization-modal": CustomElement;
      "product-card": CustomElement;
      "section-lookbook": CustomElement;
    }
  }
}
