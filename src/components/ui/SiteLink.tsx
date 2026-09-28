import Link from "next/link";
import type { ComponentProps } from "react";

/** Routes that have a page in `src/app`. Everything else is rendered inert until it's built. */
const LIVE_ROUTES = new Set(["/", "/woman", "/lookbook"]);

export function isLiveHref(href: string) {
  if (!href.startsWith("/")) return true; // external, mailto:, #anchor
  const path = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  return LIVE_ROUTES.has(path);
}

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Drop-in for `next/link`: links to unbuilt routes keep their styling but never navigate. */
export default function SiteLink({ href, prefetch, replace, scroll, shallow, onClick, ...rest }: Props) {
  if (isLiveHref(href)) {
    return <Link href={href} prefetch={prefetch} replace={replace} scroll={scroll} shallow={shallow} onClick={onClick} {...rest} />;
  }
  return <a {...rest} role={rest.role ?? "link"} aria-disabled="true" tabIndex={rest.tabIndex ?? 0} />;
}
