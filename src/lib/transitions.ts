/**
 * Colour-switch crossfade, via React's <ViewTransition> (see
 * node_modules/next/dist/docs/01-app/02-guides/view-transitions.md, "Crossfade
 * content within the same route").
 *
 * A colour swap is tagged with the `colour-change` transition type — by
 * `router.push(..., { transitionTypes })` on the product page, and by
 * `addTransitionType()` inside `startTransition` on product cards. Each
 * swapped region is a <ViewTransition key={slug} name=...> using `colourFade`,
 * so it animates for that type only and stays still for every other
 * transition (ordinary navigation, other cards). CSS: src/styles/transitions.css.
 */
export const COLOUR_CHANGE = "colour-change";

/** `share` / `enter` value: the `colour-fade` class for colour swaps, no animation otherwise. */
export const colourFade = { [COLOUR_CHANGE]: "colour-fade", default: "none" };
