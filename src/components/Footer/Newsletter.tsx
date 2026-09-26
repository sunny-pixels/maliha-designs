"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { BoxFilledIcon, BoxLineIcon } from "@/components/ui/Icons";

const options = [
  { value: "FESTIVE", label: "Festive" },
  { value: "EVERYDAY", label: "Everyday" },
];

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [audience, setAudience] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && audience !== null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setDone(true);
    requestAnimationFrame(() => {
      if (successRef.current) gsap.fromTo(successRef.current, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4 });
    });
  };

  return (
    <div className="footer__newsletter-wrapper">
      <div className="u-p2 footer__newsletter-wrapper-subheading">
        {" "}
        Sign up for our newsletter for first access to new collections, lookbooks and offers.{" "}
      </div>
      {!done && (
        <div className="newsletter__wrapper">
          <form id="footer-newsletter-form" className="newsletter__form" onSubmit={submit}>
            <div className="newsletter__actions">
              <div className="newsletter__options">
                {options.map((o) => (
                  <label key={o.value} className="newsletter__option-label">
                    <input
                      type="radio"
                      name="audience"
                      value={o.value}
                      className="newsletter__option-input"
                      required
                      checked={audience === o.value}
                      onChange={() => setAudience(o.value)}
                    />
                    <span className="newsletter__option-icon">
                      <BoxLineIcon />
                    </span>
                    <span className="newsletter__option-icon newsletter__option-icon--checked">
                      <BoxFilledIcon />
                    </span>
                    <span className="newsletter__option-text u-p3">{o.label}</span>
                  </label>
                ))}
              </div>
              <div className="newsletter__inputs">
                <div className="newsletter__email-input-error-wrapper">
                  <div className="newsletter__email-input-wrapper field">
                    <input
                      type="email"
                      id="footerNewsletterEmail"
                      className="newsletter__email-input input-placeholder u-p2"
                      name="email"
                      placeholder="Your email*"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`newsletter__subscribe-button u-p1 ${valid ? "" : "disabled"}`}
                  disabled={!valid}
                >
                  {" "}
                  Send{" "}
                </button>
                <button type="button" className="newsletter__clear-button u-p1" onClick={() => setEmail("")}>
                  {" "}
                  Clear{" "}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <div ref={successRef} className="footer__newsletter--success u-p2" style={{ display: done ? undefined : "none" }}>
        <p>Thank you for subscribing!</p>
      </div>
    </div>
  );
}
