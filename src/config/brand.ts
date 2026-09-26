// Brand details in one place. Update the contact details before launch.
export const brand = {
  name: "Maliha",
  fullName: "Maliha by Anar & Anoli",
  /** Gold logo box, extracted from the SS21 lookbook (≈2.56:1). */
  logo: { src: "/logo.png", width: 636, height: 248 },
  footerLogo: { src: "/logo.png", width: 636, height: 248 },
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
