import { FavoritesFilledIcon, FavoritesIcon } from "@/components/ui/Icons";

type Props = {
  /** `swiper`: on the image (mobile); `breadcrumbs`: end of the breadcrumb row (desktop). */
  variant: "swiper" | "breadcrumbs";
  active: boolean;
  onToggle: () => void;
};

/** `.pdp-favorites-button`: local toggle only — favourites aren't saved yet. */
export function FavoriteButton({ variant, active, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`pdp-favorites-button toggle-favorites pdp-favorites-button--${variant} ${
        variant === "swiper" ? "not_desktop" : ""
      }`}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      data-action="toggle-favorites"
      onClick={onToggle}
    >
      <div className="empty-favorite" aria-hidden={active} style={{ display: active ? "none" : "flex" }}>
        <FavoritesIcon />
      </div>
      <div className="solid-favorite" aria-hidden={!active} style={{ display: active ? "flex" : "none" }}>
        <FavoritesFilledIcon />
      </div>
    </button>
  );
}
