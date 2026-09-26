// Brand details in one place. Update the contact details before launch.
export const brand = {
  name: "Maliha",
  fullName: "Maliha by Anar & Anoli",
  /** Transparent gold wordmark (≈3.77:1), trimmed from public/logo_new.png by scripts/prepare-assets.py. */
  logo: { src: "/logo-maliha.png", width: 539, height: 143 },
  footerLogo: { src: "/logo-maliha.png", width: 539, height: 143 },
  email: "hello@malihadesigns.com",
  phone: "+91 00000 00000",
  address: "Mumbai, India",
  country: "India",
  currency: "INR",
  socials: [
    { label: "INSTAGRAM", href: "https://www.instagram.com/maliha_designs/" },
    { label: "FACEBOOK", href: "https://www.facebook.com/" },
    { label: "PINTEREST", href: "https://www.pinterest.com/" },
  ],
} as const;
