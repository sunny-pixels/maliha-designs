import { Hanken_Grotesk } from "next/font/google";

// Free stand-in for Akzidenz-Grotesk Pro (Light 300 / Regular 400).
// To use the licensed face, replace this with next/font/local and keep
// `variable: "--font-brand"` — every type token reads from that variable.
export const brandFont = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-brand",
  display: "swap",
});
