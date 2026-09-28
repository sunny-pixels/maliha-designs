"use client";

import Link from "@/components/ui/SiteLink";
import { useEffect, useRef, useState } from "react";
import { useUI } from "@/components/UIProvider";
import { ArrowDownIcon, CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { useDrawerAnimation } from "./useDrawerAnimation";

const suggestions = ["Kurta sets", "Lehengas", "Dupattas"];

export function SearchDrawer() {
  const { drawer, closeDrawer } = useUI();
  const open = drawer === "search";
  const ref = useDrawerAnimation<HTMLElement>(open, "right");
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <search-bar
      ref={ref}
      id="search-drawer"
      className="search-drawer Drawer--wrapper Drawer--Right colorGroup--primary"
      aria-expanded={open}
      style={{ display: "none" }}
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
    </search-bar>
  );
}

export function CartDrawer() {
  const { drawer, closeDrawer } = useUI();
  const open = drawer === "cart";
  const ref = useDrawerAnimation<HTMLElement>(open, "right");

  return (
    <div className="shopify-section">
      <cart-drawer
        ref={ref}
        id="cart-drawer"
        className="colorGroup--primary Drawer--wrapper Drawer--Right cart-drawer"
        aria-expanded={open}
        style={{ display: "none" }}
      >
        <div className="cart-drawer__wrapper">
          <div className="cart-drawer__header">
            <div className="cart-drawer__header-wrapper">
              <h3 className="cart-drawer__title u-h2"> 0 items </h3>
              <button className="Drawer--Close" type="button" aria-label="Close" onClick={closeDrawer}>
                <CloseIcon />
              </button>
            </div>
          </div>
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
        </div>
      </cart-drawer>
    </div>
  );
}

export function CountryDrawer() {
  const { drawer, closeDrawer } = useUI();
  const open = drawer === "country";
  const ref = useDrawerAnimation<HTMLDivElement>(open, "right");

  return (
    <div
      ref={ref}
      id="modal-country"
      className="Drawer--wrapper Drawer--Right Drawer--OverHeader focusable country-selector country-selector-drawer colorGroup--primary"
      aria-expanded={open}
      style={{ display: "none", height: "auto" }}
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
    </div>
  );
}
