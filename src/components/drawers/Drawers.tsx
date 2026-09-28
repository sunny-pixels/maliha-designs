"use client";

import Image from "next/image";
import Link from "@/components/ui/SiteLink";
import { useRef, useState } from "react";
import { useUI } from "@/components/UIProvider";
import { MAX_QTY, useCart } from "@/components/cart/CartProvider";
import { formatPrice, productHref } from "@/data/products";
import { blurProps, QUALITY } from "@/lib/images";
import { ArrowDownIcon, CloseIcon, MinusIcon, PlusIcon, SearchIcon } from "@/components/ui/Icons";
import { SiteDrawer } from "./SiteDrawer";

const suggestions = ["Kurta sets", "Lehengas", "Dupattas"];

export function SearchDrawer() {
  const { closeDrawer } = useUI();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  return (
    <SiteDrawer
      name="search"
      side="right"
      render={<search-bar />}
      id="search-drawer"
      className="search-drawer Drawer--wrapper Drawer--Right colorGroup--primary"
      initialFocus={inputRef}
    >
      <div className="Drawer--Wrapper">
        <div className="search__inner-wrapper search-drawer__inner">
          <div className="search-drawer__body">
            <div className="search-drawer__right-col">
              <header className="search-drawer__header">
                <button type="button" className="search-drawer__close Drawer--Close" aria-label="Close" onClick={closeDrawer}>
                  <CloseIcon />
                </button>
                <label className="search-input__wrapper hot-spot" htmlFor="search-drawer-input">
                  <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                    <SearchIcon />
                    <input type="hidden" name="type" value="product" />
                    <input
                      ref={inputRef}
                      className="search-input u-p2"
                      type="search"
                      id="search-drawer-input"
                      name="q"
                      placeholder="Search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="button" className="search-input--clear" onClick={() => setQuery("")}>
                      <span className="u-p2">Clear</span>
                    </button>
                  </form>
                </label>
              </header>
              <div className="search-drawer__form-col">
                <div className="search-initial-view search-drawer__initial">
                  <div className="search-initial-view--lists">
                    <div id="predictive-search__suggested-searches" className="predictive-search__inner-wrapper">
                      <h3 className="u-h3">Suggested searches</h3>
                      <ul className="search__suggested-results" id="suggested-search-list">
                        {suggestions.map((s) => (
                          <li key={s} className="u-p2" onClick={() => setQuery(s)}>
                            {" "}
                            {s}{" "}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteDrawer>
  );
}

export function CartDrawer() {
  const { closeDrawer } = useUI();
  const { items, count } = useCart();

  return (
    <SiteDrawer
      name="cart"
      side="right"
      render={<cart-drawer />}
      id="cart-drawer"
      className="colorGroup--primary Drawer--wrapper Drawer--Right cart-drawer"
    >
        <div className="cart-drawer__wrapper">
          <div className="cart-drawer__header">
            <div className="cart-drawer__header-wrapper">
              <h3 className="cart-drawer__title u-h2">
                {" "}
                {count} {count === 1 ? "item" : "items"}{" "}
              </h3>
              <button className="Drawer--Close" type="button" aria-label="Close" onClick={closeDrawer}>
                <CloseIcon />
              </button>
            </div>
          </div>
          {items.length ? (
            <CartContents />
          ) : (
            <div className="cart-drawer__content cart-drawer__content--empty">
              <div className="cart-drawer__cta">
                <div className="cart-drawer__inner-cta">
                  <p className="u-p2 cart-drawer--empty-title">Your cart is empty</p>
                  <Link href="/" className="Button Button--PrimaryOnLight" onClick={closeDrawer}>
                    <div className="ButtonTextContainer">
                      <span className="ButtonText">
                        <span className="button-txt u-pb1">Continue shopping</span>
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
    </SiteDrawer>
  );
}

/** Line items + subtotal footer, using the theme's `cart-item` / `cart-drawer__footer` markup. */
function CartContents() {
  const { closeDrawer } = useUI();
  const { items, subtotal, setQty, remove } = useCart();

  return (
    <div className="cart-drawer__content cart-drawer__content--full">
      <div className="cart-drawer__items">
        {items.map(({ product, size, qty }) => {
          const href = productHref(product.slug);
          const image = product.images[0];
          return (
            <div key={`${product.slug}-${size}`} className="cart-item">
              <div className="cart-item__inner">
                <Link
                  href={href}
                  className="cart-item__image AspectRatio"
                  style={{ "--aspect-ratio": "4/5" } as React.CSSProperties}
                  onClick={closeDrawer}
                >
                  <Image
                    src={image}
                    {...blurProps(image)}
                    alt={product.name}
                    fill
                    sizes="90px"
                    quality={QUALITY.tile}
                    style={{ objectFit: "cover", objectPosition: "50% 20%" }}
                  />
                </Link>
                <div className="cart-item__info">
                  <div className="cart-drawer__block">
                    <div className="cart-drawer__block-left">
                      <span className="u-s2">{product.brand}</span>
                      <div className="cart-drawer__block-text">
                        <Link href={href} className="cart-item__title u-p2" onClick={closeDrawer}>
                          {product.name}
                        </Link>
                      </div>
                      <div className="cart-item__option-wrapper u-p3">
                        <span className="cart-item__option">
                          Size: <span className="cart-item__option-value">{size}</span>
                        </span>
                      </div>
                    </div>
                    <div className="cart-drawer__block-right">
                      <span className="cart-item__price u-s2">{formatPrice(product.price * qty)}</span>
                    </div>
                  </div>
                  <div className="cart-item__price-action-block">
                    <div className="cart-item__actions-container">
                      <div className="cart-item__quantity-selector">
                        <button
                          type="button"
                          className="cart-item__quantity-button"
                          aria-label={`Decrease quantity of ${product.name}`}
                          onClick={() => setQty(product.slug, size, qty - 1)}
                        >
                          <MinusIcon />
                        </button>
                        <input className="cart-item__quantity u-p3" value={qty} readOnly aria-label="Quantity" />
                        <button
                          type="button"
                          className={`cart-item__quantity-button ${qty >= MAX_QTY ? "cart-item__quantity-button--disabled" : ""}`}
                          aria-label={`Increase quantity of ${product.name}`}
                          disabled={qty >= MAX_QTY}
                          onClick={() => setQty(product.slug, size, qty + 1)}
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cart-item__remove cart-item__remove--text u-p3 link-underline"
                      onClick={() => remove(product.slug, size)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-drawer__footer">
        <div className="cart_drawer__footer-totals">
          <div className="cd__subtotal-container cd__subtotal-container--subtotal u-s2">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="cd__subtotal-container--taxes u-p3">Shipping and taxes are calculated at checkout.</p>
        </div>
        <div className="cd__total-submit">
          {/* No checkout yet — the cart is browser-only for now. */}
          <button type="button" className="Button Button--PrimaryOnLight cart-drawer__checkout" disabled>
            <div className="ButtonTextContainer">
              <span className="ButtonText">
                <span className="button-txt u-pb1">Checkout — coming soon</span>
              </span>
            </div>
          </button>
        </div>
        <div className="cart-drawer__footer-bottom" />
      </div>
    </div>
  );
}

export function CountryDrawer() {
  const { closeDrawer } = useUI();

  return (
    <SiteDrawer
      name="country"
      side="right"
      render={<div />}
      id="modal-country"
      className="Drawer--wrapper Drawer--Right Drawer--OverHeader focusable country-selector country-selector-drawer colorGroup--primary"
      style={{ height: "auto" }}
    >
      <form
        id="localization-form"
        className="shopify-localization-form"
        onSubmit={(e) => {
          e.preventDefault();
          closeDrawer();
        }}
      >
        <localization-modal id="localization-modal">
          <div className="country-selector__header">
            <h5 id="localization-modal-title" className="country_selector__heading u-p2">
              {" "}
              You are shopping in India in INR (₹). Confirm or change your store settings below.{" "}
            </h5>
            <button type="button" className="Drawer--Close country_selector__close hot-spot" aria-label="Close" onClick={closeDrawer}>
              <CloseIcon />
            </button>
          </div>
          <div className="country-selector__body">
            <div className="country-selector__dropdown country-selector__dropdown--language">
              <div className="RevolutionSelectbox RevolutionSelectbox--Selectors rs-language__selectbox" style={{ display: "block" }}>
                <p className="u-p2 country-selector__language-label"> Choose language: </p>
                <button type="button" className="RevolutionSelectbox--Button rs-disabled">
                  <span className="country-flag--wrapper text-capitalize">
                    <div className="RevolutionSelectbox--Title u-p2">English</div>
                  </span>
                  <ArrowDownIcon />
                </button>
              </div>
            </div>
            <div className="country-selector__action">
              <button type="submit" className="Button Button--SecondaryOnDark country-selector__submit-button">
                <div className="ButtonTextContainer">
                  <span className="ButtonText">
                    <span className="button-txt u-pb1">CHOOSE &amp; SAVE</span>
                  </span>
                </div>
              </button>
            </div>
          </div>
        </localization-modal>
      </form>
    </SiteDrawer>
  );
}
