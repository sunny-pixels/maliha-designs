// Per-section sizing, fed to `.ratio--responsive` / `.pad--responsive`
// (see src/styles/theme/inline.css). Values mirror the theme's section settings.

/** Aspect ratio as "w/h" for mobile (m) and desktop ≥1025px (d). */
export type Ratio = { m: string; d: string };

/** Padding in px: [top, bottom, sides] for mobile and desktop. */
export type Spacing = { m: [number, number, number]; d: [number, number, number] };

export const noPadding: Spacing = { m: [0, 0, 0], d: [0, 0, 0] };

export function ratioVars(r: Ratio) {
  return { "--ar-m": r.m, "--ar-d": r.d } as React.CSSProperties;
}

export function padVars({ m, d }: Spacing) {
  return {
    "--pt-m": `${m[0]}px`,
    "--pb-m": `${m[1]}px`,
    "--px-m": `${m[2]}px`,
    "--pt-d": `${d[0]}px`,
    "--pb-d": `${d[1]}px`,
    "--px-d": `${d[2]}px`,
  } as React.CSSProperties;
}
